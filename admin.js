import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const announcements = collection(db, "announcements");

const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginStatus = document.getElementById("loginStatus");
const publishBtn = document.getElementById("publishBtn");
const statusMessage = document.getElementById("statusMessage");
const adminList = document.getElementById("adminList");

let stopListening = null;

// ---- Fill the club dropdown from clubs.html ----
// Every club card on clubs.html (its <h2> title) becomes an option.
// If clubs.html can't be read, the options already in admin.html stay as a backup.
async function loadClubs() {
  try {
    const res = await fetch("clubs.html", { cache: "no-store" });
    if (!res.ok) return;
    const page = new DOMParser().parseFromString(await res.text(), "text/html");
    const names = [...page.querySelectorAll("main article h2")]
      .map((h) => h.textContent.trim())
      .filter(Boolean);
    if (names.length === 0) return;

    const select = document.getElementById("clubSelect");
    select.innerHTML = "";
    names.forEach((name) => {
      const option = document.createElement("option");
      option.textContent = name;
      select.appendChild(option);
    });
  } catch (err) {
    // keep the backup options
  }
}
loadClubs();

// ---- Login ----
loginBtn.addEventListener("click", async () => {
  loginStatus.textContent = "Logging in...";
  try {
    await signInWithEmailAndPassword(
      auth,
      document.getElementById("emailInput").value.trim(),
      document.getElementById("passwordInput").value
    );
    loginStatus.textContent = "";
  } catch (err) {
    loginStatus.textContent = "Login failed. Check your email and password.";
  }
});

logoutBtn.addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  const loggedIn = !!user;
  loginBox.style.display = loggedIn ? "none" : "block";
  adminPanel.style.display = loggedIn ? "block" : "none";

  if (stopListening) { stopListening(); stopListening = null; }
  if (loggedIn) listen();
  else adminList.innerHTML = "";
});

// ---- Publish ----
publishBtn.addEventListener("click", async () => {
  const club = document.getElementById("clubSelect").value;
  const message = document.getElementById("messageInput").value.trim();

  if (!message) {
    statusMessage.textContent = "Please type an announcement first.";
    return;
  }

  publishBtn.disabled = true;
  statusMessage.textContent = "Publishing...";
  try {
    await addDoc(announcements, { club, message, createdAt: serverTimestamp() });
    document.getElementById("messageInput").value = "";
    statusMessage.textContent = "Published! Everyone can now see it.";
  } catch (err) {
    statusMessage.textContent = "Could not publish. Make sure you are logged in.";
  }
  publishBtn.disabled = false;
});

// ---- Show + delete published announcements ----
function listen() {
  const q = query(announcements, orderBy("createdAt", "desc"));
  stopListening = onSnapshot(q, (snapshot) => {
    adminList.innerHTML = "";
    snapshot.forEach((d) => {
      const data = d.data();
      const card = document.createElement("article");

      const h = document.createElement("h2");
      h.textContent = data.club;

      const p = document.createElement("p");
      p.textContent = data.message;

      const small = document.createElement("small");
      small.textContent = data.createdAt ? data.createdAt.toDate().toLocaleString() : "Just now";

      const del = document.createElement("button");
      del.className = "delete-btn";
      del.textContent = "Delete";
      del.addEventListener("click", async () => {
        if (confirm("Delete this announcement?")) {
          await deleteDoc(doc(db, "announcements", d.id));
        }
      });

      card.append(h, p, small, del);
      adminList.appendChild(card);
    });
  });
}
