
// ===========================================
// User Story 4 - Countdown timer
// ===========================================
 
const countdownBox = document.getElementById("countdown");
const countdownValue = document.getElementById("countdown-value");
 
if (countdownBox && countdownValue) {
  // Het eindmoment bewaren we in localStorage.
  // Zo begint de timer niet opnieuw als je de pagina ververst.
  let savedEnd = localStorage.getItem("endTime");
 
  if (!savedEnd) {
    savedEnd = Date.now() + 24 * 60 * 60 * 1000; // nu + 24 uur
    localStorage.setItem("endTime", savedEnd);
  }
 
  const endTime = Number(savedEnd);
 
  function updateCountdown() {
    const remaining = endTime - Date.now();
 
    if (remaining <= 0) {
      countdownBox.textContent = "Actie afgelopen";
      return;
    }
 
    const hours = String(Math.floor(remaining / (1000 * 60 * 60))).padStart(2, "0");
    const minutes = String(Math.floor((remaining / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((remaining / 1000) % 60)).padStart(2, "0");
 
    // Alleen het getal veranderen, de tekst ervoor blijft staan
    countdownValue.textContent = `${hours}:${minutes}:${seconds}`;
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
    
    button.textContent = "Toegevoegd ✓";
    button.classList.add("clicked");
 
    setTimeout(() => {
      button.textContent = "In winkelwagen";
      button.classList.remove("clicked");
    }, 1500);
  });
});
 