//countdown timer

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

//add to cart knop

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

//zoeken / filteren

const searchBar = document.querySelector(".search-bar");
const productList = document.querySelector(".product-list");
const noResultsMessage = document.querySelector("#no-results-message");
const productPage = document.querySelector(".product-page");
const searchForm = document.querySelector(".search");
const initialSearchTerm = new URLSearchParams(window.location.search).get("q");
const favoritesStorageKey = "favorites";
let favorites = [];

try {
    const storedFavorites = localStorage.getItem(favoritesStorageKey);
    if (storedFavorites !== null) {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites) && parsedFavorites.every((favorite) => typeof favorite === "string")) {
            favorites = parsedFavorites;
        } else {
            console.error("Opgeslagen favorieten hebben een ongeldig formaat.");
        }
    }
} catch (error) {
    console.error("Favorieten konden niet uit localStorage worden geladen.", error);
}

function saveFavorites() {
    try {
        localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
    } catch (error) {
        console.error("Favorieten konden niet in localStorage worden opgeslagen.", error);
    }
}

function getProductId(card) {
    const nameElement = card.querySelector(".product-card__name");
    return card.dataset.productId || (nameElement ? nameElement.textContent.trim() : "");
}

function updateFavoriteButtons() {
    document.querySelectorAll(".product-card").forEach((card) => {
        const productId = getProductId(card);
        const favoriteButton = card.querySelector(".favorite-button");
        if (!favoriteButton) {
            return;
        }

        const isFavorite = favorites.includes(productId);
        favoriteButton.classList.toggle("is-favorite", isFavorite);
        favoriteButton.textContent = isFavorite ? "♥" : "♡";
        favoriteButton.setAttribute("aria-pressed", String(isFavorite));
        favoriteButton.setAttribute(
            "aria-label",
            isFavorite ? "Verwijderen uit favorieten" : "Toevoegen aan favorieten"
        );
    });
}

document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest(".favorite-button");
    if (!button) {
        return;
    }

    const card = button.closest(".product-card");
    const productId = card ? getProductId(card) : "";
    if (!productId) {
        return;
    }

    if (favorites.includes(productId)) {
        favorites = favorites.filter((favorite) => favorite !== productId);
    } else {
        favorites.push(productId);
    }

    saveFavorites();
    updateFavoriteButtons();
    updateProducts();
});

updateFavoriteButtons();
 
if (searchBar && initialSearchTerm !== null) {
    searchBar.value = initialSearchTerm;

    if (productPage) {
        searchBar.focus();
    }
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
 
        const matchesCategory =
            currentCategory === "all" ||
            (currentCategory === "favorites"
                ? favorites.includes(getProductId(card))
                : productCategory === currentCategory);
 
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

document.querySelector(".filter-container")?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest(".filter-btn");
    if (!button) {
        return;
    }

    document.querySelectorAll(".filter-btn").forEach((filterButton) => {
        filterButton.classList.remove("active");
    });

    button.classList.add("active");
    currentCategory = button.getAttribute("data-filter");
    updateProducts();
});

if (searchBar) {
    searchBar.addEventListener("input", () => {
        if (productPage) {
            updateProducts();
            return;
        }

        const query = new URLSearchParams({ q: searchBar.value });
        window.location.href = `productpagina.html?${query.toString()}`;
    });
}

searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
});

// ==========================================
// User Story 7 - Voorraadmeldingen
// De melding wordt bepaald door het getal "stock" uit producten.json
// ==========================================
 
function getStockInfo(stock) {
    // Staat er nog tekst in de data, dan laten we die gewoon zien
    if (typeof stock !== "number") {
        return { text: String(stock), className: "stock-ok" };
    }
 
    if (stock <= 0) {
        return { text: "Uitverkocht", className: "stock-out" };
    } else if (stock <= 3) {
        return { text: "Nog maar " + stock + " op voorraad!", className: "stock-low" };
    } else if (stock <= 10) {
        return { text: "Bijna uitverkocht: nog " + stock + " beschikbaar", className: "stock-medium" };
    } else {
        return { text: "Op voorraad", className: "stock-ok" };
    }
}
 
function showStock(badgeElement, stock) {
    const info = getStockInfo(stock);
    badgeElement.textContent = info.text;
    badgeElement.className = "stock-badge " + info.className;
}

//producten inladen van de json

function renderProducts(products) {
    products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-container product-card";
        card.dataset.category = product.category;

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
        showStock(stock, product.stock);
 
        const button = document.createElement("button");
        button.className = "btn-primary add-to-cart";
        button.type = "button";
        button.textContent = "In winkelwagen";

        const favoriteButton = document.createElement("button");
        favoriteButton.className = "favorite-button";
        favoriteButton.type = "button";
        favoriteButton.textContent = "♡";
        favoriteButton.setAttribute("aria-label", "Toevoegen aan favorieten");

        const actions = document.createElement("div");
        actions.className = "product-card__actions";
        actions.append(button, favoriteButton);
        card.dataset.productId = product.name;
 
        card.append(image, name, price, stock, actions);
        if (noResultsMessage) {
            productList.insertBefore(card, noResultsMessage);
        }else {
            productList.appendChild(card);
        }
    });
 
    updateFavoriteButtons();
    updateProducts();
}

function renderButtons(products) {
    const filterContainer = document.querySelector(".filter-container");
    if (!filterContainer) {
        return;
    }

    const categories = [...new Set(products.map((product) => product.category))];
    filterContainer.replaceChildren();

    const allButton = document.createElement("button");
    allButton.className = "filter-btn active";
    allButton.dataset.filter = "all";
    allButton.textContent = "Alle producten";
    filterContainer.append(allButton);

    const favoritesButton = document.createElement("button");
    favoritesButton.className = "filter-btn";
    favoritesButton.dataset.filter = "favorites";
    favoritesButton.textContent = "Favorieten";
    filterContainer.append(favoritesButton);

    categories.forEach((category) => {
        const button = document.createElement("button");
        button.className = "filter-btn";
        button.dataset.filter = category;
        button.textContent = category;
        filterContainer.append(button);
    });
}



   
// ==========================================
// User Story 8 - Externe API voor zowel Homepage als Productpagina
// ==========================================

const isProductPagina = window.location.pathname.includes("productpagina.html");
const loader = document.getElementById('loading-message');

if (!isProductPagina && productList) {
    if (loader) {
        loader.style.display = "block";
    }

    fetch("https://dummyjson.com/products?limit=3")
        .then((response) => {
            if (!response.ok) throw new Error(`Fout bij laden API: ${response.status}`);
            return response.json();
        })
        .then((data) => {
            const apiProducten = data.products.map((item, index) => {
                let stockVal = item.stock;
                if (index === 0) stockVal = 2; 
                if (index === 1) stockVal = 5;
                if (index === 2) stockVal = 0;

                return {
                    id: item.id,
                    name: item.title,
                    image: item.thumbnail || (item.images && item.images[0]) || "",
                    price: item.price,
                    stock: stockVal, 
                    category: item.category || "Overig",
                };
            });

            renderProducts(apiProducten);
            renderButtons(apiProducten);

            if (loader) {
                loader.style.display = "none";
            }
        })
        .catch((error) => {
            console.error(error);
            if (loader) {
                loader.style.display = "none";
            }
            if (noResultsMessage) {
                noResultsMessage.textContent = "Oeps! De producten konden niet worden geladen.";
                noResultsMessage.style.display = "block";
            }
        });
}
 
// ==========================================
// User Story 7 - Voorraadmelding op de homepage
// De kaarten staan hier nog in de HTML, maar de voorraadmelding
// halen we uit producten.json (zoeken op productnaam).
// ==========================================

if (isProductPagina && productList) {
    if (loader) {
        loader.style.display = "block";
    }

    fetch("producten.json")
        .then((response) => {
            if (!response.ok) throw new Error(`Producten laden mislukt: ${response.status}`);
            return response.json();
        })
        .then((lokaleProducten) => {
            if (!Array.isArray(lokaleProducten)) {
                throw new Error("producten.json bevat geen productarray.");
            }

            renderProducts(lokaleProducten);
            renderButtons(lokaleProducten);

            if (loader) {
                loader.style.display = "none";
            }
        })
        .catch((error) => {
            console.error(error);
            if (loader) {
                loader.style.display = "none";
            }
            if (noResultsMessage) {
                noResultsMessage.textContent = "Producten konden niet worden geladen.";
                noResultsMessage.style.display = "block";
            }
        });
    }


    // Dark Mode Toggle

    const themeToggleBtn = document.getElementById("theme-toggle");

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggleBtn) themeToggleBtn.textContent = "☀️";
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            const isDarkMode = document.body.classList.contains("dark-mode");
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");

            themeToggleBtn.textContent = isDarkMode ? "☀️" : "🌙";
        });
    }