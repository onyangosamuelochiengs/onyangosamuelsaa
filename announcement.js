const feed = document.getElementById("feed");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

function loadAnnouncements() {
  try {
    return JSON.parse(localStorage.getItem("kibabiiAnnouncements")) || [];
  } catch (e) {
    return [];
  }
}

function renderFeed() {
  const list = loadAnnouncements();
  const query = (searchInput ? searchInput.value.trim().toLowerCase() : "");

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
    p.textContent = "No announcement matches your search.";
    empty.appendChild(p);
    feed.appendChild(empty);

    if (noResults) {
      noResults.style.display = "block";
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

if (feed) {
  renderFeed();

  if (searchInput) {
    searchInput.addEventListener("input", renderFeed);
  }

  window.addEventListener("storage", renderFeed);
} else {
  console.warn("No #feed element found on this page.");
}