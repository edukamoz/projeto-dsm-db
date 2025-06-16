import { MongoClient } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const MONGODB_URI =
    "mongodb+srv://admin:ivNrNF1p8IN2M0Cs@movies.7uamh3o.mongodb.net/?retryWrites=true&w=majority&appName=movies"

let cachedDb: any = null

export async function connectToDatabase() {
    try {
        if (cachedDb) return cachedDb
        const client = new MongoClient(MONGODB_URI)
        await client.connect()
        cachedDb = client.db("book_collection")
        return cachedDb
    } catch (error) {
        console.error("Falha ao conectar ao MongoDB:", error)
        throw error
    }
}
