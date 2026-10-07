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
// User Story 3 - Producten zoeken (Mustafa)//
//============================================

const searchBar = document.querySelector(".search-bar");
const productCards = document.querySelectorAll(".product-card");
const noResultsMessage = document.querySelector("#no-results-message");

if (searchBar) {
  searchBar.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    let visibleCount = 0;

    productCards.forEach((card) => {
      const nameElement = card.querySelector(".product-card__name");
      const productName = nameElement ? nameElement.textContent.toLowerCase() : "";

      if (productName.includes(searchTerm)) {
        card.style.display = "block";
        visibleCount++;
      }else{
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
  });
}




// ===========================================
// User Story 4 - Countdown timer (TODO: Djano)
// Dit is nog een placeholder, geen echte countdown.
// Hint: gebruik setInterval() en new Date() om
// het verschil tussen nu en de eindtijd te berekenen.
// ===========================================
