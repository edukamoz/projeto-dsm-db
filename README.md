# Book Collection API

Este projeto é uma API RESTful completa para gerenciamento de uma coleção de livros, desenvolvida com Node.js, TypeScript, MongoDB, autenticação JWT e documentação Swagger.

## Integrantes do Grupo

- Eduardo Kamo Iguei
- Iago Yuri Rossan
- Lucas Vinicios Consani
- Matheus Nery de Camargo

## Propósito do Projeto

O objetivo deste projeto é criar um sistema completo de gerenciamento de livros com autenticação segura, incluindo um backend RESTful que permite realizar operações CRUD (Create, Read, Update, Delete) em uma coleção de livros armazenada no MongoDB, sistema de autenticação com JWT e bcrypt, documentação interativa com Swagger, e um frontend moderno em HTML, CSS e JavaScript para interagir com a API. Este projeto foi criado com o propósito de atender ao trabalho exigido durante o curso de Desenvolvimento de Software Multiplataforma da FATEC Votorantim.

## Link da API Pública

[Link para a API hospedada no Vercel](https://projeto-dsm-db.vercel.app/)

[Documentação Swagger da API](https://projeto-dsm-db.vercel.app/api-docs)

## Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset tipado do JavaScript
- **MongoDB** - Banco de dados NoSQL
- **JWT (jsonwebtoken)** - Autenticação baseada em tokens
- **bcryptjs** - Criptografia de senhas
- **express-validator** - Validação de dados
- **Swagger** - Documentação interativa da API

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização com tema escuro tecnológico
- **JavaScript ES6+** - Lógica do frontend e consumo da API

### Ferramentas de Desenvolvimento
- **nodemon** - Reinicialização automática do servidor
- **ts-node** - Execução direta de TypeScript
- **CORS** - Controle de acesso entre origens

## Estrutura do Projeto

```
├── api/
│   ├── config/
│   │   ├── database.ts       # Configuração do MongoDB
│   │   └── swagger.ts        # Configuração do Swagger
│   ├── controllers/
│   │   ├── authController.ts # Lógica de autenticação
│   │   └── bookController.ts # Lógica de negócio dos livros
│   ├── middlewares/
│   │   ├── auth.ts          # Middleware de autenticação JWT
│   │   └── validation.ts    # Middlewares de validação
│   ├── models/
│   │   ├── Book.ts          # Interface/modelo do livro
│   │   └── User.ts          # Interface/modelo do usuário
│   ├── routes/
│   │   ├── authRoutes.ts    # Rotas de autenticação
│   │   └── bookRoutes.ts    # Rotas dos livros
│   ├── utils/
│   │   └── jwt.ts           # Utilitários para JWT
│   └── server.ts            # Arquivo principal do servidor
├── public/
│   ├── index.html           # Página principal do frontend
│   ├── auth.html            # Página de login/registro
│   ├── styles.css           # Estilos CSS com tema escuro
│   ├── script.js            # JavaScript principal
│   └── auth.js              # JavaScript de autenticação
├── package.json             # Dependências do projeto
├── tsconfig.json            # Configuração do TypeScript
├── .env                     # Variáveis de ambiente
└── README.md                # Documentação do projeto
```

## Instalação e Execução

1. **Clone o repositório:**
```bash
git clone https://github.com/edukamoz/projeto-dsm-db.git
cd projeto-dsm-db
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
MONGODB_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta_jwt_super_segura
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

4. **Compile o TypeScript:**
```bash
npm run build
```

5. **Inicie o servidor:**
```bash
npm start
```

**Para desenvolvimento:**
```bash
npm run dev
```

6. **Acesse a aplicação:**
   - Frontend: `http://localhost:3000`
   - Documentação Swagger: `http://localhost:3000/api-docs`

## Endpoints da API

### 🔐 Autenticação

- **POST /api/auth/register** - Registra um novo usuário
- **POST /api/auth/login** - Autentica um usuário
- **GET /api/auth/me** - Obtém informações do usuário autenticado (protegido)

### 📚 Livros (Todas as rotas protegidas por JWT)

- **GET /api/books** - Retorna todos os livros
- **GET /api/books/:id** - Retorna um livro específico pelo ID
- **GET /api/books/search/advanced** - Busca avançada com múltiplos filtros
  - Parâmetros: `minPrice`, `maxPrice`, `minPages`, `genre[]`, `fromDate`
- **POST /api/books** - Cria um novo livro
- **PUT /api/books/:id** - Atualiza um livro existente
- **DELETE /api/books/:id** - Remove um livro

### 📖 Documentação

- **GET /api-docs** - Documentação interativa Swagger
- **GET /api** - Informações gerais da API

## Modelos de Dados

### 👤 Usuário (User)
```typescript
{
  _id?: string
  username: string        // 3-30 caracteres, apenas letras, números e _
  email: string          // Email válido
  password: string       // Mínimo 6 caracteres, deve conter maiúscula, minúscula e número
  createdAt?: Date
  updatedAt?: Date
}
```

### 📖 Livro (Book)
```typescript
{
  _id?: string
  title: string                    // Obrigatório
  author: string                   // Obrigatório
  publicationDate: Date           // Obrigatório
  price: number                   // Decimal, obrigatório
  pageCount: number               // Inteiro, obrigatório
  genre: string                   // Obrigatório (lista fixa de gêneros)
  createdAt?: Date
  updatedAt?: Date
}
```

### 📚 Gêneros Disponíveis
```
Ação e Aventura, Autobiografia, Autoajuda, Biografia, Conto, Crônica,
Desenvolvimento Pessoal, Distopia, Divulgação Científica, Dramático,
Ensaio, Épico ou Narrativo, Espiritualidade, Fantasia, Ficção Científica,
Ficção Histórica, Ficção Policial, Filosofia, Guias e Manuais, História,
Horror, Jornalismo Literário, Lírico, Memórias, Novela, Religião,
Romance, Suspense, Terror, Thriller
```

## Segurança

### 🔒 Autenticação JWT
- Tokens JWT com expiração configurável (padrão: 7 dias)
- Middleware de autenticação em todas as rotas protegidas
- Verificação automática de tokens expirados

### 🛡️ Criptografia de Senhas
- Senhas criptografadas com bcrypt (12 salt rounds)
- Validação de força da senha no frontend e backend

### ✅ Validação de Dados
- Validação robusta com express-validator
- Sanitização de entradas
- Mensagens de erro detalhadas

## Frontend

### 🎨 Design
- Tema escuro tecnológico moderno
- Interface responsiva
- Animações suaves e efeitos visuais
- Gradientes e efeitos de profundidade

### ⚡ Funcionalidades
- **Autenticação**: Login e registro de usuários
- **Gestão de Livros**: CRUD completo de livros
- **Busca Avançada**: Filtros múltiplos com checkboxes para gêneros
- **Notificações**: Sistema de notificações visuais
- **Responsividade**: Adaptável a diferentes tamanhos de tela

## Documentação das Chamadas REST

### 🔐 Autenticação

#### Registro de Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario123",
  "email": "usuario@email.com",
  "password": "MinhaSenh@123"
}
