import express, { Request, Response } from "express"
import { MongoClient, ObjectId } from "mongodb"
import cors from "cors"
import { body, param, query, validationResult } from "express-validator"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://your_mongodb_connection_string"

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

// MongoDB Connection
let db: any

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log("Connected to MongoDB")
    db = client.db("book_collection")
    return db
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    process.exit(1)
  }
}

// Validation middleware
const validateBook = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("publicationDate").isISO8601().withMessage("Publication date must be a valid date"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number with decimals"),
  body("pageCount").isInt({ min: 1 }).withMessage("Page count must be a positive integer"),
  body("genre").notEmpty().withMessage("Genre is required"),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]

// Routes
// GET all books
app.get("/api/books", async (req: Request, res: Response) => {
  try {
    const books = await db.collection("books").find({}).toArray()
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error })
  }
})

// GET book by ID
app.get("/api/books/:id", async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id)
    const book = await db.collection("books").findOne({ _id: id })

    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    res.json(book)
  } catch (error) {
    res.status(500).json({ message: "Error fetching book", error })
  }
})

// GET books with complex query (using operators)
app.get(
  "/api/books/search/advanced",
  [
    query("minPrice").optional().isFloat().withMessage("Min price must be a number"),
    query("maxPrice").optional().isFloat().withMessage("Max price must be a number"),
    query("minPages").optional().isInt().withMessage("Min pages must be an integer"),
    query("genre").optional().isString().withMessage("Genre must be a string"),
    query("fromDate").optional().isISO8601().withMessage("From date must be a valid date"),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { minPrice, maxPrice, minPages, genre, fromDate } = req.query

      let query: any = {}

      // Build query with operators
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

      // Use $or operator for logical combination if we have multiple conditions
      if (Object.keys(query).length > 1) {
        const conditions = Object.entries(query).map(([key, value]) => ({ [key]: value }))
        query = { $and: conditions }
      }

      const books = await db.collection("books").find(query).toArray()
      res.json(books)
    } catch (error) {
      res.status(500).json({ message: "Error searching books", error })
    }
  },
)

// POST new book
app.post("/api/books", validateBook, async (req: Request, res: Response) => {
  try {
    const book = {
      ...req.body,
      publicationDate: new Date(req.body.publicationDate),
      createdAt: new Date(),
    }

    const result = await db.collection("books").insertOne(book)
    res.status(201).json({
      message: "Book created successfully",
      bookId: result.insertedId,
      book,
    })
  } catch (error) {
    res.status(500).json({ message: "Error creating book", error })
  }
})

// PUT update book
app.put(
  "/api/books/:id",
  [param("id").isString().withMessage("Invalid book ID"), ...validateBook],
  async (req: Request, res: Response) => {
    try {
      const id = new ObjectId(req.params.id)

      const book = {
        ...req.body,
        publicationDate: new Date(req.body.publicationDate),
        updatedAt: new Date(),
      }

      const result = await db.collection("books").updateOne({ _id: id }, { $set: book })

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Book not found" })
      }

      res.json({ message: "Book updated successfully", book })
    } catch (error) {
      res.status(500).json({ message: "Error updating book", error })
    }
  },
)

// DELETE book
app.delete("/api/books/:id", async (req: Request, res: Response) => {
  try {
    const id = new ObjectId(req.params.id)

    const result = await db.collection("books").deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found" })
    }

    res.json({ message: "Book deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error })
  }
})

// Rota catch-all para servir o frontend SPA e evitar erro 404 no Vercel
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})

// Start server
async function startServer() {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
