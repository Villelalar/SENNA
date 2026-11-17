import Usuario from '../models/usuario.js'
import bcrypt from 'bcryptjs'

export function erroHttp(status, mensagem) {
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

export function validarCadastro({ nome, email, senha, curso, instituicao } = {}) {

    if (!nome || !email || !senha) {
        throw erroHttp(400, 'nome, email e senha são obrigatórios')
    }

    const emailNormalizado = email.trim().toLowerCase()
    const regex = /^[^\s@]+@gmail\.com$/

    if (!regex.test(emailNormalizado)) {
        throw erroHttp(400, 'E-mail inválido, apenas domínio @gmail.com é permitido')
    }

    if (typeof senha !== 'string' || senha.length < 6) {
        throw erroHttp(400, 'Senha inválida, deve ter no mínimo 6 caracteres')
    }

    if (senha.length > 8) {
        throw erroHttp(400, 'Senha inválida, deve ter no máximo 8 caracteres')
    }

    const dados = { nome, email: emailNormalizado, senha }

    for (const [campo, valor] of Object.entries({ curso, instituicao })) {
        const texto = campoOpcional(campo, valor, 100)
        if (texto) dados[campo] = texto
    }

    return dados
}

export function campoOpcional(campo, valor, limite) {
    if (valor === undefined || valor === null) return undefined

    if (typeof valor !== 'string') {
        throw erroHttp(400, `${campo} deve ser um texto`)
    }

    const texto = valor.trim()

    if (texto.length > limite) {
        throw erroHttp(400, `${campo} deve ter no máximo ${limite} caracteres`)
    }

    return texto || undefined
}