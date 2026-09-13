/* ---------------------------------------------------
   Arcadeus — game hub logic
   To add a game: add an entry to GAMES below.
   - id: unique slug
   - name: display name
   - cat: one of arcade | puzzle | action | runner | strategy
   - url: the game's page (must allow iframe embedding)
   - emoji + colors: used to auto-generate the thumbnail
--------------------------------------------------- */

const GAMES = [
  {
    id: "2048",
    name: "2048",
    cat: "puzzle",
    url: "https://play2048.co/",
    emoji: "🔢",
    from: "#7c5cff",
    to: "#3d2b8f"
  },
  {
    id: "cookie-clicker",
    name: "Cookie Clicker",
    cat: "strategy",
    url: "https://orteil.dashnet.org/cookieclicker/",
    emoji: "🍪",
    from: "#c98a4b",
    to: "#5c3a1e"
  },
  {
    id: "chrome-dino",
    name: "Dino Run",
    cat: "runner",
    url: "https://chromedino.com/",
    emoji: "🦖",
    from: "#4b4b4b",
    to: "#1a1a1a"
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    cat: "puzzle",
    url: "https://minesweeperonline.com/",
    emoji: "💣",
    from: "#5a5a6e",
    to: "#23232f"
  },
  {
    id: "pacman",
    name: "Pac-Man",
    cat: "arcade",
    url: "https://www.google.com/logos/2010/pacman10-i.html",
    emoji: "👻",
    from: "#ffcc00",
    to: "#8a5c00"
  },
  {
    id: "snake",
    name: "Snake",
    cat: "arcade",
    url: "games/snake.html",
    emoji: "🐍",
    from: "#00e0b8",
    to: "#04524a"
  },
  {
    id: "tictactoe",
    name: "Tic-Tac-Toe",
    cat: "strategy",
    url: "games/tictactoe.html",
    emoji: "⭕",
    from: "#ff5c7a",
    to: "#7a1f34"
  },
  {
    id: "memory",
    name: "Memory Match",
    cat: "puzzle",
    url: "games/memory.html",
    emoji: "🃏",
    from: "#5c8bff",
    to: "#1f3b7a"
  },
  {
    id: "dodge",
    name: "Meteor Dodge",
    cat: "action",
    url: "games/dodge.html",
    emoji: "☄️",
    from: "#ff8a3d",
    to: "#7a2f04"
  }
];

/* ---------- thumbnail generation (inline SVG, no external images) ---------- */

function makeThumb(game) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${game.from}"/>
          <stop offset="100%" stop-color="${game.to}"/>
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#g)"/>
      <text x="50%" y="54%" font-size="120" text-anchor="middle" dominant-baseline="middle">${game.emoji}</text>
    </svg>`;
  return "data:image/svg+xml;base64," + btoa(svg);
}

/* ---------- rendering ---------- */

const grid = document.getElementById("gameGrid");
const emptyState = document.getElementById("emptyState");
const resultsInfo = document.getElementById("resultsInfo");
const searchInput = document.getElementById("searchInput");
const categoryNav = document.getElementById("categoryNav");

let activeCategory = "all";
let query = "";

function renderGrid() {
  const filtered = GAMES.filter(g => {
    const matchesCat = activeCategory === "all" || g.cat === activeCategory;
    const matchesQuery = g.name.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQuery;
  });

  grid.innerHTML = "";
  filtered.forEach(g => grid.appendChild(buildCard(g)));

  emptyState.hidden = filtered.length !== 0;

  if (query.trim() !== "") {
    resultsInfo.hidden = false;
    resultsInfo.textContent = `${filtered.length} result${filtered.length === 1 ? "" : "s"} for "${query}"`;
  } else {
    resultsInfo.hidden = true;
  }
}

function buildCard(game) {
  const card = document.createElement("div");
  card.className = "game-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Play ${game.name}`);

  card.innerHTML = `
    <div class="thumb-wrap">
      <img src="${makeThumb(game)}" alt="${game.name} thumbnail" loading="lazy">
      <div class="play-overlay"><span>▶</span></div>
    </div>
    <div class="card-info">
      <h3>${game.name}</h3>
      <span class="card-cat">${game.cat}</span>
    </div>
  `;

  const open = () => openGame(game);
  card.addEventListener("click", open);
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
  });

  return card;
}

/* ---------- search + category events ---------- */

searchInput.addEventListener("input", e => {
  query = e.target.value;
  renderGrid();
});

categoryNav.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  categoryNav.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  activeCategory = btn.dataset.cat;
  renderGrid();
});

/* ---------- modal / player ---------- */

const modalOverlay = document.getElementById("modalOverlay");
const gameFrame = document.getElementById("gameFrame");
const modalGameName = document.getElementById("modalGameName");
const modalGameCat = document.getElementById("modalGameCat");
const modalThumb = document.getElementById("modalThumb");
const frameLoading = document.getElementById("frameLoading");
const frameLoadingThumb = document.getElementById("frameLoadingThumb");
const closeModalBtn = document.getElementById("closeModalBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const frameWrap = document.getElementById("frameWrap");

function openGame(game) {
  modalGameName.textContent = game.name;
  modalGameCat.textContent = game.cat;
  modalThumb.src = makeThumb(game);
  frameLoadingThumb.src = makeThumb(game);

  frameLoading.classList.remove("hidden");
  gameFrame.src = game.url;
  modalOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

gameFrame.addEventListener("load", () => {
  frameLoading.classList.add("hidden");
});

function closeModal() {
  modalOverlay.classList.remove("open");
  gameFrame.src = "";
  document.body.style.overflow = "";
}

closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modalOverlay.classList.contains("open")) closeModal();
});

fullscreenBtn.addEventListener("click", () => {
  if (frameWrap.requestFullscreen) frameWrap.requestFullscreen();
});

/* ---------- init ---------- */

renderGrid();
