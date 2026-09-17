import mongoose from "mongoose"

const livroSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true 
    },
    titulo: {
        type: String,
        required: true 
    }
}, {
    timestamps: true
})

const Livro = mongoose.model('Livro', livroSchema)

export default Livro