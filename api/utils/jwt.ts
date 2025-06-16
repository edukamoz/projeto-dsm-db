import jwt from "jsonwebtoken"
import type { UserResponse } from "../models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

export function generateToken(user: UserResponse): string {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
            username: user.username,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    )
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        throw new Error("Token inválido")
    }
}
