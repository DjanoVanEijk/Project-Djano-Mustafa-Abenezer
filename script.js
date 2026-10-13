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

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Feedback: knop verandert tijdelijk van tekst en kleur
    button.textContent = "Toegevoegd ✓";
    button.classList.add("clicked");

    setTimeout(() => {
      button.textContent = "In winkelwagen";
      button.classList.remove("clicked");
    }, 1500);
  });
});

//============================================
// User Story 3 en 6 - Producten zoeken en filteren (Mustafa)//
//============================================

// ==========================================
// User Story 3 & 6 - Zoeken en Categorie Filter
// ==========================================

const searchBar = document.querySelector(".search-bar");
const productCards = document.querySelectorAll(".product-card");
const noResultsMessage = document.querySelector("#no-results-message");
const filterButtons = document.querySelectorAll(".filter-btn");

let currentCategory = "all"; 

function updateProducts() {
    const searchTerm = searchBar ? searchBar.value.toLowerCase().trim() : "";
    let visibleCount = 0;

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

if (searchBar) {
    searchBar.addEventListener("input", updateProducts);
}

filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        e.target.classList.add("active");

        currentCategory = e.target.getAttribute("data-filter");
        updateProducts();
    });
});








