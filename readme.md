# Tarot MVP — Portfolio Demo (Docker + AWS)

A small but complete web project built as a portfolio piece: a Tarot “draw cards” experience with a simple API, multilingual UI, and a clean deployment setup.

This project is **not** “fortune telling”. It’s a symbolic interpretation tool for reflection and storytelling.

---

## What it does

- Draw **1 / 3 / 5** cards
- Smooth card flip animation
- **EN / DE / RU** UI
- Card meanings/descriptions are stored separately from images (easy to extend, easy to add languages)
- Backend API returns random cards or re-renders the same draw in a different language

---

## Why it exists (portfolio goals)

This demo was built to show practical skills end-to-end:

- basic product thinking (MVP scope, clean UX)
- frontend (HTML/CSS/JS) + backend API
- Dockerized deployment
- running on a real server (AWS EC2)
- clean project structure and data separation

---

## Architecture

- **Frontend:** static HTML/CSS/JS
- **Backend:** Python (FastAPI) API
- **Data:** JSON files for card content (multilingual), images stored separately
- **Deployment:** Docker / Docker Compose on AWS EC2

---

## API

> Examples (adjust host if needed)

### Health check

`GET /health`

Returns something like:

```json
{"status":"ok","version":"0.3.0","cards_loaded":78}
```
