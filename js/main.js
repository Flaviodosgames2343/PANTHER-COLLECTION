// ===================================
// CONFIGURAÇÃO DO MERCADO PAGO
// ===================================
const MERCADOPAGO_CONFIG = {
  publicKey: "TEST-c082fb2c-45b1-455d-b310-20ff13187461",
  receiverEmail: "cleoflavio01@gmail.com",
}

// ===================================
// LOADER
// ===================================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader")
  setTimeout(() => {
    loader.classList.add("hidden")
    loader.setAttribute("aria-hidden", "true")
  }, 500)
})

// ===================================
// THEME TOGGLE (DARK/LIGHT MODE)
// ===================================
const themeToggle = document.getElementById("themeToggle")
const body = document.body

const savedTheme = localStorage.getItem("theme")
if (savedTheme === "dark") {
  body.classList.add("dark-mode")
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode")
  const currentTheme = body.classList.contains("dark-mode") ? "dark" : "light"
  localStorage.setItem("theme", currentTheme)
})

// ===================================
// SEARCH BAR (EXPANDABLE)
// ===================================
const searchBtn = document.getElementById("searchBtn")
const searchBar = document.getElementById("searchBar")
const searchInput = document.getElementById("searchInput")
const searchClose = document.getElementById("searchClose")
const productsGrid = document.getElementById("productsGrid")

searchBtn.addEventListener("click", () => {
  searchBar.classList.add("active")
  searchInput.focus()
})

searchClose.addEventListener("click", () => {
  closeSearchBar()
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && searchBar.classList.contains("active")) {
    closeSearchBar()
  }
})

document.addEventListener("click", (e) => {
  if (searchBar.classList.contains("active") && !searchBar.contains(e.target) && !searchBtn.contains(e.target)) {
    closeSearchBar()
  }
})

function closeSearchBar() {
  searchBar.classList.remove("active")
  searchInput.value = ""
  filterProducts("")
}

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase()
  filterProducts(searchTerm)
})

function filterProducts(searchTerm) {
  const productCards = productsGrid.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    const productName = card.querySelector(".product-name").textContent.toLowerCase()

    if (productName.includes(searchTerm)) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

// ===================================
// MOBILE MENU
// ===================================
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const mobileMenu = document.getElementById("mobileMenu")
const mobileMenuClose = document.getElementById("mobileMenuClose")
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link")

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.add("active")
  mobileMenu.setAttribute("aria-hidden", "false")
})

mobileMenuClose.addEventListener("click", () => {
  closeMobileMenu()
})

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu()
  })
})

function closeMobileMenu() {
  mobileMenu.classList.remove("active")
  mobileMenu.setAttribute("aria-hidden", "true")
}

// ===================================
// HERO CAROUSEL
// ===================================
const carouselTrack = document.getElementById("carouselTrack")
const slides = document.querySelectorAll(".carousel-slide")
const prevBtn = document.getElementById("carouselPrev")
const nextBtn = document.getElementById("carouselNext")
const indicators = document.querySelectorAll(".indicator")

let currentSlide = 0
const totalSlides = slides.length

function updateCarousel() {
  slides.forEach((slide, index) => {
    slide.classList.remove("active")
    if (index === currentSlide) {
      slide.classList.add("active")
    }
  })

  indicators.forEach((indicator, index) => {
    indicator.classList.remove("active")
    if (index === currentSlide) {
      indicator.classList.add("active")
    }
  })
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides
  updateCarousel()
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides
  updateCarousel()
}

nextBtn.addEventListener("click", nextSlide)
prevBtn.addEventListener("click", prevSlide)

indicators.forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    currentSlide = index
    updateCarousel()
  })
})

let autoplayInterval = setInterval(nextSlide, 5000)

const heroCarousel = document.getElementById("heroCarousel")
heroCarousel.addEventListener("mouseenter", () => {
  clearInterval(autoplayInterval)
})

heroCarousel.addEventListener("mouseleave", () => {
  autoplayInterval = setInterval(nextSlide, 5000)
})

// ===================================
// PRODUCT FILTERS
// ===================================
const categoryFilter = document.getElementById("categoryFilter")
const sortFilter = document.getElementById("sortFilter")

categoryFilter.addEventListener("change", applyFilters)
sortFilter.addEventListener("change", applyFilters)

function applyFilters() {
  const category = categoryFilter.value
  const sort = sortFilter.value
  const productCards = Array.from(productsGrid.querySelectorAll(".product-card"))

  productCards.forEach((card) => {
    const cardCategory = card.dataset.category
    if (category === "" || cardCategory === category) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })

  const visibleCards = productCards.filter((card) => card.style.display !== "none")

  if (sort === "price-asc") {
    visibleCards.sort((a, b) => Number.parseFloat(a.dataset.price) - Number.parseFloat(b.dataset.price))
  } else if (sort === "price-desc") {
    visibleCards.sort((a, b) => Number.parseFloat(b.dataset.price) - Number.parseFloat(a.dataset.price))
  } else if (sort === "newest") {
    visibleCards.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date))
  }

  visibleCards.forEach((card) => productsGrid.appendChild(card))
}

// ===================================
// PRODUCT MODAL (ENHANCED)
// ===================================
function createProductModal() {
  const modalHTML = `
    <div class="product-modal-overlay" id="productModal" aria-hidden="true" role="dialog" aria-modal="true">
      <div class="product-modal">
        <button class="modal-close-btn" id="modalCloseBtn" aria-label="Fechar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="product-modal-content">
          <div class="modal-thumbnails" id="modalThumbnails"></div>
          <div class="modal-main-image" id="modalMainImage"></div>
          <div class="modal-product-details">
            <h2 class="modal-product-title" id="modalProductTitle"></h2>
            <p class="modal-product-price" id="modalProductPrice"></p>
            
            <div class="modal-size-selector">
              <label class="modal-size-label">Selecione o tamanho:</label>
              <div class="modal-size-options" id="modalSizeOptions">
                
                <button class="modal-size-btn">P</button>
                <button class="modal-size-btn active">M</button>
                <button class="modal-size-btn">G</button>
                <button class="modal-size-btn">GG</button>
                
              </div>
            </div>

            <button class="modal-buy-btn" id="modalBuyBtn">Comprar</button>

            <div class="modal-info-sections">
              <div class="modal-info-item">
                <div class="modal-info-header">
                  <span class="modal-info-title">Descrição do Produto</span>
                  <svg class="modal-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <div class="modal-info-content" id="modalDescription">
                  Produto de alta qualidade, confeccionado com materiais premium para garantir conforto e durabilidade.
                </div>
              </div>

              <div class="modal-info-item">
                <div class="modal-info-header">
                  <span class="modal-info-title">Medidas e Tamanhos</span>
                  <svg class="modal-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <div class="modal-info-content">
                  
                  <p><strong>P:</strong> Busto 88cm | Cintura 70cm | Quadril 94cm</p>
                  <p><strong>M:</strong> Busto 92cm | Cintura 74cm | Quadril 98cm</p>
                  <p><strong>G:</strong> Busto 96cm | Cintura 78cm | Quadril 102cm</p>
                  <p><strong>GG:</strong> Busto 100cm | Cintura 82cm | Quadril 106cm</p>
                  
                </div>
              </div>

              <div class="modal-info-item">
                <div class="modal-info-header">
                  <span class="modal-info-title">Materiais</span>
                  <svg class="modal-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <div class="modal-info-content">
                  Composição: 100% Algodão.
                </div>
              </div>

              <div class="modal-info-item">
                <div class="modal-info-header">
                  <span class="modal-info-title">Pagamento e Frete</span>
                  <svg class="modal-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <div class="modal-info-content">
                  <p><strong>Pagamento:</strong> Aceitamos cartão de crédito, débito, PIX e boleto bancário.</p>
                  <p><strong>Frete:</strong> Entrega em todo o Brasil. Prazo de 5 a 15 dias úteis. Frete grátis para compras acima de R$ 200,00.</p>
                </div>
              </div>

              <div class="modal-info-item">
                <div class="modal-info-header">
                  <span class="modal-info-title">Devoluções</span>
                  <svg class="modal-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <div class="modal-info-content">
                  Aceitamos devoluções em até 30 dias após o recebimento. O produto deve estar sem uso e com etiquetas.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  document.body.insertAdjacentHTML("beforeend", modalHTML)
}

createProductModal()

const productModal = document.getElementById("productModal")
const modalCloseBtn = document.getElementById("modalCloseBtn")
const modalMainImage = document.getElementById("modalMainImage")
const modalThumbnails = document.getElementById("modalThumbnails")
const modalProductTitle = document.getElementById("modalProductTitle")
const modalProductPrice = document.getElementById("modalProductPrice")
const modalBuyBtn = document.getElementById("modalBuyBtn")

const productCards = document.querySelectorAll(".product-card")
productCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest(".wishlist-btn") || e.target.closest(".add-to-cart")) {
      return
    }

    const productName = card.querySelector(".product-name").textContent
    const productPrice = card.querySelector(".product-price").textContent
    const productImage = card.querySelector(".product-image img").src

    const colorBtns = card.querySelectorAll(".cor-btn img")
    const images = Array.from(colorBtns).map((img) => img.src)

    openProductModal(productName, productPrice, productImage, images)
  })
})

function openProductModal(name, price, mainImage, images) {
  modalProductTitle.textContent = name
  modalProductPrice.textContent = price

  modalMainImage.innerHTML = `<img src="${mainImage}" alt="${name}">`

  modalThumbnails.innerHTML = ""
  images.forEach((imgSrc, index) => {
    const thumbnail = document.createElement("div")
    thumbnail.className = `modal-thumbnail ${index === 0 ? "active" : ""}`
    thumbnail.innerHTML = `<img src="${imgSrc}" alt="Variação ${index + 1}">`

    thumbnail.addEventListener("click", () => {
      modalMainImage.innerHTML = `<img src="${imgSrc}" alt="${name}">`
      document.querySelectorAll(".modal-thumbnail").forEach((t) => t.classList.remove("active"))
      thumbnail.classList.add("active")
    })

    modalThumbnails.appendChild(thumbnail)
  })

  productModal.classList.add("active")
  productModal.setAttribute("aria-hidden", "false")
  document.body.style.overflow = "hidden"
}

function closeProductModal() {
  productModal.classList.remove("active")
  productModal.setAttribute("aria-hidden", "true")
  document.body.style.overflow = ""
}

modalCloseBtn.addEventListener("click", closeProductModal)

productModal.addEventListener("click", (e) => {
  if (e.target === productModal) {
    closeProductModal()
  }
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && productModal.classList.contains("active")) {
    closeProductModal()
  }
})

const modalSizeOptions = document.getElementById("modalSizeOptions")
modalSizeOptions.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-size-btn")) {
    modalSizeOptions.querySelectorAll(".modal-size-btn").forEach((btn) => btn.classList.remove("active"))
    e.target.classList.add("active")
  }
})

document.querySelectorAll(".modal-info-header").forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.closest(".modal-info-item")
    item.classList.toggle("active")
  })
})

modalBuyBtn.addEventListener("click", () => {
  const productName = modalProductTitle.textContent
  const productPrice = Number.parseFloat(modalProductPrice.textContent.replace("R$", "").replace(",", ".").trim())
  const productImage = modalMainImage.querySelector("img").src
  const selectedSize = modalSizeOptions.querySelector(".modal-size-btn.active").textContent

  addToCart({
    name: `${productName} - Tamanho ${selectedSize}`,
    price: productPrice,
    image: productImage,
  })

  closeProductModal()

  const cartSidebar = document.getElementById("cartSidebar")
  cartSidebar.classList.add("active")
  cartSidebar.setAttribute("aria-hidden", "false")
})

// ===================================
// COLOR SELECTOR
// ===================================
productCards.forEach((card) => {
  const colorBtns = card.querySelectorAll(".cor-btn")
  const productImage = card.querySelector(".product-image img")

  colorBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      colorBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const newImage = btn.querySelector("img").src
      productImage.src = newImage
    })
  })
})

// ===================================
// WISHLIST
// ===================================
const wishlistBtns = document.querySelectorAll(".wishlist-btn")

wishlistBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation()
    btn.classList.toggle("active")

    const svg = btn.querySelector("svg path")
    if (btn.classList.contains("active")) {
      svg.setAttribute("fill", "currentColor")
    } else {
      svg.setAttribute("fill", "none")
    }
  })
})

// ===================================
// CART (COM PERSISTÊNCIA E MERCADO PAGO)
// ===================================
const cartBtn = document.getElementById("cartBtn")
const cartSidebar = document.getElementById("cartSidebar")
const cartClose = document.getElementById("cartClose")
const cartCount = document.getElementById("cartCount")
const cartItems = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const addToCartBtns = document.querySelectorAll(".add-to-cart")
const checkoutBtn = document.getElementById("checkoutBtn")

const cart = JSON.parse(localStorage.getItem("cart")) || []

cartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("active")
  cartSidebar.setAttribute("aria-hidden", "false")
})

cartClose.addEventListener("click", () => {
  closeCart()
})

function closeCart() {
  cartSidebar.classList.remove("active")
  cartSidebar.setAttribute("aria-hidden", "true")
}

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation()
    const card = e.target.closest(".product-card")
    const name = card.querySelector(".product-name").textContent
    const priceText = card.querySelector(".product-price").textContent
    const price = Number.parseFloat(priceText.replace("R$", "").replace(",", ".").trim())
    const image = card.querySelector(".product-image img").src

    addToCart({ name, price, image })

    btn.textContent = "Adicionado!"
    btn.style.backgroundColor = "#10b981"
    setTimeout(() => {
      btn.textContent = "Adicionar ao Carrinho"
      btn.style.backgroundColor = ""
    }, 1500)
  })
})

function addToCart(product) {
  const existingItem = cart.find((item) => item.name === product.name && item.image === product.image)

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  updateCart()

  cartBtn.classList.add("bounce")
  setTimeout(() => cartBtn.classList.remove("bounce"), 300)
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  cartCount.textContent = totalItems
  cartCount.style.display = totalItems > 0 ? "flex" : "none"

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Seu carrinho está vazio</p>'
    cartTotal.textContent = "R$ 0,00"
    if (checkoutBtn) checkoutBtn.disabled = true
    return
  }

  if (checkoutBtn) checkoutBtn.disabled = false

  let total = 0
  cartItems.innerHTML = ""

  cart.forEach((item, index) => {
    const quantity = item.quantity || 1
    const itemTotal = item.price * quantity
    total += itemTotal

    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
      <div style="flex: 1;">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.25rem;">${item.name}</h4>
        <p style="font-weight: 600;">R$ ${item.price.toFixed(2).replace(".", ",")}</p>
        <div class="cart-item-quantity" style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
          <button class="quantity-btn" onclick="updateQuantity(${index}, -1)" style="padding: 0.25rem 0.5rem; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">-</button>
          <span style="min-width: 20px; text-align: center;">${quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${index}, 1)" style="padding: 0.25rem 0.5rem; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer;">+</button>
        </div>
      </div>
      <button onclick="removeFromCart(${index})" style="color: var(--text-secondary); background: none; border: none; cursor: pointer; padding: 0.5rem;" aria-label="Remover item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `
    cartItems.appendChild(cartItem)
  })

  cartTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`

  localStorage.setItem("cart", JSON.stringify(cart))
}

function removeFromCart(index) {
  cart.splice(index, 1)
  updateCart()
}

function updateQuantity(index, change) {
  if (!cart[index]) return

  cart[index].quantity = (cart[index].quantity || 1) + change

  if (cart[index].quantity <= 0) {
    removeFromCart(index)
  } else {
    updateCart()
  }
}

window.updateQuantity = updateQuantity
window.removeFromCart = removeFromCart

// ===================================
// CHECKOUT COM MERCADO PAGO
// ===================================
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async function () {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!")
      return
    }

    this.disabled = true
    this.textContent = "Processando..."

    try {
      const preference = await createMercadoPagoPreference()

      if (preference && preference.init_point) {
        window.location.href = preference.init_point
      } else {
        throw new Error("Erro ao criar preferência de pagamento")
      }
    } catch (error) {
      console.error("Erro no checkout:", error)
      alert("Erro ao processar pagamento. Por favor, tente novamente.")
      this.disabled = false
      this.textContent = "Finalizar Compra"
    }
  })
}

async function createMercadoPagoPreference() {
  const items = cart.map((item) => ({
    title: item.name,
    quantity: item.quantity || 1,
    unit_price: item.price,
    currency_id: "BRL",
    picture_url: item.image,
  }))

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)

  const preferenceData = {
    items: items,
    payer: {
      email: MERCADOPAGO_CONFIG.receiverEmail,
    },
    back_urls: {
      success: window.location.origin + "/success.html",
      failure: window.location.origin + "/failure.html",
      pending: window.location.origin + "/pending.html",
    },
    auto_return: "approved",
    statement_descriptor: "PANTHER",
    external_reference: "ORDER-" + Date.now(),
    notification_url: window.location.origin + "/webhook",
  }

  return await createMercadoPagoLink(items, total)
}

async function createMercadoPagoLink(items, total) {
  try {
    const response = await fetch("https://produto.mercadolivre.com.br/MLB-4248023355-camisetas-de-algodo-_JM#reco_item_pos=0&reco_backend=item_decorator&reco_backend_type=function&reco_client=home_items-decorator-legacy&reco_id=5b40ff7f-cbce-4dee-a51b-cdac622d0173&reco_model=&c_id=/home/navigation-recommendations-seed/element&c_uid=da83d267-e7f2-4a22-97a5-5faf014a418e&da_id=navigation&da_position=0&id_origin=/home/dynamic_access&da_sort_algorithm=ranker", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_ACCESS_TOKEN",
      },
      body: JSON.stringify({
        items: items,
        payer: {
          email: MERCADOPAGO_CONFIG.receiverEmail,
        },
        back_urls: {
          success: window.location.origin + "/success.html",
          failure: window.location.origin + "/failure.html",
          pending: window.location.origin + "/pending.html",
        },
        auto_return: "approved",
        statement_descriptor: "PANTHER",
      }),
    })

    if (!response.ok) {
      throw new Error("Erro ao criar preferência")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao criar link de pagamento:", error)

    const itemsParam = encodeURIComponent(
      items.map((item) => `${item.title} (${item.quantity}x R$ ${item.unit_price.toFixed(2)})`).join(", "),
    )

    const totalParam = total.toFixed(2)

    return {
      init_point: `https://produto.mercadolivre.com.br/MLB-4248023355-camisetas-de-algodo-_JM#reco_item_pos=0&reco_backend=item_decorator&reco_backend_type=function&reco_client=home_items-decorator-legacy&reco_id=5b40ff7f-cbce-4dee-a51b-cdac622d0173&reco_model=&c_id=/home/navigation-recommendations-seed/element&c_uid=da83d267-e7f2-4a22-97a5-5faf014a418e&da_id=navigation&da_position=0&id_origin=/home/dynamic_access&da_sort_algorithm=rankerl=${MERCADOPAGO_CONFIG.receiverEmail}&amount=${totalParam}&description=${itemsParam}`,
    }
  }
}

// ===================================
// SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// ===================================
// HEADER SCROLL EFFECT
// ===================================
let lastScroll = 0
const header = document.querySelector(".header")

if (header) {
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset

    if (currentScroll > 100) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

    lastScroll = currentScroll
  })
}


updateCart()