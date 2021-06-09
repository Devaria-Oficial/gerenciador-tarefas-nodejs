const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const md5 = require('md5');

const mensagemErroObrigatorio = '*Campo obrigatório!';
const UsuarioSchema = new Schema({
    nome: {
        type: String,
        required: [true, mensagemErroObrigatorio]
    },
    email: {
        type: String,
        required: [true, mensagemErroObrigatorio]
    },
    senha: {
        type: String,
        required: [true, mensagemErroObrigatorio]
    }
});

// define um evento que é executado antes do usuario ser salvo no banco
UsuarioSchema.pre('save', function (next) {
    // criptografa a senha do usuário para não ficar exposta no banco
    this.senha = md5(this.senha);
    next();
});

// faz o link do schema com a collection (leia tabela) 'usarios'
const Usuario = mongoose.model('usuarios', UsuarioSchema);
module.exports = Usuario;