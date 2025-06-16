import type { Request, Response, NextFunction } from "express"
import { verifyToken } from "../utils/jwt"

export interface AuthRequest extends Request {
    user?: {
        userId: string
        email: string
        username: string
    }
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: "Token de acesso requerido" })
    }

    try {
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(403).json({ message: "Token inválido" })
    }
}
