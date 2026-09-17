import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import swaggerUi from 'swagger-ui-express'


const app = express()
app.use(express.json())

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Senna API',
        version: '1.0.0',
        description: 'Documentacao da API do projeto Pense Bem',
    },
    servers: [{ url: 'http://localhost:3000' }],
    paths: {
        '/health': {
            get: {
                summary: 'Verifica se a API esta funcionando',
                responses: {
                    200: {
                        description: 'API funcionando',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'ok' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
}

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})
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