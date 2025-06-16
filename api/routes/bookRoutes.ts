import { Router } from "express"
import { BookController } from "../controllers/bookController"
import { validateBook, validateBookId, validateAdvancedSearch } from "../middlewares/validation"

const router = Router()

// GET todos os livros
router.get("/", BookController.getAllBooks)

// GET livros com consulta complexa (deve vir antes da rota /:id)
router.get("/search/advanced", validateAdvancedSearch, BookController.advancedSearch)

// GET livro por ID
router.get("/:id", BookController.getBookById)

// POST novo livro
router.post("/", validateBook, BookController.createBook)

// PUT atualiza livro
router.put("/:id", [...validateBookId, ...validateBook], BookController.updateBook)

// DELETE livro
router.delete("/:id", BookController.deleteBook)

export default router
