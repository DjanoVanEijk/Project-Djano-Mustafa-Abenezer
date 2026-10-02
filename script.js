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

// ===========================================
// User Story 4 - Countdown timer (TODO: Djano)
// Dit is nog een placeholder, geen echte countdown.
// Hint: gebruik setInterval() en new Date() om
// het verschil tussen nu en de eindtijd te berekenen.
// ===========================================
