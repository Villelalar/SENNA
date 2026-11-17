import Usuario from '../models/usuario.js'
import {validarLogin,validarCadastro} from '../service/validarLogin.js'
import { validarPerfil } from '../service/validarPerfil.js'

export async function criarUsuario(req, res) {

	try {
		
		const dados = validarCadastro(req.body)

		const usuarioCriado = await Usuario.create(dados)
		const usuarioSemSenha = usuarioCriado.toObject()
		delete usuarioSemSenha.senha

		return res.status(201).json(usuarioSemSenha)

	} catch (error) {
		if (error.status) {
			return res.status(error.status).json({ erro: error.message })
		}

		if (error.code === 11000) {
			return res.status(409).json({ erro: 'E-mail já cadastrado' })
		}

		if (error.name === 'ValidationError') {
			return res.status(400).json({ erro: error.message })
		}

		return res.status(500).json({ erro: error.message })
	}
}

export async function buscarPerfil(req, res) {
	try {
		const usuario = await Usuario.findById(req.params.id).select('-senha')

		if (!usuario) {
			return res.status(404).json({ erro: 'Usuário não encontrado' })
		}

		return res.json(usuario)
	} catch (error) {
		return res.status(400).json({ erro: 'ID de usuário inválido' })
	}
}

export async function loginUsuario(req, res) {
	try {
		
		const usuario = await validarLogin(req.body)
		const usuarioSemSenha = usuario.toObject()
		delete usuarioSemSenha.senha

		return res.status(200).json( usuarioSemSenha )

	} catch (error) {
		if (error.status) {
			return res.status(error.status).json({ erro: error.message })
		}

		return res.status(500).json({ erro: error.message })
	}
}

export async function atualizarPerfil(req, res) {
	try {
		const dados = validarPerfil(req.body)
		const usuario = await Usuario.findById(req.params.id)

		if (!usuario) {
			return res.status(404).json({ erro: 'Usuário não encontrado' })
		}

		usuario.set(dados)
		await usuario.save()

		const usuarioSemSenha = usuario.toObject()
		delete usuarioSemSenha.senha

		return res.json(usuarioSemSenha)
	} catch (error) {
		if (error.status) {
			return res.status(error.status).json({ erro: error.message })
		}

		if (error.name === 'CastError') {
			return res.status(400).json({ erro: 'ID de usuário inválido' })
		}

		if (error.name === 'ValidationError') {
			return res.status(400).json({ erro: error.message })
		}

		return res.status(500).json({ erro: error.message })
	}
}

export async function buscarPerfilPorNome(req, res) {
	try {
		const usuario = await Usuario.findOne({ nome: req.params.nome }).select('-senha')

		if (!usuario) {
			return res.status(404).json({ erro: 'Usuário não encontrado' })
		}

		return res.json(usuario)
	} catch (error) {
		return res.status(400).json({ erro: 'Nome de usuário inválido' })
	}
}
