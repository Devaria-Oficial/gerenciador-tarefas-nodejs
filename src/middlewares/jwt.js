const jwt = require('jsonwebtoken');
const UsuarioRepository = require('../repositories/impl/MongoDBUsuarioRepository');

// define a lista de rotas publicas da aplicação
const rotasPublicas = [
    {
        url: '/api/login',
        metodo: 'POST'
    },
    {
        url: '/api/docs*',
        metodo: 'GET'
    },
    {
        url: '/api/usuario',
        metodo: 'POST'
    }
]

module.exports = (req, res, next) => {
    req.logger.info('verificando permissão de acesso a rota', `rota=${req.url}`);

    // verifica se a requisição recebida é de alguma rota publica
    const rotaPublica = rotasPublicas.find(rota => {
        const rotaPublicaContemWidcard = rota.url.indexOf('*') !== -1;
        const urlRrequisicaoContemParteDaRotaPublica = req.url.indexOf(rota.url.replace('*', '')) !== -1;

        return ( // os parentesis definem a prioridade de verificação das condições
            // verifica se a rota da requisição é identica
            rota.url === req.url
            || ( // ou a rota publica contem um '*' e a rota da requisição possui como parte da url a rota publica
                rotaPublicaContemWidcard
                && urlRrequisicaoContemParteDaRotaPublica
            )
        )
        && rota.metodo === req.method.toUpperCase()
    });
    
    if (rotaPublica) {
        req.logger.info('rota publica, requisição liberada');
        return next();
    }

    const authorization = req.headers.authorization;
    // verifica se o header de autorização foi informado
    if (!authorization) {
        req.logger.info('acesso negado, sem header de autorização');
        // http status 401 = acesso negado
        return res.status(401).json({
            status: 401,
            erro: 'acesso negado, você precisa enviar o header authorization'
        });
    }

    // pega o token de autorização, extraindo a parte do 'Bearer '
    // pega o texto do 8 caractere em diante
    const token = authorization.substr(7);
    if (!token) {
        req.logger.info('requisição sem token de acesso');
        return res.status(401).json({
            status: 401,
            erro: 'acesso negado, o token de acesso não foi informado'
        });
    }

    // verificar se o token é valido e foi gerado usando a nossa chave secreta
    jwt.verify(token, process.env.CHAVE_SECRETA_JWT, async (err, decoded) => {
        if (err) {
            req.logger.error('erro ao decodificar o token jwt', `token=${token}`);
            return res.status(401).json({
                status: 401,
                erro: 'acesso negado, problema ao decodificar o seu token de autorização'
            });
        }

        req.logger.debug('token jwt decodificado', `idUsuario=${decoded._id}`);

        const usuario = await UsuarioRepository.buscarPorId(decoded._id);
        if (!usuario) {
            req.logger.error('usuário não encontrado na base', `id=${decoded._id}`);
            return res.status(401).json({
                status: 401,
                erro: 'acesso negado, usuário não encontrado'
            });
        }

        // atribui a propriedade usuario da requisição, quem é o usuário autenticado
        req.usuario = usuario;
        next();
    });
}