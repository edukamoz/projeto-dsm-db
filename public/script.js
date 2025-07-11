// URL da API
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/api/books"
    : `https://${window.location.hostname}/api/books`

// Elementos do DOM
const bookForm = document.getElementById("book-form")
const booksList = document.getElementById("books-list")
const formTitle = document.getElementById("form-title")
const submitBtn = document.getElementById("submit-btn")
const cancelBtn = document.getElementById("cancel-btn")
const searchForm = document.getElementById("search-form")
const clearSearchBtn = document.getElementById("clear-search")

// Estado
let editMode = false
let currentBookId = null

// Listeners de Eventos
document.addEventListener("DOMContentLoaded", () => {
  // Verifica se está autenticado
  if (!getToken()) {
    window.location.href = "auth.html"
    return
  }

  fetchBooks()
  setupLogout()
  setupPriceRange()
})

bookForm.addEventListener("submit", handleFormSubmit)
cancelBtn.addEventListener("click", resetForm)
searchForm.addEventListener("submit", handleSearch)
clearSearchBtn.addEventListener("click", clearSearch)

// Funções de autenticação
function getToken() {
  return localStorage.getItem("token")
}

function getUser() {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location.href = "auth.html"
}

function setupLogout() {
  // Adiciona botão de logout no header
  const header = document.querySelector("header")
  const user = getUser()

  if (user) {
    const userInfo = document.createElement("div")
    userInfo.className = "user-info"
    userInfo.innerHTML = `
      <span>Olá, ${user.username}!</span>
      <button id="logout-btn" class="logout-btn">Sair</button>
    `
    header.appendChild(userInfo)

    document.getElementById("logout-btn").addEventListener("click", logout)
  }
}

function setupPriceRange() {
  const minPriceRange = document.getElementById("minPriceRange")
  const maxPriceRange = document.getElementById("maxPriceRange")
  const priceMinSpan = document.getElementById("priceMin")
  const priceMaxSpan = document.getElementById("priceMax")

  function updatePriceDisplay() {
    const minVal = Number.parseInt(minPriceRange.value)
    const maxVal = Number.parseInt(maxPriceRange.value)

    if (minVal >= maxVal) {
      minPriceRange.value = maxVal - 1
    }

    priceMinSpan.textContent = minPriceRange.value
    priceMaxSpan.textContent = maxPriceRange.value
  }

  minPriceRange.addEventListener("input", updatePriceDisplay)
  maxPriceRange.addEventListener("input", updatePriceDisplay)

  // Inicializa os valores
  updatePriceDisplay()
}

// Função para fazer requisições autenticadas
async function authenticatedFetch(url, options = {}) {
  const token = getToken()

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }

  const response = await fetch(url, mergedOptions)

  // Se não autorizado, redireciona para login
  if (response.status === 401 || response.status === 403) {
    logout()
    return
  }

  return response
}

// Funções atualizadas com autenticação
async function fetchBooks() {
  try {
    const response = await authenticatedFetch(API_URL)
    if (!response.ok) {
      throw new Error("Falha ao buscar livros")
    }

    const books = await response.json()
    renderBooks(books)
  } catch (error) {
    showNotification(error.message, "error")
  }
}

function renderBooks(books) {
  booksList.innerHTML = ""

  if (books.length === 0) {
    booksList.innerHTML = "<p>Nenhum livro encontrado.</p>"
    return
  }

  books.forEach((book) => {
    const bookCard = document.createElement("div")
    bookCard.className = "book-card"

    const formattedDate = new Date(book.publicationDate).toLocaleDateString("pt-BR")
    const formattedPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(book.price)

    bookCard.innerHTML = `
            <div class="book-header">
                <h3 class="book-title">${book.title}</h3>
                <div class="book-actions">
                    <button class="edit-btn" data-id="${book._id}">Editar</button>
                    <button class="delete-btn" data-id="${book._id}">Excluir</button>
                </div>
            </div>
            <div class="book-info">
                <p><strong>Autor:</strong> ${book.author}</p>
                <p><strong>Publicação:</strong> ${formattedDate}</p>
                <p><strong>Preço:</strong> ${formattedPrice}</p>
                <p><strong>Páginas:</strong> ${book.pageCount}</p>
                <p><strong>Gênero:</strong> ${book.genre}</p>
            </div>
        `

    // Adiciona listeners de eventos aos botões
    bookCard.querySelector(".edit-btn").addEventListener("click", () => editBook(book))
    bookCard.querySelector(".delete-btn").addEventListener("click", () => deleteBook(book._id))

    booksList.appendChild(bookCard)
  })
}

async function handleFormSubmit(event) {
  event.preventDefault()

  const formData = new FormData(bookForm)
  const bookData = {
    title: formData.get("title"),
    author: formData.get("author"),
    publicationDate: formData.get("publicationDate"),
    price: Number.parseFloat(formData.get("price")),
    pageCount: Number.parseInt(formData.get("pageCount")),
    genre: formData.get("genre"),
  }

  try {
    if (editMode) {
      await updateBook(currentBookId, bookData)
    } else {
      await createBook(bookData)
    }

    resetForm()
    fetchBooks()
  } catch (error) {
    showNotification(error.message, "error")
  }
}

async function createBook(bookData) {
  const response = await authenticatedFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(bookData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Falha ao criar livro")
  }

  showNotification("Livro adicionado com sucesso!", "success")
  return response.json()
}

async function updateBook(id, bookData) {
  const response = await authenticatedFetch(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(bookData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Falha ao atualizar livro")
  }

  showNotification("Livro atualizado com sucesso!", "success")
  return response.json()
}

async function deleteBook(id) {
  if (!confirm("Tem certeza que deseja excluir este livro?")) {
    return
  }

  try {
    const response = await authenticatedFetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Falha ao excluir livro")
    }

    showNotification("Livro excluído com sucesso!", "success")
    fetchBooks()
  } catch (error) {
    showNotification(error.message, "error")
  }
}

function editBook(book) {
  editMode = true
  currentBookId = book._id

  // Atualiza o título do formulário e o botão
  formTitle.textContent = "Editar Livro"
  submitBtn.textContent = "Atualizar"
  cancelBtn.style.display = "block"

  // Preenche o formulário com os dados do livro
  document.getElementById("title").value = book.title
  document.getElementById("author").value = book.author
  document.getElementById("publicationDate").value = new Date(book.publicationDate).toISOString().split("T")[0]
  document.getElementById("price").value = book.price
  document.getElementById("pageCount").value = book.pageCount
  document.getElementById("genre").value = book.genre

  // Rola até o formulário
  document.querySelector(".form-container").scrollIntoView({ behavior: "smooth" })
}

function resetForm() {
  editMode = false
  currentBookId = null

  // Reseta o título do formulário e o botão
  formTitle.textContent = "Adicionar Novo Livro"
  submitBtn.textContent = "Salvar"
  cancelBtn.style.display = "none"

  // Limpa o formulário
  bookForm.reset()
}

async function handleSearch(event) {
  event.preventDefault()

  const formData = new FormData(searchForm)
  const searchParams = new URLSearchParams()

  // Adiciona parâmetros de busca se eles tiverem valores
  if (formData.get("title")) searchParams.append("title", formData.get("title"))

  // Range de preço
  const minPrice = document.getElementById("minPriceRange").value
  const maxPrice = document.getElementById("maxPriceRange").value
  if (minPrice && minPrice !== "0") searchParams.append("minPrice", minPrice)
  if (maxPrice && maxPrice !== "1000") searchParams.append("maxPrice", maxPrice)

  if (formData.get("minPages")) searchParams.append("minPages", formData.get("minPages"))
  if (formData.get("maxPages")) searchParams.append("maxPages", formData.get("maxPages"))
  if (formData.get("fromDate")) searchParams.append("fromDate", formData.get("fromDate"))

  // Coleta os gêneros selecionados
  const selectedGenres = []
  const genreCheckboxes = document.querySelectorAll('input[name="genres"]:checked')
  genreCheckboxes.forEach((checkbox) => {
    selectedGenres.push(checkbox.value)
  })

  // Se houver gêneros selecionados, adiciona cada um como parâmetro separado
  selectedGenres.forEach((genre) => {
    searchParams.append("genre", genre)
  })

  try {
    const response = await authenticatedFetch(`${API_URL}/search/advanced?${searchParams.toString()}`)

    if (!response.ok) {
      throw new Error("Falha ao buscar livros")
    }

    const books = await response.json()
    renderBooks(books)

    showNotification(`${books.length} livro(s) encontrado(s)`, "success")
  } catch (error) {
    showNotification(error.message, "error")
  }
}

function clearSearch() {
  searchForm.reset()

  // Reseta os ranges de preço
  document.getElementById("minPriceRange").value = 0
  document.getElementById("maxPriceRange").value = 1000
  document.getElementById("priceMin").textContent = "0"
  document.getElementById("priceMax").textContent = "1000"

  // Desmarca todos os checkboxes
  const genreCheckboxes = document.querySelectorAll('input[name="genres"]')
  genreCheckboxes.forEach((checkbox) => {
    checkbox.checked = false
  })

  fetchBooks()
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
