import mongoose from 'mongoose'

const livroSchema = new mongoose.Schema(
    {
        codigo: { type: String, required: true, unique: true, trim: true },
        titulo: { type: String, required: true, trim: true },
    },
    { timestamps: true }
)

export default mongoose.model('Livro', livroSchema, 'livros')
