const HttpController = require('./HttpController');
const TarefaService = require('../services/TarefaService');

class TarefaController extends HttpController {
    configurarRotas(basePath) {
        this.express.get(`${basePath}/tarefa`, this.listar.bind(this));
        this.express.post(`${basePath}/tarefa`, this.cadastrar.bind(this));
        this.express.put(`${basePath}/tarefa/:id`, this.editar.bind(this));
        this.express.delete(`${basePath}/tarefa/:id`, this.deletar.bind(this));
    }

    async listar(req, res) {
        try {
            const servico = new TarefaService(req.usuario.id);
            const tarefas = await servico.listar(req.query);
            res.json(tarefas);
        } catch (e) {
            req.logger.error('erro ao processar requisição de listagem de tarefas', 'erro=' + e.message);
            res.status(500).json({
                status: 500,
                erro: 'Não foi possível listar as tarefas, tente novamente mais tarde!'
            });
        }
    }

    async cadastrar(req, res) {
        try {
            const servico = new TarefaService(req.usuario.id);
            const resultado = await servico.cadastrar(req.body);

            if (resultado.erros) {
                return res
                    .status(400)
                    .json({
                        status: 400,
                        erro: resultado.erros
                    });
            }

            return res.json({
                msg: 'Tarefa cadastrada com sucesso'
            });
        } catch (e) {
            req.logger.error('erro ao processar requisição de cadastro de tarefa', 'erro=' + e.message);
            res.status(500).json({
                status: 500,
                erro: 'Não foi possível cadastrar a tarefa, tente novamente mais tarde!'
            });
        }
    }

    async editar(req, res) {
        try {
            const servico = new TarefaService(req.usuario.id);
            const resposta = await servico.editar(req.params.id, req.body);
            if (resposta.erros) {
                return res
                    .status(400)
                    .json({
                        status: 400,
                        erro: resposta.erros
                    });
            }

            res.json({
                msg: 'Tarefa atualizada com sucesso'
            });
        } catch (e) {
            req.logger.error('erro ao processar requisição de edição de tarefa', 'erro=' + e.message);
            res.status(500).json({
                status: 500,
                erro: 'Não foi possível editar a tarefa, tente novamente mais tarde!'
            });
        }
    }

    async deletar(req, res) {
        try {
            const servico = new TarefaService(req.usuario.id);
            const resposta = await servico.deletar(req.params.id);
            if (resposta.erros) {
                return res
                    .status(400)
                    .json({
                        status: 400,
                        erro: resposta.erros
                    });
            }

            res.json({
                msg: 'Tarefa deletada com sucesso'
            });
        } catch (e) {
            req.logger.error('erro ao processar requisição de remoção de tarefa', 'erro=' + e.message);
            res.status(500).json({
                status: 500,
                erro: 'Não foi possível excluir a tarefa, tente novamente mais tarde!'
            });
        }
    }
}

module.exports = TarefaController;