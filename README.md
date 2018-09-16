# AdvancedNodeStarter
Starting project for a course on Advanced Node @ Udemy

- utilize um setup.js file. jest só executa .test.js files, portanto conexões com mongoose, por exemplo, precisam ser definidas antes;
- lembre de "setupTestFrameworkScriptFile": "./tests/setup.js" para usar o setup.js
- crie factories, DRY;

tenha em mente:
- não esquecer de await em async functions;
- ao refatorar, e transpor códigos em outros arquivos; 
- primeiro cheque roots de diretórios que devem ser mudados
- depois cheque a referencia de chamada das próprias funções se mudou

em relação ao puppeteer:
- args em .evaluate de puppeteer, precisa-se passar args como segundo argumento. após pode-se usar como params dentro da função;
- ocasionalmente é necessário usar .waitFor já que o carregamento dos elms pode ser mais devagar que a chamada das funções seguintes

O refactor traz alguns pontos interessantes:
- ao usar promises dentro de .map, é necessário envolvê-la com Promise.all();

sobre o factory de session:
- passport se utiliza de keygrip para autenticar usuário. eles extraem de session e session.sig (signature);
- uma cookie key em conjunto com um objeto é que irá gerar session.sig, garantido que session não foi manipulada;
- com a criação de uma session e session.sig podemos simular um user logado no blog e realizar tests.

em page foi apresentado a estratégia de se usar Proxie ao invés de modificar a biblioteca. no caso, é criado o objeto da bibioteca e ele é passado para a nova classe. um Proxie é retornado; ele verifica se dado método existe na classe ou se pertence a biblioteca, e a retorna aonde for encontrada. problemas podem ocorrer se métodos com mesmo nome se encontrarem em mais de um objeto, aí é bom prestar atenção.

antes, em cache, usamos a estratégia de alterar a biblioteca original. criamos um .cache, que caso chamado estabelecia a chamada de cache. e o .exec de Query de mongoose foi alterado também para verificar se cache será usado, acessando assim redis. redis busca o valor em seu cache; caso ache o retorna; caso não, executa exec de Query, grava em seu cache e depois retorna o resultado.


