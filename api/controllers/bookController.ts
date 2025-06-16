import type { Request, Response } from "express"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "../config/database"
import { validationResult } from "express-validator"

export class BookController {
    // GET todos os livros
    static async getAllBooks(req: Request, res: Response) {
        try {
            const db = await connectToDatabase()
            const books = await db.collection("books").find({}).toArray()
            res.json(books)
        } catch (error) {
            console.error("Erro ao buscar livros:", error)
            res.status(500).json({ message: "Erro ao buscar livros", error })
        }
    }

    // GET livro por ID
    static async getBookById(req: Request, res: Response) {
        try {
            const db = await connectToDatabase()
            const id = new ObjectId(req.params.id)
            const book = await db.collection("books").findOne({ _id: id })

            if (!book) {
                return res.status(404).json({ message: "Livro não encontrado" })
            }

            res.json(book)
        } catch (error) {
            console.error("Erro ao buscar livro:", error)
            res.status(500).json({ message: "Erro ao buscar livro", error })
        }
    }

    // GET livros com consulta complexa
    static async advancedSearch(req: Request, res: Response) {
        try {
            const db = await connectToDatabase()
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { minPrice, maxPrice, minPages, genre, fromDate } = req.query

            let query: any = {}

            // Monta a consulta com operadores
            if (minPrice || maxPrice) {
                query.price = {}
                if (minPrice) query.price.$gte = Number.parseFloat(minPrice as string)
                if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice as string)
            }

            if (minPages) {
                query.pageCount = { $gte: Number.parseInt(minPages as string) }
            }

            if (genre) {
                query.genre = genre
            }

            if (fromDate) {
                query.publicationDate = { $gte: new Date(fromDate as string) }
            }

            // Usa operador $and para combinação lógica se houver múltiplas condições
            if (Object.keys(query).length > 1) {
                const conditions = Object.entries(query).map(([key, value]) => ({
                    [key]: value,
                }))
                query = { $and: conditions }
            }

            const books = await db.collection("books").find(query).toArray()
            res.json(books)
        } catch (error) {
            console.error("Erro ao buscar livros:", error)
            res.status(500).json({ message: "Erro ao buscar livros", error })
        }
    }

    // POST novo livro
    static async createBook(req: Request, res: Response) {
        try {
            const db = await connectToDatabase()
            const book = {
                ...req.body,
                publicationDate: new Date(req.body.publicationDate),
                createdAt: new Date(),
            }

            const result = await db.collection("books").insertOne(book)
            res.status(201).json({
                message: "Livro criado com sucesso",
                bookId: result.insertedId,
                book,
            })
        } catch (error) {
            console.error("Erro ao criar livro:", error)
            res.status(500).json({ message: "Erro ao criar livro", error })
        }
    }

    // PUT atualiza livro
    static async updateBook(req: Request, res: Response) {
        try {
            const db = await connectToDatabase()
            const id = new ObjectId(req.params.id)

            const book = {
                ...req.body,
                publicationDate: new Date(req.body.publicationDate),
                updatedAt: new Date(),
            }

            const result = await db.collection("books").updateOne({ _id: id }, { $set: book })

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: "Livro não encontrado" })
            }

            res.json({ message: "Livro atualizado com sucesso", book })
        } catch (error) {
            console.error("Erro ao atualizar livro:", error)
            res.status(500).json({ message: "Erro ao atualizar livro", error })
        }
    }

    // DELETE livro
    static async deleteBook(req: Request, res: Response) {
        try {
            const db = await connectToDatabase()
            const id = new ObjectId(req.params.id)

            const result = await db.collection("books").deleteOne({ _id: id })

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Livro não encontrado" })
            }

            res.json({ message: "Livro excluído com sucesso" })
        } catch (error) {
            console.error("Erro ao excluir livro:", error)
            res.status(500).json({ message: "Erro ao excluir livro", error })
        }
    }
}
