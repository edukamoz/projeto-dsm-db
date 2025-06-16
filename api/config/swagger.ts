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
    apis: ["./api/controllers/*.ts", "./api/routes/*.ts"],
}

export const specs = swaggerJsdoc(options)
