from pathlib import Path
import json
import random

from fastapi import FastAPI, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Tarot MVP", version="0.3.0")

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
CARDS_FILE = BASE_DIR / "cards.json"

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


def load_cards() -> list:
    with open(CARDS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def serialize_card(card: dict, lang: str) -> dict:
    translations = card["translations"]
    t = translations.get(lang) or translations["ru"]

    return {
        "id": card["id"],
        "arcana": card["arcana"],
        "suit": card.get("suit"),
        "number": card["number"],
        "image": card["image"],
        "name": t["name"],
        "keywords": t["keywords"],
        "text": t["text"],
    }


@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/health")
def health():
    cards = load_cards()
    return {
        "status": "ok",
        "version": "0.3.0",
        "cards_loaded": len(cards)
    }


@app.get("/draw")
def draw(
    n: int = Query(default=1, ge=1, le=5),
    lang: str = Query(default="en"),
    ids: str | None = Query(default=None)
):
    cards = load_cards()

    if ids:
        requested_ids = [x.strip() for x in ids.split(",") if x.strip()]
        card_map = {card["id"]: card for card in cards}
        chosen = [card_map[card_id] for card_id in requested_ids if card_id in card_map]
    else:
        chosen = random.sample(cards, k=min(n, len(cards)))

    result = [serialize_card(card, lang) for card in chosen]

    return {
        "count": len(result),
        "lang": lang,
        "cards": result,
    }