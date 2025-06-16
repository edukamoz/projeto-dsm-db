import type express from "express"
import { body, param, query, validationResult } from "express-validator"

export const validateBook = [
    body("title").notEmpty().withMessage("Título é obrigatório"),
    body("author").notEmpty().withMessage("Autor é obrigatório"),
    body("publicationDate").isISO8601().withMessage("Data de publicação deve ser uma data válida"),
    body("price").isFloat({ min: 0 }).withMessage("Preço deve ser um número positivo com decimais"),
    body("pageCount").isInt({ min: 1 }).withMessage("Número de páginas deve ser um inteiro positivo"),
    body("genre").notEmpty().withMessage("Gênero é obrigatório"),
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    },
]

export const validateBookId = [param("id").isString().withMessage("ID do livro inválido")]

export const validateAdvancedSearch = [
    query("minPrice").optional().isFloat().withMessage("Preço mínimo deve ser um número"),
    query("maxPrice").optional().isFloat().withMessage("Preço máximo deve ser um número"),
    query("minPages").optional().isInt().withMessage("Número mínimo de páginas deve ser um inteiro"),
    query("genre").optional().isString().withMessage("Gênero deve ser uma string"),
    query("fromDate").optional().isISO8601().withMessage("Data inicial deve ser uma data válida"),
]
