import swaggerJsdoc from "swagger-jsdoc"

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Book Manager API",
            version: "1.0.0",
            description: "API para gerenciamento de livros com autenticação JWT",
            contact: {
                name: "API Support",
                email: "support@bookmanager.com",
            },
        },
        servers: [
            {
                url: "https://projeto-dsm-db.vercel.app",
                description: "Servidor de produção",
            },
            {
                url: "http://localhost:3000",
                description: "Servidor de desenvolvimento",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                Book: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            description: "ID único do livro",
                        },
                        title: {
                            type: "string",
                            description: "Título do livro",
                        },
                        author: {
                            type: "string",
                            description: "Autor do livro",
                        },
                        publicationDate: {
                            type: "string",
                            format: "date",
                            description: "Data de publicação",
                        },
                        price: {
                            type: "number",
                            minimum: 0,
                            description: "Preço do livro",
                        },
                        pageCount: {
                            type: "integer",
                            minimum: 1,
                            description: "Número de páginas",
                        },
                        genre: {
                            type: "string",
                            enum: [
                                "Ação e Aventura",
                                "Autobiografia",
                                "Autoajuda",
                                "Biografia",
                                "Conto",
                                "Crônica",
                                "Desenvolvimento Pessoal",
                                "Distopia",
                                "Divulgação Científica",
                                "Dramático",
                                "Ensaio",
                                "Épico ou Narrativo",
                                "Espiritualidade",
                                "Fantasia",
                                "Ficção Científica",
                                "Ficção Histórica",
                                "Ficção Policial",
                                "Filosofia",
                                "Guias e Manuais",
                                "História",
                                "Horror",
                                "Jornalismo Literário",
                                "Lírico",
                                "Memórias",
                                "Novela",
                                "Religião",
                                "Romance",
                                "Suspense",
                                "Terror",
                                "Thriller",
                            ],
                            description: "Gênero do livro",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Data de criação",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Data de atualização",
                        },
                    },
                    required: ["title", "author", "publicationDate", "price", "pageCount", "genre"],
                },
                BookInput: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "Título do livro",
                        },
                        author: {
                            type: "string",
                            description: "Autor do livro",
                        },
                        publicationDate: {
                            type: "string",
                            format: "date",
                            description: "Data de publicação",
                        },
                        price: {
                            type: "number",
                            minimum: 0,
                            description: "Preço do livro",
                        },
                        pageCount: {
                            type: "integer",
                            minimum: 1,
                            description: "Número de páginas",
                        },
                        genre: {
                            type: "string",
                            enum: [
                                "Ação e Aventura",
                                "Autobiografia",
                                "Autoajuda",
                                "Biografia",
                                "Conto",
                                "Crônica",
                                "Desenvolvimento Pessoal",
                                "Distopia",
                                "Divulgação Científica",
                                "Dramático",
                                "Ensaio",
                                "Épico ou Narrativo",
                                "Espiritualidade",
                                "Fantasia",
                                "Ficção Científica",
                                "Ficção Histórica",
                                "Ficção Policial",
                                "Filosofia",
                                "Guias e Manuais",
                                "História",
                                "Horror",
                                "Jornalismo Literário",
                                "Lírico",
                                "Memórias",
                                "Novela",
                                "Religião",
                                "Romance",
                                "Suspense",
                                "Terror",
                                "Thriller",
                            ],
                            description: "Gênero do livro",
                        },
                    },
                    required: ["title", "author", "publicationDate", "price", "pageCount", "genre"],
                },
                UserResponse: {
                    type: "object",
                    properties: {
                        _id: {
                            type: "string",
                            description: "ID único do usuário",
                        },
                        username: {
                            type: "string",
                            description: "Nome de usuário",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "Email do usuário",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Data de criação",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Data de atualização",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Mensagem de erro",
                        },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    field: {
                                        type: "string",
                                    },
                                    message: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [],
}

// Definições manuais das rotas para evitar problemas de build
const swaggerDefinitions = {
    paths: {
        "/api/auth/register": {
            post: {
                summary: "Registra um novo usuário",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["username", "email", "password"],
                                properties: {
                                    username: {
                                        type: "string",
                                        minLength: 3,
                                        maxLength: 30,
                                    },
                                    email: {
                                        type: "string",
                                        format: "email",
                                    },
                                    password: {
                                        type: "string",
                                        minLength: 6,
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Usuário registrado com sucesso",
                    },
                    400: {
                        description: "Dados inválidos",
                    },
                    409: {
                        description: "Usuário já existe",
                    },
                },
            },
        },
        "/api/auth/login": {
            post: {
                summary: "Autentica um usuário",
                tags: ["Auth"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "password"],
                                properties: {
                                    email: {
                                        type: "string",
                                        format: "email",
                                    },
                                    password: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Login realizado com sucesso",
                    },
                    401: {
                        description: "Credenciais inválidas",
                    },
                },
            },
        },
        "/api/auth/me": {
            get: {
                summary: "Obtém informações do usuário autenticado",
                tags: ["Auth"],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: "Informações do usuário",
                    },
                    401: {
                        description: "Token não fornecido",
                    },
                    403: {
                        description: "Token inválido",
                    },
                },
            },
        },
        "/api/books": {
            get: {
                summary: "Lista todos os livros",
                tags: ["Books"],
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: "Lista de livros",
                    },
                },
            },
            post: {
                summary: "Cria um novo livro",
                tags: ["Books"],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/BookInput",
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Livro criado com sucesso",
                    },
                },
            },
        },
        "/api/books/{id}": {
            get: {
                summary: "Obtém um livro por ID",
                tags: ["Books"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                        description: "ID do livro",
                    },
                ],
                responses: {
                    200: {
                        description: "Dados do livro",
                    },
                    404: {
                        description: "Livro não encontrado",
                    },
                },
            },
            put: {
                summary: "Atualiza um livro",
                tags: ["Books"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                        description: "ID do livro",
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/BookInput",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "Livro atualizado com sucesso",
                    },
                    404: {
                        description: "Livro não encontrado",
                    },
                },
            },
            delete: {
                summary: "Exclui um livro",
                tags: ["Books"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: {
                            type: "string",
                        },
                        description: "ID do livro",
                    },
                ],
                responses: {
                    200: {
                        description: "Livro excluído com sucesso",
                    },
                    404: {
                        description: "Livro não encontrado",
                    },
                },
            },
        },
        "/api/books/search/advanced": {
            get: {
                summary: "Busca avançada de livros",
                tags: ["Books"],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        in: "query",
                        name: "title",
                        schema: {
                            type: "string",
                        },
                        description: "Busca parcial no título do livro (case insensitive)",
                    },
                    {
                        in: "query",
                        name: "minPrice",
                        schema: {
                            type: "number",
                        },
                        description: "Preço mínimo",
                    },
                    {
                        in: "query",
                        name: "maxPrice",
                        schema: {
                            type: "number",
                        },
                        description: "Preço máximo",
                    },
                    {
                        in: "query",
                        name: "minPages",
                        schema: {
                            type: "integer",
                        },
                        description: "Número mínimo de páginas",
                    },
                    {
                        in: "query",
                        name: "maxPages",
                        schema: {
                            type: "integer",
                        },
                        description: "Número máximo de páginas",
                    },
                    {
                        in: "query",
                        name: "genre",
                        schema: {
                            type: "array",
                            items: {
                                type: "string",
                            },
                        },
                        description:
                            "Gêneros (pode ser múltiplos, retorna livros que contenham qualquer um dos gêneros selecionados)",
                    },
                    {
                        in: "query",
                        name: "fromDate",
                        schema: {
                            type: "string",
                            format: "date",
                        },
                        description: "Data de publicação a partir de",
                    },
                ],
                responses: {
                    200: {
                        description: "Lista de livros filtrados",
                    },
                },
            },
        },
    },
}

export const specs = swaggerJsdoc(options)
