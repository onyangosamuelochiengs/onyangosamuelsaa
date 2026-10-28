import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore, collection, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const feed = document.getElementById("feed");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");

function applySearch() {
  const term = searchInput.value.toLowerCase();
  let shown = 0;
  feed.querySelectorAll("article").forEach((card) => {
    const match = card.textContent.toLowerCase().includes(term);
    card.style.display = match ? "" : "none";
    if (match) shown++;
  });
  noResults.style.display = shown === 0 ? "block" : "none";
}

searchInput.addEventListener("input", applySearch);

const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  feed.innerHTML = "";
  snapshot.forEach((d) => {
    const data = d.data();
    const card = document.createElement("article");

    const h = document.createElement("h2");
    h.textContent = data.club;

    const p = document.createElement("p");
    p.textContent = data.message;

    const small = document.createElement("small");
    small.textContent = data.createdAt ? data.createdAt.toDate().toLocaleString() : "Just now";

    card.append(h, p, small);
    feed.appendChild(card);
  });
  applySearch();
}, () => {
  feed.innerHTML = "<p>Could not load announcements. Please try again later.</p>";
});
