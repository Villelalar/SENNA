import Usuario from '../models/usuario.js'
import {validarLogin,validarCadastro} from '../service/validarLogin.js'

export async function criarUsuario(req, res) {

	try {
		
		const { nome, email, senha } = validarCadastro(req.body)

		const usuarioCriado = await Usuario.create({ nome, email, senha })
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
