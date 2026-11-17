import mongoose from 'mongoose'
import Livro from '../models/livro.js'
import Partida from '../models/partida.js'
import Usuario from '../models/usuario.js'
import { validarAtividade, validarPartida } from '../service/validarPartida.js'

async function usuarioExiste(id) {
	return mongoose.isValidObjectId(id) && (await Usuario.exists({ _id: id }))
}

export async function salvarPartida(req, res) {
	try {
		if (!(await usuarioExiste(req.params.id))) {
			return res.status(404).json({ erro: 'Usuário não encontrado' })
		}

		const dados = validarPartida(req.body)

		if (!(await Livro.exists({ codigo: dados.codigo }))) {
			return res.status(404).json({ erro: 'Livro não encontrado' })
		}

		const partida = await Partida.create({ ...dados, usuario: req.params.id })

		return res.status(201).json(partida)
	} catch (error) {
		if (error.status) {
			return res.status(error.status).json({ erro: error.message })
		}

		if (error.name === 'ValidationError') {
			return res.status(400).json({ erro: error.message })
		}

		return res.status(500).json({ erro: error.message })
	}
}

export async function listarPartidas(req, res) {
	try {
		if (!(await usuarioExiste(req.params.id))) {
			return res.status(404).json({ erro: 'Usuário não encontrado' })
		}

		const partidas = await Partida.find({ usuario: req.params.id })
			.select('codigo pontos totais dia createdAt')
			.sort({ createdAt: 1 })

		return res.json(partidas)
	} catch (error) {
		return res.status(500).json({ erro: error.message })
	}
}

export async function zerarPartidas(req, res) {
	try {
		if (!(await usuarioExiste(req.params.id))) {
			return res.status(404).json({ erro: 'Usuário não encontrado' })
		}

		const { deletedCount } = await Partida.deleteMany({ usuario: req.params.id })
		await Usuario.updateOne({ _id: req.params.id }, { $set: { diasAtivos: [] } })

		return res.json({ removidas: deletedCount })
	} catch (error) {
		return res.status(500).json({ erro: error.message })
	}
}

export async function registrarAtividade(req, res) {
	try {
		if (!(await usuarioExiste(req.params.id))) {
			return res.status(404).json({ erro: 'Usuário não encontrado' })
		}

		const { dia } = validarAtividade(req.body)

		const usuario = await Usuario.findByIdAndUpdate(
			req.params.id,
			{ $addToSet: { diasAtivos: dia } },
			{ new: true }
		).select('diasAtivos')

		return res.status(201).json({ dias: usuario.diasAtivos })
	} catch (error) {
		if (error.status) {
			return res.status(error.status).json({ erro: error.message })
		}

		return res.status(500).json({ erro: error.message })
	}
}

export async function listarAtividade(req, res) {
	try {
		if (!(await usuarioExiste(req.params.id))) {
			return res.status(404).json({ erro: 'Usuário não encontrado' })
		}

		const usuario = await Usuario.findById(req.params.id).select('diasAtivos')

		return res.json({ dias: usuario.diasAtivos ?? [] })
	} catch (error) {
		return res.status(500).json({ erro: error.message })
	}
}
