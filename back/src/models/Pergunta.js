import mongoose from "mongoose"

const perguntaSchema = new mongoose.Schema({
    livro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Livro',
        required: true
    },
    numero: {
        type: Number,
        required: true
    },
    enunciado: {
        type: String,
        required: true
    },
    alternativas: {
        type: [String],
        required: true
    },
    respostaCorreta: {
        type: String,
        required: true
    },
    categoria: {
        type: String
    },
    vitoria: {
        type: String
    },
    derrota: {
        type: String
    }
}, {
    timestamps: true
})

const Pergunta = mongoose.model('Pergunta', perguntaSchema)

export default Pergunta