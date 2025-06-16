import { Router } from "express"
import { AuthController } from "../controllers/authController"
import { validateRegister, validateLogin } from "../middlewares/validation"
import { authenticateToken } from "../middlewares/auth"

const router = Router()

// Registro de usuário
router.post("/register", validateRegister, AuthController.register)

// Login de usuário
router.post("/login", validateLogin, AuthController.login)

// Perfil do usuário (protegido)
router.get("/me", authenticateToken, AuthController.getProfile)

export default router
