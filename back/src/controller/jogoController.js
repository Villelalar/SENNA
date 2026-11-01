import { jogos } from '../service/jogos/catalogo.js'

export function listarJogos(req, res) {
	return res.json(jogos)
}
