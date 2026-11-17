import express from 'express';
const router = express.Router();
 
import { criarUsuario, buscarPerfil, buscarPerfilPorNome, loginUsuario, atualizarPerfil } from '../controller/usuarioController.js';
import { listarLivros, buscarLivro, listarPerguntasDoLivro, buscarPerguntaDoLivro, responderPergunta } from '../controller/livroController.js';
import { salvarPartida, listarPartidas, zerarPartidas, registrarAtividade, listarAtividade } from '../controller/partidaController.js';
import { listarJogos } from '../controller/jogoController.js';
 

router.post('/users/create', criarUsuario);
router.get('/users/nome/:nome', buscarPerfilPorNome);
router.get('/users/:id', buscarPerfil);
router.put('/users/:id', atualizarPerfil);

router.get('/users/:id/partidas', listarPartidas);
router.post('/users/:id/partidas', salvarPartida);
router.delete('/users/:id/partidas', zerarPartidas);

router.get('/users/:id/atividade', listarAtividade);
router.post('/users/:id/atividade', registrarAtividade);

router.post('/users/login', loginUsuario);

router.get('/livros', listarLivros);
router.get('/livros/:codigo', buscarLivro);
router.get('/livros/:codigo/perguntas', listarPerguntasDoLivro);
router.get('/livros/:codigo/perguntas/:numero', buscarPerguntaDoLivro);

router.post('/perguntas/:id/responder', responderPergunta);

router.get('/jogos', listarJogos);
 
export default router;
