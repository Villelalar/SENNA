import Livro from '../models/livro.js'
import Pergunta from '../models/pergunta.js'

const camposPublicosPergunta = 'numero categoria enunciado alternativas'

export async function listarLivros(req, res) {
	try {
		const livros = await Livro.find().select('codigo titulo').sort({ codigo: 1 })

		return res.json(livros)
	} catch (error) {
		return res.status(500).json({ erro: error.message })
	}
}

export async function buscarLivro(req, res) {
	try {
		const livro = await Livro.findOne({ codigo: req.params.codigo }).select('codigo titulo')

		if (!livro) {
			return res.status(404).json({ erro: 'Livro não encontrado' })
		}

		const totalPerguntas = await Pergunta.countDocuments({ livro: livro._id })

		return res.json({ ...livro.toObject(), totalPerguntas })
	} catch (error) {
		return res.status(500).json({ erro: error.message })
	}
}

export async function listarPerguntasDoLivro(req, res) {
	try {
		const livro = await Livro.findOne({ codigo: req.params.codigo })

		if (!livro) {
			return res.status(404).json({ erro: 'Livro não encontrado' })
		}

		const filtro = { livro: livro._id }

		if (req.query.categoria) {
			filtro.categoria = req.query.categoria
		}

		const perguntas = await Pergunta.find(filtro).select(camposPublicosPergunta).sort({ numero: 1 })

		return res.json(perguntas)
	} catch (error) {
		return res.status(500).json({ erro: error.message })
	}
}

export async function buscarPerguntaDoLivro(req, res) {
	try {
		const numero = Number(req.params.numero)

		if (!Number.isInteger(numero)) {
			return res.status(400).json({ erro: 'Número da pergunta inválido' })
		}

		const livro = await Livro.findOne({ codigo: req.params.codigo })

		if (!livro) {
			return res.status(404).json({ erro: 'Livro não encontrado' })
		}

		const pergunta = await Pergunta.findOne({ livro: livro._id, numero }).select(camposPublicosPergunta)

		if (!pergunta) {
			return res.status(404).json({ erro: 'Pergunta não encontrada neste livro' })
		}

		return res.json(pergunta)
	} catch (error) {
		return res.status(500).json({ erro: error.message })
	}
}
