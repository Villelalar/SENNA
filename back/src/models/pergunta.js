import mongoose from 'mongoose'

const perguntaSchema = new mongoose.Schema(
    {
        livro: { type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true },
        numero: { type: Number, required: true },
        categoria: { type: String, trim: true },
        enunciado: { type: String, required: true, trim: true },
        alternativas: {
            type: [String],
            validate: {
                validator: (valor) => valor.length >= 4,
                message: 'A pergunta precisa de pelo menos 4 alternativas',
            },
        },
        respostaCorreta: { type: String, required: true, select: false },
    },
    { timestamps: true }
)

perguntaSchema.index({ livro: 1, numero: 1 }, { unique: true })

export default mongoose.model('Pergunta', perguntaSchema, 'perguntas')
