import express from "express"
import cors from "cors"
import path from "path"
import dotenv from "dotenv"
import bookRoutes from "./routes/bookRoutes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Servir arquivos estáticos apenas em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  app.use(express.static(path.join(__dirname, "../public")))
}

// Rotas
app.use("/api/books", bookRoutes)

// Para desenvolvimento local
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
}

// Importante: exportar o app para o ambiente serverless da Vercel
export default app
