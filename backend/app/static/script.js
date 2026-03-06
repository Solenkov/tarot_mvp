let selectedN = 3;

const board = document.getElementById("board");
const drawBtn = document.getElementById("drawBtn");
const nButtons = document.querySelectorAll("button[data-n]");

function setSelectedN(n) {
  selectedN = n;
  nButtons.forEach(btn => {
    btn.classList.toggle("primary", Number(btn.dataset.n) === selectedN);
  });
}

nButtons.forEach(btn => {
  btn.addEventListener("click", () => setSelectedN(Number(btn.dataset.n)));
});

setSelectedN(3);

function createCardBack() {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-inner">
      <div class="face back">TAROT</div>
      <div class="face front"></div>
    </div>
  `;
  return card;
}

function fillCardFront(cardEl, cardData) {
  const front = cardEl.querySelector(".front");
  front.innerHTML = `
    <div class="small">#${cardData.id}</div>
    <h3 style="margin:0;">${cardData.name}</h3>
    <div class="kws">${cardData.keywords.join(" • ")}</div>
    <div class="text">${cardData.text}</div>
  `;
}

async function drawCards() {
  board.innerHTML = "";

  // Сначала показываем "рубашки"
  const backs = Array.from({ length: selectedN }, () => createCardBack());
  backs.forEach(el => board.appendChild(el));

  // лёгкая пауза для эффекта
  await new Promise(r => setTimeout(r, 250));

  const res = await fetch(`/draw?n=${selectedN}`);
  const data = await res.json();

  // Заполняем и переворачиваем по очереди
  data.cards.forEach((c, idx) => {
    const el = backs[idx];
    fillCardFront(el, c);

    setTimeout(() => {
      el.classList.add("flipped");
    }, 250 + idx * 220);
  });
}

drawBtn.addEventListener("click", drawCards);