const Buffer  = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys    = require('./../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
    const sessionObject = {
        passport: {
            user: user._id.toString()
        }
    };

    // session cookie is created with an object model like above
    // you need to stringify it before you pass to the Buffer
    // then you convert to a string in base64

    const session = Buffer
        .from(JSON.stringify(sessionObject)) // returns <Buffer 7b 22 70 61 73  ... 22 7d 7d>
        .toString('base64');
    
    // session.sig (signature) is handled by keygrip;
    // you instantiate a Keygrip passing the 'private key'
    // then you generate a session.sig calling sign method with ('session=' + session)    
    const sig = keygrip.sign('session=' + session);

    return { session, sig }
};