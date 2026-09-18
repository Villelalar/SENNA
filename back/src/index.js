import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import swaggerUi from 'swagger-ui-express'
import routes from './route/routes.js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'


const app = express()
app.use(express.json())

const swaggerPath = fileURLToPath(new URL('../swagger.yml', import.meta.url))
const swaggerDocument = YAML.parse(readFileSync(swaggerPath, 'utf8'))

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})
app.use('/api', routes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get('/api-docs.json', (req, res) => {
    res.json(swaggerDocument)
})

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