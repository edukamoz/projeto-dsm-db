import express from "express"
import cors from "cors"
import path from "path"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import { specs } from "./config/swagger"
import bookRoutes from "./routes/bookRoutes"
import authRoutes from "./routes/authRoutes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// Servir arquivos estáticos apenas em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  app.use(express.static(path.join(__dirname, "../public")))
}

// Rotas
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

// Rota de informações da API
app.get("/api", (req, res) => {
  res.json({
    message: "Book Manager API",
    version: "1.0.0",
    documentation: "/api-docs",
    endpoints: {
      auth: "/api/auth",
      books: "/api/books",
    },
  })
})

// Para desenvolvimento local
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
    console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`)
  })
}

// Importante: exportar o app para o ambiente serverless da Vercel
export default app
