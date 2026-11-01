import Usuario from '../models/usuario.js'
import bcrypt from 'bcryptjs'

function erroHttp(status, mensagem) {
    const erro = new Error(mensagem)
    erro.status = status
    return erro
}

export async function validarLogin({ email, senha } = {}) {

    if (!email || !senha) {
        throw erroHttp(400, 'email e senha são obrigatórios')
    }

    const usuario = await Usuario.findOne({ email: email.trim().toLowerCase() })
    const isMatch = usuario && await bcrypt.compare(senha, usuario.senha)

    if (!isMatch) {
        throw erroHttp(401, 'E-mail ou senha inválidos')
    }

    return usuario
}

export function validarCadastro({ nome, email, senha } = {}) {

    if (!nome || !email || !senha) {
        throw erroHttp(400, 'nome, email e senha são obrigatórios')
    }

    const emailNormalizado = email.trim().toLowerCase()
    const regex = /^[^\s@]+@gmail\.com$/

    if (!regex.test(emailNormalizado)) {
        throw erroHttp(400, 'E-mail inválido, apenas domínio @gmail.com é permitido')
    }

    if (senha.length > 8) {
        throw erroHttp(400, 'Senha inválida, deve ter no máximo 8 caracteres')
    }

    return { nome, email: emailNormalizado, senha }
}