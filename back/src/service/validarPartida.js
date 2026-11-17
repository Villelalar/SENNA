import { erroHttp } from './validarLogin.js'

const milissegundosPorDia = 86_400_000

export function validarPartida({ codigo, totais, dia } = {}) {
    if (typeof codigo !== 'string' || !codigo.trim()) {
        throw erroHttp(400, 'codigo do programa é obrigatório')
    }

    if (!Array.isArray(totais) || totais.length !== 4 || !totais.every((n) => Number.isInteger(n) && n >= 0)) {
        throw erroHttp(400, 'totais deve ter 4 números inteiros não negativos')
    }

    if (dia !== undefined && !Number.isInteger(dia)) {
        throw erroHttp(400, 'dia deve ser um número inteiro')
    }

    const [primeira, segunda, terceira] = totais

    return {
        codigo: codigo.trim(),
        totais,
        pontos: primeira * 3 + segunda * 2 + terceira,
        dia: dia ?? Math.floor(Date.now() / milissegundosPorDia),
    }
}

export function validarAtividade({ dia } = {}) {
    if (dia !== undefined && !Number.isInteger(dia)) {
        throw erroHttp(400, 'dia deve ser um número inteiro')
    }

    return { dia: dia ?? Math.floor(Date.now() / milissegundosPorDia) }
}
