import type { Request, Response } from "express"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "../config/database"
import { validationResult } from "express-validator"

export class BookController {
    /**
     * @swagger
     * /api/books:
     *   get:
     *     summary: Lista todos os livros
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de livros
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Book'
     *       401:
     *         description: Token não fornecido
     *       403:
     *         description: Token inválido
     */
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

    /**
     * @swagger
     * /api/books/{id}:
     *   get:
     *     summary: Obtém um livro por ID
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do livro
     *     responses:
     *       200:
     *         description: Dados do livro
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       404:
     *         description: Livro não encontrado
     *       401:
     *         description: Token não fornecido
     *       403:
     *         description: Token inválido
     */
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

    /**
     * @swagger
     * /api/books/search/advanced:
     *   get:
     *     summary: Busca avançada de livros
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: minPrice
     *         schema:
     *           type: number
     *         description: Preço mínimo
     *       - in: query
     *         name: maxPrice
     *         schema:
     *           type: number
     *         description: Preço máximo
     *       - in: query
     *         name: minPages
     *         schema:
     *           type: integer
     *         description: Número mínimo de páginas
     *       - in: query
     *         name: genre
     *         schema:
     *           type: array
     *           items:
     *             type: string
     *         description: Gêneros (pode ser múltiplos)
     *       - in: query
     *         name: fromDate
     *         schema:
     *           type: string
     *           format: date
     *         description: Data de publicação a partir de
     *     responses:
     *       200:
     *         description: Lista de livros filtrados
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Book'
     */
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

            // Suporte para múltiplos gêneros
            if (genre) {
                const genres = Array.isArray(genre) ? genre : [genre]
                query.genre = { $in: genres }
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

    /**
     * @swagger
     * /api/books:
     *   post:
     *     summary: Cria um novo livro
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/BookInput'
     *     responses:
     *       201:
     *         description: Livro criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 bookId:
     *                   type: string
     *                 book:
     *                   $ref: '#/components/schemas/Book'
     */
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

    /**
     * @swagger
     * /api/books/{id}:
     *   put:
     *     summary: Atualiza um livro
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do livro
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/BookInput'
     *     responses:
     *       200:
     *         description: Livro atualizado com sucesso
     *       404:
     *         description: Livro não encontrado
     */
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

    /**
     * @swagger
     * /api/books/{id}:
     *   delete:
     *     summary: Exclui um livro
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID do livro
     *     responses:
     *       200:
     *         description: Livro excluído com sucesso
     *       404:
     *         description: Livro não encontrado
     */
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
