import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        senha: { type: String, required: true, minlength: 6 },
        curso: { type: String, trim: true, maxlength: 100 },
        instituicao: { type: String, trim: true, maxlength: 100 },
        // Dias (dias desde 01/01/1970, no fuso do jogador) em que o usuário
        // respondeu pelo menos uma pergunta. Usado na sequência de dias.
        diasAtivos: { type: [Number], default: [] },
    },
    { timestamps: true }
)


usuarioSchema.pre('save', async function () {
    if (!this.isModified('senha')) {
        return
    }
    this.senha = await bcrypt.hash(this.senha, 12)
})


export default mongoose.model('Usuario', usuarioSchema)
