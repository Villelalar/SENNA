import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        senha: { type: String, required: true, minlength: 6 },
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
