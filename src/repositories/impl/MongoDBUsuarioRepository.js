const UsuarioRepository = require('../UsuarioRepository');
const Usuario = require('../../models/Usuario');

// transforma o usuario retornado do banco de dados, para o formato que a aplicação espera
const transformarUsuario = (usuarioBD) => {
    return {
        id: usuarioBD._doc._id.toString(),
        nome: usuarioBD._doc.nome,
        email: usuarioBD._doc.email
    }
}

class MongoDBUsuarioRepository {
    static cadastrar(dadosUsuario) {
        return Usuario.create(dadosUsuario);
    }

    // define o método filtrar com um parametro default
    static async filtrar(filtro = {}) {
        let usuarios = await Usuario.find(filtro);
        if (usuarios) {
            usuarios = usuarios.map(u => transformarUsuario(u))
        }

        return usuarios;
    }

    static async buscarPorId(idUsuario) {
        const usuarioBD = await Usuario.findById(idUsuario);
        if (usuarioBD) {
            return transformarUsuario(usuarioBD);
        }

        return null;
    }
}

module.exports = UsuarioRepository(MongoDBUsuarioRepository);