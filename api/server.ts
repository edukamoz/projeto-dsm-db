import express, { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import { body, param, query, validationResult } from "express-validator";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://your_mongodb_connection_string";

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../public")));
}

// Conexão com MongoDB
let cachedDb: any = null;

async function connectToDatabase() {
  try {
    if (cachedDb) return cachedDb;
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    cachedDb = client.db("book_collection");
    return cachedDb;
  } catch (error) {
    console.error("Falha ao conectar ao MongoDB:", error);
    process.exit(1);
  }
}

// Middleware de validação
const validateBook = [
  body("title").notEmpty().withMessage("Título é obrigatório"),
  body("author").notEmpty().withMessage("Autor é obrigatório"),
  body("publicationDate")
    .isISO8601()
    .withMessage("Data de publicação deve ser uma data válida"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Preço deve ser um número positivo com decimais"),
  body("pageCount")
    .isInt({ min: 1 })
    .withMessage("Número de páginas deve ser um inteiro positivo"),
  body("genre").notEmpty().withMessage("Gênero é obrigatório"),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Rotas
// GET todos os livros
app.get("/api/books", async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    const books = await db.collection("books").find({}).toArray();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar livros", error });
  }
});

// GET livro por ID
app.get("/api/books/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    const id = new ObjectId(req.params.id);
    const book = await db.collection("books").findOne({ _id: id });

    if (!book) {
      return res.status(404).json({ message: "Livro não encontrado" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar livro", error });
  }
});

// GET livros com consulta complexa (usando operadores)
app.get(
  "/api/books/search/advanced",
  [
    query("minPrice")
      .optional()
      .isFloat()
      .withMessage("Preço mínimo deve ser um número"),
    query("maxPrice")
      .optional()
      .isFloat()
      .withMessage("Preço máximo deve ser um número"),
    query("minPages")
      .optional()
      .isInt()
      .withMessage("Número mínimo de páginas deve ser um inteiro"),
    query("genre")
      .optional()
      .isString()
      .withMessage("Gênero deve ser uma string"),
    query("fromDate")
      .optional()
      .isISO8601()
      .withMessage("Data inicial deve ser uma data válida"),
  ],
  async (req: Request, res: Response) => {
    try {
      const db = await connectToDatabase();
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { minPrice, maxPrice, minPages, genre, fromDate } = req.query;

      let query: any = {};

      // Monta a consulta com operadores
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number.parseFloat(minPrice as string);
        if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice as string);
      }

      if (minPages) {
        query.pageCount = { $gte: Number.parseInt(minPages as string) };
      }

      if (genre) {
        query.genre = genre;
      }

      if (fromDate) {
        query.publicationDate = { $gte: new Date(fromDate as string) };
      }

      // Usa operador $and para combinação lógica se houver múltiplas condições
      if (Object.keys(query).length > 1) {
        const conditions = Object.entries(query).map(([key, value]) => ({
          [key]: value,
        }));
        query = { $and: conditions };
      }

      const books = await db.collection("books").find(query).toArray();
      res.json(books);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
      res.status(500).json({ message: "Erro ao buscar livros", error });
    }
  }
);

// POST novo livro
app.post("/api/books", validateBook, async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    const book = {
      ...req.body,
      publicationDate: new Date(req.body.publicationDate),
      createdAt: new Date(),
    };

    const result = await db.collection("books").insertOne(book);
    res.status(201).json({
      message: "Livro criado com sucesso",
      bookId: result.insertedId,
      book,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar livro", error });
  }
});

// PUT atualiza livro
app.put(
  "/api/books/:id",
  [param("id").isString().withMessage("ID do livro inválido"), ...validateBook],
  async (req: Request, res: Response) => {
    try {
      const db = await connectToDatabase();
      const id = new ObjectId(req.params.id);

      const book = {
        ...req.body,
        publicationDate: new Date(req.body.publicationDate),
        updatedAt: new Date(),
      };

      const result = await db
        .collection("books")
        .updateOne({ _id: id }, { $set: book });

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Livro não encontrado" });
      }

      res.json({ message: "Livro atualizado com sucesso", book });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar livro", error });
    }
  }
);

// DELETE livro
app.delete("/api/books/:id", async (req: Request, res: Response) => {
  try {
    const db = await connectToDatabase();
    const id = new ObjectId(req.params.id);

    const result = await db.collection("books").deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Livro não encontrado" });
    }

    res.json({ message: "Livro excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir livro", error });
  }
});

// Inicia o servidor
async function startServer() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;