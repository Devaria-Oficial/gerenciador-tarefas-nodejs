const jwt = require('jsonwebtoken');

class LoginService {
    logar(login, senha) {
        // TODO: verificar se o usuário esta cadastrado no banco de dados
        const usuario = {
            id: 1,
            nome: 'Usuário Fake',
            email: 'email@blablabla.com'
        }

        // Gera o token de acesso usando o JWT
        const token = jwt.sign({ _id: usuario.id }, process.env.CHAVE_SECRETA_JWT);

        // Devolve as informações do usuário autenticado com o seu token de acesso
        return {
            ...usuario,
            token
        }
    }
}

module.exports = LoginService;