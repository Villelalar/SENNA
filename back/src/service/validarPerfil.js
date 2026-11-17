import { campoOpcional, erroHttp } from './validarLogin.js'

export function validarPerfil({ nome, curso, instituicao } = {}) {
    if (typeof nome !== 'string' || !nome.trim()) {
        throw erroHttp(400, 'nome é obrigatório')
    }

    if (nome.trim().length > 80) {
        throw erroHttp(400, 'nome deve ter no máximo 80 caracteres')
    }

    return {
        nome: nome.trim(),
        curso: campoOpcional('curso', curso, 100),
        instituicao: campoOpcional('instituicao', instituicao, 100),
    }
}
