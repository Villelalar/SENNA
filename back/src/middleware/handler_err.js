/**
 * Middleware para rotas não encontradas (404).
 */
function rotaNaoEncontrada(req, res, next) {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
}

/**
 * Middleware genérico de tratamento de erros.
 * Deve ser o último middleware registrado no app.
 */
function tratadorDeErros(err, req, res, next) {
  console.error('Erro inesperado:', err);
  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno do servidor',
  });
}

module.exports = { rotaNaoEncontrada, tratadorDeErros };
