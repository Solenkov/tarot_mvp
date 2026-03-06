from pathlib import Path
import random

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Tarot MVP", version="0.1.0")

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

# Мини-набор карт (заглушка). Потом заменим на 78 карт из JSON.
CARDS = [
    {
        "id": 0,
        "name": "Шут",
        "keywords": ["начало", "риск", "спонтанность"],
        "text": "Новый старт. Только не путай смелость с 'да похуй, само разрулится'.",
    },
    {
        "id": 1,
        "name": "Маг",
        "keywords": ["инициатива", "ресурсы", "влияние"],
        "text": "Инструменты у тебя есть. Вопрос — ты делаешь или изображаешь деятельность?",
    },
    {
        "id": 16,
        "name": "Башня",
        "keywords": ["слом", "кризис", "правда"],
        "text": "Что-то рухнет. Скорее всего — иллюзии. Неприятно, но полезно.",
    },
    {
        "id": 9,
        "name": "Отшельник",
        "keywords": ["пауза", "самоанализ", "дистанция"],
        "text": "Отойди на шаг и подумай. Да, без драм и срочных решений прямо сейчас.",
    },
    {
        "id": 3,
        "name": "Императрица",
        "keywords": ["рост", "забота", "создание"],
        "text": "Хочешь результата — корми то, что выращиваешь. Отношения/проект/тело — всё одно и то же.",
    },
]

# Статика
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/draw")
def draw(n: int = 1):
    n = max(1, min(n, 5))
    chosen = random.sample(CARDS, k=min(n, len(CARDS)))
    return {"count": len(chosen), "cards": chosen}