# Book Collection API

Este projeto é uma API RESTful para gerenciamento de uma coleção de livros, desenvolvida com Node.js, TypeScript e MongoDB.

## Integrantes do Grupo

- Eduardo Kamo Iguei
- Iago Yuri Rossan
- Lucas Vinicios Consani
- Matheus Nery de Camargo
- Nelson de Oliveira Junior

## Propósito do Projeto

O objetivo deste projeto é criar um sistema completo de gerenciamento de livros, com um backend RESTful que permite realizar operações CRUD (Create, Read, Update, Delete) em uma coleção de livros armazenada no MongoDB, e um frontend básico em HTML, CSS e JavaScript para interagir com a API. Este projeto foi criado com o propósito de atender ao trabalho exigido durante o curso de Desenvolvimento de Software Multiplataforma da FATEC Votorantim

## Link da API Pública

[Link para a API hospedada no Vercel](https://projeto-dsm-db.vercel.app/)

## Tecnologias Utilizadas

- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: MongoDB
- **Validação**: express-validator
- **Frontend**: HTML, CSS, JavaScript puro

## Estrutura do Projeto

```
├── src/
│   ├── server.ts         # Arquivo principal do servidor
│   └── types.ts          # Definições de tipos
├── public/
│   ├── index.html        # Página HTML do frontend
│   ├── styles.css        # Estilos CSS
│   └── script.js         # JavaScript do frontend
├── package.json          # Dependências do projeto
├── tsconfig.json         # Configuração do TypeScript
└── README.md             # Documentação do projeto
```

## Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/edukamoz/projeto-dsm-db.git
cd projeto-dsm-db
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env`
   - Adicione sua string de conexão do MongoDB

4. Compile o TypeScript:
```bash
npm run build
```

5. Inicie o servidor:
```bash
npm start
```

Para desenvolvimento:
```bash
npm run dev
```

## Endpoints da API

### Livros

- **GET /api/books** - Retorna todos os livros
- **GET /api/books/:id** - Retorna um livro específico pelo ID
- **GET /api/books/search/advanced** - Busca avançada com operadores de comparação
  - Parâmetros: minPrice, maxPrice, minPages, genre, fromDate
- **POST /api/books** - Cria um novo livro
- **PUT /api/books/:id** - Atualiza um livro existente
- **DELETE /api/books/:id** - Remove um livro

## Modelo de Dados

A coleção de livros possui os seguintes campos:

- **title**: String (obrigatório)
- **author**: String (obrigatório)
- **publicationDate**: Date (obrigatório)
- **price**: Number (decimal, obrigatório)
- **pageCount**: Number (inteiro, obrigatório)
- **genre**: String (obrigatório)
- **createdAt**: Date (automático)
- **updatedAt**: Date (automático)

## Validação

Todas as operações POST e PUT são validadas usando express-validator para garantir a integridade dos dados.

## Frontend

O frontend básico permite:

- Visualizar todos os livros
- Adicionar novos livros
- Editar livros existentes
- Excluir livros
- Realizar buscas avançadas usando os operadores do MongoDB

## Documentação das Chamadas REST

### GET - Buscar todos os livros
```
GET /api/books
```

### GET - Buscar livro por ID
```
GET /api/books/5f8d0e352a8e6a1b9c9f3b5a
```

### GET - Busca avançada
```
GET /api/books/search/advanced?minPrice=20&maxPrice=100&genre=Ficção&minPages=200
```

### POST - Criar novo livro
```
POST /api/books
Content-Type: application/json

{
  "title": "O Senhor dos Anéis",
  "author": "J.R.R. Tolkien",
  "publicationDate": "1954-07-29",
  "price": 59.90,
  "pageCount": 1178,
  "genre": "Fantasia"
}
```

### PUT - Atualizar livro
```
PUT /api/books/5f8d0e352a8e6a1b9c9f3b5a
Content-Type: application/json

{
  "title": "O Senhor dos Anéis: A Sociedade do Anel",
  "author": "J.R.R. Tolkien",
  "publicationDate": "1954-07-29",
  "price": 49.90,
  "pageCount": 576,
  "genre": "Fantasia"
}
```

### DELETE - Excluir livro
```
DELETE /api/books/5f8d0e352a8e6a1b9c9f3b5a
```