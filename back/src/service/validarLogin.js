import Usuario from '../models/usuario.js'
import bcrypt from 'bcryptjs'

export async function validarLogin(req,res) {

    try {

        const { email, senha } = req.body

		if ( !email || !senha) {
			return res.status(400).json({ erro: ' email e senha são obrigatórios' })
		}

        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            return res.status(401).json({ erro: 'E-mail  inválidos' })
        }

        const isMatch = await bcrypt.compare(senha, usuario.senha)
        if (!isMatch) {
            return res.status(401).json({ erro: 'senha inválida' })
        }

        return usuario
        
    } catch (error) {
        throw new Error('E-mail ou senha inválidos')
    }
}

export async function validarCadastro(req,res){

    const { nome, email, senha } = req.body

		if (!nome || !email || !senha) {
			return res.status(400).json({ erro: 'nome, email e senha são obrigatórios' })
		}

     const regex =/^[^\s@]+@gmail.com$/;

        if (!regex.test(email)) {
            return res.status(401).json({ erro: 'E-mail inválido, apenas domínio @gmail.com é permitido' })
        }

        if(senha.length > 8){
            return res.status(401).json({ erro: 'Senha inválida, deve ter no máximo 8 caracteres' })
        }

        return { nome, email, senha };

}