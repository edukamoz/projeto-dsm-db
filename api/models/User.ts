export interface User {
    _id?: string
    username: string
    email: string
    password: string
    createdAt?: Date
    updatedAt?: Date
}

export interface UserResponse {
    _id: string
    username: string
    email: string
    createdAt?: Date
    updatedAt?: Date
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
}

export interface AuthResponse {
    token: string
    user: UserResponse
}
