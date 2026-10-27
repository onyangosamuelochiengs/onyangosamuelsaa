const STORAGE_KEY = "kibabiiAnnouncements";

document.addEventListener("DOMContentLoaded", function () {
  const feed = document.getElementById("feed");
  const searchInput = document.getElementById("searchInput");
  const noResults = document.getElementById("noResults");

  function loadAnnouncements() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function renderFeed() {
    const list = loadAnnouncements();
    const query = (searchInput ? searchInput.value.trim().toLowerCase() : "");

    if (!feed) return;

    feed.innerHTML = "";

    const filteredList = list.filter(function (item) {
      if (!query) return true;

      const clubMatch = (item.club || "").toLowerCase().includes(query);
      const textMatch = (item.text || "").toLowerCase().includes(query);
      const dateMatch = (item.date || "").toLowerCase().includes(query);

      return clubMatch || textMatch || dateMatch;
    });

    if (filteredList.length === 0) {
      const empty = document.createElement("article");
      const p = document.createElement("p");
      p.textContent = "No announcement has been made yet.";
      empty.appendChild(p);
      feed.appendChild(empty);

      if (noResults) {
        noResults.style.display = "block";
        noResults.textContent = "No announcement has been made yet.";
      }

      return;
    }

    if (noResults) {
      noResults.style.display = "none";
    }

    filteredList.forEach(function (item) {
      const card = document.createElement("article");

      const title = document.createElement("h2");
      title.textContent = item.club;

      const text = document.createElement("p");
      text.textContent = item.text;

      const date = document.createElement("small");
      date.textContent = item.date;

      card.append(title, text, date);
      feed.appendChild(card);
    });
  }

  renderFeed();

  if (searchInput) {
    searchInput.addEventListener("input", renderFeed);
  }

  window.addEventListener("storage", renderFeed);
});
