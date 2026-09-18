import Usuario from '../models/usuario.js'

export async function criarUsuario(req, res) {
	try {
		const { nome, email, senha } = req.body

		if (!nome || !email || !senha) {
			return res.status(400).json({ erro: 'nome, email e senha são obrigatórios' })
		}

		const usuario = await Usuario.create({ nome, email, senha })
		const usuarioSemSenha = usuario.toObject()
		delete usuarioSemSenha.senha

		return res.status(201).json(usuarioSemSenha)
	} catch (error) {
		if (error.code === 11000) {
			return res.status(409).json({ erro: 'E-mail já cadastrado' })
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
