const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

if (searchInput && noResults) {
  searchInput.addEventListener("input", function () {
    const cards = document.querySelectorAll("main article");
    const text = searchInput.value.toLowerCase().trim();
    let found = 0;

    cards.forEach(function (card) {
      if (card.textContent.toLowerCase().includes(text)) {
        card.style.display = "block";
        found++;
      } else {
        card.style.display = "none";
      }
    });

    noResults.style.display = found === 0 ? "block" : "none";
  });
}