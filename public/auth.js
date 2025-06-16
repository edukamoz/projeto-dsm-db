// URL da API
const API_URL =
    window.location.hostname === "localhost" ? "http://localhost:3000/api" : `https://${window.location.hostname}/api`

// Elementos do DOM
const loginFormContainer = document.getElementById("login-form-container")
const registerFormContainer = document.getElementById("register-form-container")
const loginForm = document.getElementById("login-form")
const registerForm = document.getElementById("register-form")
const showRegisterLink = document.getElementById("show-register")
const showLoginLink = document.getElementById("show-login")

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Verifica se já está logado
    if (getToken()) {
        window.location.href = "index.html"
    }
})

showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault()
    showRegisterForm()
})

showLoginLink.addEventListener("click", (e) => {
    e.preventDefault()
    showLoginForm()
})

loginForm.addEventListener("submit", handleLogin)
registerForm.addEventListener("submit", handleRegister)

// Funções
function showRegisterForm() {
    loginFormContainer.style.display = "none"
    registerFormContainer.style.display = "block"
}

function showLoginForm() {
    registerFormContainer.style.display = "none"
    loginFormContainer.style.display = "block"
}

async function handleLogin(event) {
    event.preventDefault()

    const formData = new FormData(loginForm)
    const loginData = {
        email: formData.get("email"),
        password: formData.get("password"),
    }

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || "Erro ao fazer login")
        }

        // Salva o token
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        showNotification("Login realizado com sucesso!", "success")

        // Redireciona para a página principal
        setTimeout(() => {
            window.location.href = "index.html"
        }, 1000)
    } catch (error) {
        showNotification(error.message, "error")
    }
}

async function handleRegister(event) {
    event.preventDefault()

    const formData = new FormData(registerForm)
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (password !== confirmPassword) {
        showNotification("As senhas não coincidem", "error")
        return
    }

    const registerData = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: password,
    }

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        })

        const data = await response.json()

        if (!response.ok) {
            if (data.errors) {
                const errorMessages = data.errors.map((error) => error.msg).join(", ")
                throw new Error(errorMessages)
            }
            throw new Error(data.message || "Erro ao registrar usuário")
        }

        // Salva o token
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        showNotification("Usuário registrado com sucesso!", "success")

        // Redireciona para a página principal
        setTimeout(() => {
            window.location.href = "index.html"
        }, 1000)
    } catch (error) {
        showNotification(error.message, "error")
    }
}

function getToken() {
    return localStorage.getItem("token")
}

function showNotification(message, type) {
    // Remove qualquer notificação existente
    const existingNotification = document.querySelector(".notification")
    if (existingNotification) {
        existingNotification.remove()
    }

    // Cria o elemento de notificação
    const notification = document.createElement("div")
    notification.className = `notification ${type}`
    notification.textContent = message

    // Adiciona ao DOM
    document.body.appendChild(notification)

    // Remove após 3 segundos
    setTimeout(() => {
        notification.remove()
    }, 3000)
}
