const express = require('express');
const router = express.Router();
 
const {
  criarUsuario,
  buscarPerfil,
} = require('../controllers/usuarioController');
 
// Precisa vir antes de "/:id" para não ser interpretada como um ID
router.get('/ranking', ranking);
 
router.post('/', criarUsuario);
router.get('/:id', buscarPerfil);

 
module.exports = router;
