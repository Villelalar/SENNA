import express from 'express';
const router = express.Router();
 
import { criarUsuario, buscarPerfil } from '../controller/usuarioController.js';
 
// Precisa vir antes de "/:id" para não ser interpretada como um ID
 
router.post('/users/create', criarUsuario);
router.get('/users/:id', buscarPerfil);

 
export default router;
