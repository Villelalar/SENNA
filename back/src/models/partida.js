import mongoose from 'mongoose'

const partidaSchema = new mongoose.Schema(
    {
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true, index: true },
        codigo: { type: String, required: true, trim: true },
        pontos: { type: Number, required: true, min: 0 },
        totais: {
            type: [Number],
            validate: {
                validator: (valor) => valor.length === 4 && valor.every((n) => Number.isInteger(n) && n >= 0),
                message: 'totais deve ter 4 números inteiros não negativos',
            },
        },
        dia: { type: Number, required: true },
    },
    { timestamps: true }
)

export default mongoose.model('Partida', partidaSchema, 'partidas')
