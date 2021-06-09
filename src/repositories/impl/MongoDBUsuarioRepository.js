const UsuarioRepository = require('../UsuarioRepository');
const Usuario = require('../../models/Usuario');

class MongoDBUsuarioRepository {
    static cadastrar(dadosUsuario) {
        return Usuario.create(dadosUsuario);
    }

    // define o método filtrar com um parametro default
    static filtrar(filtro = {}) {
        return Usuario.find(filtro);
    }
}

module.exports = UsuarioRepository(MongoDBUsuarioRepository);