// API URL - Change this to your deployed API URL when deploying
const API_URL = "/api/books"

// DOM Elements
const bookForm = document.getElementById("book-form")
const booksList = document.getElementById("books-list")
const formTitle = document.getElementById("form-title")
const submitBtn = document.getElementById("submit-btn")
const cancelBtn = document.getElementById("cancel-btn")
const searchForm = document.getElementById("search-form")
const clearSearchBtn = document.getElementById("clear-search")

// State
let editMode = false
let currentBookId = null

// Event Listeners
document.addEventListener("DOMContentLoaded", fetchBooks)
bookForm.addEventListener("submit", handleFormSubmit)
cancelBtn.addEventListener("click", resetForm)
searchForm.addEventListener("submit", handleSearch)
clearSearchBtn.addEventListener("click", clearSearch)

// Functions
async function fetchBooks() {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error("Failed to fetch books")
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

    // Add event listeners to buttons
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
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create book")
  }

  showNotification("Livro adicionado com sucesso!", "success")
  return response.json()
}

async function updateBook(id, bookData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update book")
  }

  showNotification("Livro atualizado com sucesso!", "success")
  return response.json()
}

async function deleteBook(id) {
  if (!confirm("Tem certeza que deseja excluir este livro?")) {
    return
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete book")
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

  // Update form title and button
  formTitle.textContent = "Editar Livro"
  submitBtn.textContent = "Atualizar"
  cancelBtn.style.display = "block"

  // Fill form with book data
  document.getElementById("title").value = book.title
  document.getElementById("author").value = book.author
  document.getElementById("publicationDate").value = new Date(book.publicationDate).toISOString().split("T")[0]
  document.getElementById("price").value = book.price
  document.getElementById("pageCount").value = book.pageCount
  document.getElementById("genre").value = book.genre

  // Scroll to form
  document.querySelector(".form-container").scrollIntoView({ behavior: "smooth" })
}

function resetForm() {
  editMode = false
  currentBookId = null

  // Reset form title and button
  formTitle.textContent = "Adicionar Novo Livro"
  submitBtn.textContent = "Salvar"
  cancelBtn.style.display = "none"

  // Clear form
  bookForm.reset()
}

async function handleSearch(event) {
  event.preventDefault()

  const formData = new FormData(searchForm)
  const searchParams = new URLSearchParams()

  // Add search parameters if they have values
  if (formData.get("minPrice")) searchParams.append("minPrice", formData.get("minPrice"))
  if (formData.get("maxPrice")) searchParams.append("maxPrice", formData.get("maxPrice"))
  if (formData.get("minPages")) searchParams.append("minPages", formData.get("minPages"))
  if (formData.get("genre")) searchParams.append("genre", formData.get("genre"))
  if (formData.get("fromDate")) searchParams.append("fromDate", formData.get("fromDate"))

  try {
    const response = await fetch(`${API_URL}/search/advanced?${searchParams.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to search books")
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
  fetchBooks()
}

function showNotification(message, type) {
  // Remove any existing notification
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Add to DOM
  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove()
  }, 3000)
}
