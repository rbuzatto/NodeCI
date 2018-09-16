const puppeteer = require('puppeteer');

const sessionFactory = require('./../factories/sessionFactory');
const userFactory = require('./../factories/userFactory');

class Page {
    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        const customPage = new Page(page);

        return new Proxy(customPage, {
            get: function(target, property) {
                return customPage[property] || browser[property] || page[property];
                // o browser foi incluido a fim de facilitar o acesso no test, sem ter que usar browser...
                // aqui foi colocado browser na frente pq ambos tem .close(), como usamos só o do browser invertemos
                // obs > isso é meio coxa se não prestar atenção direito. afinal, vc não poderá usar .close() de page
            }
        })
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory(); // eventually you may refactor userFactory to accept some parameter to create one custom user rather than the default
        const { session, sig }  = sessionFactory(user);
    
        await this.page.setCookie({ name: 'session', value: session });    
        await this.page.setCookie({ name: 'session.sig', value: sig });
    
        // we need to rerender the page after setting the cookies, otherwise there's no visible change
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    get(path) {
        return this.page.evaluate((_path) => {
            return fetch(_path, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());
        }, path);
    }

    post(path, data) {
        return this.page.evaluate((_path, _data) => {
            return fetch(_path, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_data)
            }).then(res => res.json());
        }, path, data);
    }

    execRequests(actions) {
        // vale notar aqui o uso de promise.all para o map esperar resolver todas promises juntas
        return Promise.all(
            actions.map(({ method, path, data }) => {
                return this[method](path, data);
            })
        );
    }
}

module.exports = Page;