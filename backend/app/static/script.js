let selectedN = 3;
let selectedLang = "en";
let lastCardIds = [];

const board = document.getElementById("board");
const drawBtn = document.getElementById("drawBtn");
const countButtons = document.querySelectorAll(".count-btn");
const langButtons = document.querySelectorAll(".lang-link");

const i18n = {
  ru: {
    pageTitle: "Таро (MVP)",
    subtitle: "Это символическая интерпретация для размышлений. Не “предсказание судьбы”.",
    countLabel: "Сколько карт?",
    drawBtn: "Тянуть карты",
    footer: "Для портфолио: API + Docker. Юмор — лёгкий, истерик нет."
  },
  en: {
    pageTitle: "Tarot (MVP)",
    subtitle: "This is a symbolic interpretation for reflection. Not a prophecy of destiny.",
    countLabel: "How many cards?",
    drawBtn: "Draw cards",
    footer: "For portfolio: API + Docker. Light sarcasm, no hysterics."
  },
  de: {
    pageTitle: "Tarot (MVP)",
    subtitle: "Das ist eine symbolische Deutung zum Nachdenken. Keine Schicksalsvorhersage.",
    countLabel: "Wie viele Karten?",
    drawBtn: "Karten ziehen",
    footer: "Für das Portfolio: API + Docker. Leichter Sarkasmus, keine Dramen."
  }
};

function applyTranslations() {
  const t = i18n[selectedLang];

  document.documentElement.lang = selectedLang;
  document.getElementById("title").textContent = t.pageTitle;
  document.getElementById("subtitle").textContent = t.subtitle;
  document.getElementById("countLabel").textContent = t.countLabel;
  document.getElementById("drawBtn").textContent = t.drawBtn;
  document.getElementById("footerText").textContent = t.footer;
}

function setSelectedN(n) {
  selectedN = n;
  countButtons.forEach((btn) => {
    btn.classList.toggle("primary", Number(btn.dataset.n) === selectedN);
  });
}

async function setSelectedLang(lang) {
  selectedLang = lang;
  langButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === selectedLang);
  });
  applyTranslations();

  if (lastCardIds.length > 0) {
    await redrawExistingCards();
  }
}

countButtons.forEach((btn) => {
  btn.addEventListener("click", () => setSelectedN(Number(btn.dataset.n)));
});

langButtons.forEach((btn) => {
  btn.addEventListener("click", async () => {
    await setSelectedLang(btn.dataset.lang);
  });
});

setSelectedN(3);
setSelectedLang("en");

function createCardBack() {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-inner">
      <div class="face back">
        <div class="back-label">TAROT</div>
      </div>
      <div class="face front"></div>
    </div>
  `;
  return card;
}

function fillCardFront(cardEl, cardData) {
  const front = cardEl.querySelector(".front");
  front.innerHTML = `
    <div class="card-image-wrap">
      <img class="card-image" src="${cardData.image}" alt="${cardData.name}" />
    </div>
    <div class="card-content">
      <div class="small">#${cardData.id}</div>
      <h3 class="card-title">${cardData.name}</h3>
      <div class="kws">${cardData.keywords.join(" • ")}</div>
      <div class="text">${cardData.text}</div>
    </div>
  `;
}

function renderCards(cards) {
  board.innerHTML = "";

  cards.forEach((cardData) => {
    const el = document.createElement("div");
    el.className = "card flipped";
    el.innerHTML = `
      <div class="card-inner">
        <div class="face back">
          <div class="back-label">TAROT</div>
        </div>
        <div class="face front"></div>
      </div>
    `;
    fillCardFront(el, cardData);
    board.appendChild(el);
  });
}

async function redrawExistingCards() {
  const ids = lastCardIds.join(",");
  const res = await fetch(`/draw?ids=${encodeURIComponent(ids)}&lang=${selectedLang}`);
  const data = await res.json();
  renderCards(data.cards);
}

async function drawCards() {
  board.innerHTML = "";

  const backs = Array.from({ length: selectedN }, () => createCardBack());
  backs.forEach((el) => board.appendChild(el));

  await new Promise((r) => setTimeout(r, 250));

  const res = await fetch(`/draw?n=${selectedN}&lang=${selectedLang}`);
  const data = await res.json();

  lastCardIds = data.cards.map(card => card.id);

  data.cards.forEach((cardData, idx) => {
    const el = backs[idx];
    fillCardFront(el, cardData);

    setTimeout(() => {
      el.classList.add("flipped");
    }, 250 + idx * 220);
  });
}

drawBtn.addEventListener("click", drawCards);