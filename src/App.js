const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.json');
const LoginController = require('./controllers/LoginController');
const UsuarioController = require('./controllers/UsuarioController');
const AppConstants = require('./enum/AppConstants');
const MongoDBConnectionHelper = require('./helpers/MongoDBConnectionHelper');

const cors = require('./middlewares/cors');
const logger = require('./middlewares/logger');
const jwt = require('./middlewares/jwt');
const TarefaController = require('./controllers/TarefaController');

class App {
    #controllers;

    iniciar() {
        // configurar o express
        this.#configurarExpress();
        // configurar conexão com banco de dados
        this.#configurarBancoDeDados();
        // carregar os controllers
        this.#carregarControllers();
        // iniciar o servidor
        this.#iniciarServidor();
    }

    #configurarExpress = () => {
        // cria a instância do express para gerenciar o servidor
        this.express = express();

        // registra o middleware para fazer log das requisições
        this.express.use(logger);

        // registra os middlewares para fazer a conversão das requisições da API
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.json());

        // registra o middleware para habilitar requisições de outros dominios
        this.express.use(cors);

        // registra o middleware do jwt para fazer validação do acesso as rotas através das requisições recebidas
        this.express.use(jwt);

        // configura o swagger da aplicação para servir a documentação
        this.express.use(
            `${AppConstants.BASE_API_URL}/docs`,
            swaggerUi.serve,
            swaggerUi.setup(swaggerFile)
        );
    }

    #configurarBancoDeDados = () => {
        MongoDBConnectionHelper.conectar();
    }

    #carregarControllers = () => {
        // atribui para propriedade #controllers a lista de controllers disponiveis da aplicação
        this.#controllers = [
            new LoginController(this.express),
            new UsuarioController(this.express),
            new TarefaController(this.express)
        ];
    }

    #iniciarServidor = () => {
        // tenta pegar a porta a partir da variavel de ambiente EXPRESS_PORT
        // se não tiver definida, vai usar a porta padrão 3001
        const port = process.env.EXPRESS_PORT || 3001;
        this.express.listen(port, () => {
            console.log(`Aplicação executando na porta ${port}`);
        });
    }
}

module.exports = App;