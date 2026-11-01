import express from 'express';
const router = express.Router();
 
import { criarUsuario, buscarPerfil, loginUsuario } from '../controller/usuarioController.js';
import { listarLivros, buscarLivro, listarPerguntasDoLivro, buscarPerguntaDoLivro } from '../controller/livroController.js';
import { listarJogos } from '../controller/jogoController.js';
 

router.post('/users/create', criarUsuario);
router.get('/users/:id', buscarPerfil);

router.post('/users/login', loginUsuario);

router.get('/livros', listarLivros);
router.get('/livros/:codigo', buscarLivro);
router.get('/livros/:codigo/perguntas', listarPerguntasDoLivro);
router.get('/livros/:codigo/perguntas/:numero', buscarPerguntaDoLivro);

router.get('/jogos', listarJogos);
 
export default router;
