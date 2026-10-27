const STORAGE_KEY = "kibabiiAnnouncements";

const clubSelect = document.getElementById("clubSelect");
const messageInput = document.getElementById("messageInput");
const publishBtn = document.getElementById("publishBtn");
const statusMessage = document.getElementById("statusMessage");
const adminList = document.getElementById("adminList");

if (clubSelect && messageInput && publishBtn && statusMessage && adminList) {
  function loadAnnouncements() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveAnnouncements(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function renderAdminList() {
    const list = loadAnnouncements();
    adminList.innerHTML = "";

    if (list.length === 0) {
      adminList.textContent = "Nothing published yet.";
      return;
    }

    list.forEach(function (item) {
      const card = document.createElement("article");

      const title = document.createElement("h3");
      title.textContent = item.club;

      const text = document.createElement("p");
      text.textContent = item.text;

      const date = document.createElement("small");
      date.textContent = item.date;

      const del = document.createElement("button");
      del.textContent = "Delete";
      del.className = "delete-btn";
      del.addEventListener("click", function () {
        const remaining = loadAnnouncements().filter(function (a) {
          return a.id !== item.id;
        });
        saveAnnouncements(remaining);
        renderAdminList();
      });

      card.append(title, text, date, del);
      adminList.appendChild(card);
    });
  }

  publishBtn.addEventListener("click", function () {
    const message = messageInput.value.trim();

    if (message === "") {
      statusMessage.textContent = "Please type an announcement first.";
      return;
    }

    const list = loadAnnouncements();
    list.unshift({
      id: Date.now(),
      club: clubSelect.value,
      text: message,
      date: new Date().toLocaleString()
    });
    saveAnnouncements(list);

    messageInput.value = "";
    statusMessage.textContent = "Published!";
    renderAdminList();
  });

  renderAdminList();
} else {
  console.warn("Admin page elements not found. This script is being ignored.");
}