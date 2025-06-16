import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "../config/database"
import { generateToken } from "../utils/jwt"
import type { User, UserResponse, LoginRequest, RegisterRequest } from "../models/User"

export class AuthController {
    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Registra um novo usuário
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - username
     *               - email
     *               - password
     *             properties:
     *               username:
     *                 type: string
     *                 minLength: 3
     *                 maxLength: 30
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *                 minLength: 6
     *     responses:
     *       201:
     *         description: Usuário registrado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 token:
     *                   type: string
     *                 user:
     *                   $ref: '#/components/schemas/UserResponse'
     *       400:
     *         description: Dados inválidos
     *       409:
     *         description: Usuário já existe
     */
    static async register(req: Request, res: Response) {
        try {
            const { username, email, password }: RegisterRequest = req.body
            const db = await connectToDatabase()

            // Verifica se o usuário já existe
            const existingUser = await db.collection("users").findOne({
                $or: [{ email }, { username }],
            })

            if (existingUser) {
                return res.status(409).json({
                    message: "Usuário com este email ou nome de usuário já existe",
                })
            }

            // Hash da senha
            const saltRounds = 12
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            // Cria o usuário
            const newUser: User = {
                username,
                email,
                password: hashedPassword,
                createdAt: new Date(),
            }

            const result = await db.collection("users").insertOne(newUser)

            // Prepara resposta sem a senha
            const userResponse: UserResponse = {
                _id: result.insertedId.toString(),
                username,
                email,
                createdAt: newUser.createdAt,
            }

            // Gera token
            const token = generateToken(userResponse)

            res.status(201).json({
                message: "Usuário registrado com sucesso",
                token,
                user: userResponse,
            })
        } catch (error) {
            console.error("Erro ao registrar usuário:", error)
            res.status(500).json({ message: "Erro interno do servidor" })
        }
    }

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Autentica um usuário
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 format: email
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login realizado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 token:
     *                   type: string
     *                 user:
     *                   $ref: '#/components/schemas/UserResponse'
     *       400:
     *         description: Dados inválidos
     *       401:
     *         description: Credenciais inválidas
     */
    static async login(req: Request, res: Response) {
        try {
            const { email, password }: LoginRequest = req.body
            const db = await connectToDatabase()

            // Busca o usuário
            const user = await db.collection("users").findOne({ email })

            if (!user) {
                return res.status(401).json({ message: "Credenciais inválidas" })
            }

            // Verifica a senha
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Credenciais inválidas" })
            }

            // Prepara resposta sem a senha
            const userResponse: UserResponse = {
                _id: user._id.toString(),
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }

            // Gera token
            const token = generateToken(userResponse)

            res.json({
                message: "Login realizado com sucesso",
                token,
                user: userResponse,
            })
        } catch (error) {
            console.error("Erro ao fazer login:", error)
            res.status(500).json({ message: "Erro interno do servidor" })
        }
    }

    /**
     * @swagger
     * /api/auth/me:
     *   get:
     *     summary: Obtém informações do usuário autenticado
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Informações do usuário
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserResponse'
     *       401:
     *         description: Token não fornecido
     *       403:
     *         description: Token inválido
     */
    static async getProfile(req: any, res: Response) {
        try {
            const db = await connectToDatabase()
            const user = await db.collection("users").findOne({ _id: req.user.userId })

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" })
            }

            const userResponse: UserResponse = {
                _id: user._id.toString(),
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }

            res.json(userResponse)
        } catch (error) {
            console.error("Erro ao buscar perfil:", error)
            res.status(500).json({ message: "Erro interno do servidor" })
        }
    }
}
