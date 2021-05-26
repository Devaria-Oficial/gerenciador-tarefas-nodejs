const AppConstants = require('../enum/AppConstants');

class HttpController {
    constructor(instanciaExpress) {
        if (!instanciaExpress) {
            throw new Error('A instância do express é obrigatória');
        }

        // persiste na propriedade express do controller a instância do express criada no App.js
        this.express = instanciaExpress;
        this.configurarRotas(AppConstants.BASE_API_URL);
    }

    configurarRotas(baseUrl) {
        throw new Error('Método configurarRotas precisa ser implementado!');
    }
}

module.exports = HttpController;