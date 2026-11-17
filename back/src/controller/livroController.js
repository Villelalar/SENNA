import mongoose from 'mongoose'
import Livro from '../models/livro.js'
import Pergunta from '../models/pergunta.js'

const camposPublicosPergunta = 'numero categoria enunciado alternativas'
// Perguntas sem respostaCorreta (ex.: quebra-cabeça que depende da imagem do
// livro) ficam de fora do jogo, em vez de bloquear o programa inteiro.
const comGabarito = { respostaCorreta: { $nin: [null, ''] } }
const CODIGO_REVISAO = '016'
const PERGUNTAS_POR_PROGRAMA_NA_REVISAO = 6

async function contarPerguntasPorLivro() {
	const contagem = await Pergunta.aggregate([
		{
			$group: {
				_id: '$livro',
				total: { $sum: 1 },
				comResposta: {
					$sum: {
						$cond: [{ $not: [{ $in: [{ $ifNull: ['$respostaCorreta', null] }, [null, '']] }] }, 1, 0],
					},
				},
			},
		},
	])

	return new Map(contagem.map((item) => [String(item._id), item]))
}

function embaralhar(lista) {
	for (let i = lista.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[lista[i], lista[j]] = [lista[j], lista[i]]
	}

	return lista
}

async function sortearPerguntasDaRevisao() {
	const perguntas = await Pergunta.find(comGabarito)
		.select(`${camposPublicosPergunta} livro`)
		.populate('livro', 'codigo')
		.lean()

	const porLivro = new Map()

	for (const pergunta of perguntas) {
		const codigo = pergunta.livro?.codigo
		if (!codigo) continue
		if (!porLivro.has(codigo)) porLivro.set(codigo, [])
		porLivro.get(codigo).push(pergunta)
	}

	return [...porLivro.keys()]
		.sort()
		.flatMap((codigo) => embaralhar(porLivro.get(codigo)).slice(0, PERGUNTAS_POR_PROGRAMA_NA_REVISAO))
		.map(({ livro, ...pergunta }) => pergunta)
}

export async function listarLivros(req, res) {
	try {
		const [livros, contagem] = await Promise.all([
			Livro.find().select('codigo titulo').sort({ codigo: 1 }).lean(),
			contarPerguntasPorLivro(),
		])

		const totalRevisao = livros.reduce(
			(soma, livro) =>
				soma + Math.min(contagem.get(String(livro._id))?.comResposta ?? 0, PERGUNTAS_POR_PROGRAMA_NA_REVISAO),
			0
		)

		return res.json(
			livros.map((livro) => {
				if (livro.codigo === CODIGO_REVISAO) {
					return { ...livro, revisao: true, totalPerguntas: totalRevisao, disponivel: totalRevisao > 0 }
				}

				const { total = 0, comResposta = 0 } = contagem.get(String(livro._id)) ?? {}

				return {
					...livro,
					revisao: false,
					totalPerguntas: comResposta,
					perguntasSemGabarito: total - comResposta,
					disponivel: comResposta > 0,
				}
			})
		)
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

		const totalPerguntas = await Pergunta.countDocuments({ livro: livro._id, ...comGabarito })

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

		if (livro.codigo === CODIGO_REVISAO) {
			return res.json(await sortearPerguntasDaRevisao())
		}

		const filtro = { livro: livro._id, ...comGabarito }

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

export async function responderPergunta(req, res) {
	try {
		const alternativa = req.body?.alternativa

		if (!Number.isInteger(alternativa)) {
			return res.status(400).json({ erro: 'alternativa deve ser o índice (número inteiro) da opção escolhida' })
		}

		if (!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).json({ erro: 'ID de pergunta inválido' })
		}

		const pergunta = await Pergunta.findById(req.params.id).select('+respostaCorreta')

		if (!pergunta) {
			return res.status(404).json({ erro: 'Pergunta não encontrada' })
		}

		if (pergunta.respostaCorreta == null) {
			return res.status(409).json({ erro: 'Esta pergunta ainda não tem gabarito' })
		}

		if (alternativa < 0 || alternativa >= pergunta.alternativas.length) {
			return res.status(400).json({ erro: 'Alternativa fora do intervalo' })
		}

		return res.json({ acertou: pergunta.alternativas[alternativa] === pergunta.respostaCorreta })
	} catch (error) {
		return res.status(500).json({ erro: error.message })
	}
}
