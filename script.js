// ===========================================
// User Story 4 - Countdown timer (TODO: Djano)
// Dit is nog een placeholder, geen echte countdown.
// Hint: gebruik setInterval() en new Date() om
// het verschil tussen nu en de eindtijd te berekenen.
// ===========================================

const countdownElement = document.getElementById("countdown");

if (countdownElement) {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 24);

  function updateCountdown() {
    const now = new Date();
    const remaining = endTime - now;

    if (remaining <= 0) {
      countdownElement.textContent = "actie afgelopen";
      return;
    }

    const hours = String(Math.floor((remaining / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((remaining / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((remaining / 1000) % 60)).padStart(2, "0");

    countdownElement.textContent = `${hours}:${minutes}:${seconds}`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ===========================================
// User Story 2 - Duidelijke call-to-actions
// Klik op knop wordt afgehandeld met JavaScript
// en de gebruiker krijgt zichtbare feedback
// ===========================================

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest(".add-to-cart");
  if (!button) {
    return;
  }

  button.textContent = "Toegevoegd ✓";
  button.classList.add("clicked");

  setTimeout(() => {
    button.textContent = "In winkelwagen";
    button.classList.remove("clicked");
  }, 1500);
});

//============================================
// User Story 3 en 6 - Producten zoeken en filteren (Mustafa)//
//============================================

// ==========================================
// User Story 3 & 6 - Zoeken en Categorie Filter
// ==========================================

const searchBar = document.querySelector(".search-bar");
const productList = document.querySelector(".product-list");
const noResultsMessage = document.querySelector("#no-results-message");
const filterButtons = document.querySelectorAll(".filter-btn");
const initialSearchTerm = new URLSearchParams(window.location.search).get("q");

if (searchBar && initialSearchTerm !== null) {
    searchBar.value = initialSearchTerm;
}

let currentCategory = "all"; 

function updateProducts() {
    const searchTerm = searchBar ? searchBar.value.toLowerCase().trim() : "";
    let visibleCount = 0;
    const productCards = productList ? productList.querySelectorAll(".product-card") : [];

    productCards.forEach((card) => {
        const productCategory = card.getAttribute("data-category");
        const nameElement = card.querySelector(".product-card__name");
        const productName = nameElement ? nameElement.textContent.toLowerCase() : "";

        const matchesCategory = (currentCategory === "all" || productCategory === currentCategory);

        const matchesSearch = productName.includes(searchTerm);

        if (matchesCategory && matchesSearch) {
            card.style.display = "flex";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    if (noResultsMessage) {
        if (visibleCount === 0) {
            noResultsMessage.style.display = "block";
        } else {
            noResultsMessage.style.display = "none";
        }
    }
}

function renderProducts(products) {
    products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-container product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.className = "product-card__image";
        image.width = 300;
        image.height = 300;

        const name = document.createElement("span");
        name.className = "product-card__name";
        name.textContent = product.name;

        const price = document.createElement("span");
        price.className = "product-card__price";
        price.textContent = `$${Number(product.price).toFixed(2)}`;

        const stock = document.createElement("span");
        stock.className = "stock-badge";
        stock.textContent = product.stock;

        const button = document.createElement("button");
        button.className = "btn-primary add-to-cart";
        button.type = "button";
        button.textContent = "In winkelwagen";

        card.append(image, name, price, stock, button);
        productList.insertBefore(card, noResultsMessage);
    });

    updateProducts();
}

if (productList && searchBar && noResultsMessage && document.querySelector(".product-page")) {
    fetch("producten.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Producten laden mislukt: ${response.status}`);
            }

            return response.json();
        })
        .then((products) => {
            if (!Array.isArray(products)) {
                throw new Error("producten.json bevat geen productarray.");
            }

            renderProducts(products);
        })
        .catch((error) => {
            console.error(error);
                noResultsMessage.textContent = "Producten konden niet worden geladen.";
            noResultsMessage.style.display = "block";
        });
}

filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        e.target.classList.add("active");

        currentCategory = e.target.getAttribute("data-filter");
        updateProducts();
    });
});





