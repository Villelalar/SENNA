import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'


const app = express()
app.use(express.json())

// ROUTES

// EVENT
app.listen(3000, async () => {
    try {
        const result = await mongoose.connect(process.env.MONGODB_URI)
        console.log(result ? "Database On" : "Database Off")
        console.log("Projeto ON")
    }
    catch (err) {
        console.error("Erro ao conectar com o banco de dados", err)
    }
})