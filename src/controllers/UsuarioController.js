const HttpController = require("./HttpController");

class UsuarioController extends HttpController {
    configurarRotas(baseUrl) {
        // define a rota de cadastro de usuário
        this.express.post(`${baseUrl}/usuario`, this.cadastrar.bind(this));
    }

    cadastrar(req, res) {
        const dadosUsuario = req.body;

        req.logger.info('usuário cadastrado com sucesso');
        res.json(dadosUsuario);
    }
}

module.exports = UsuarioController;