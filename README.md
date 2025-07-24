# 🃏 Fullstack Poker Game

A simplified full-stack Texas Hold'em Poker simulation game. This project consists of a Python + FastAPI backend and a TypeScript + Next.js frontend. Players can simulate full poker hands with logs, history, and calculated winnings.

## 📁 Project Structure

poker-game/
├── backend/  FastAPI backend using Poetry, raw SQL, repository pattern

├── frontend/  Next.js frontend with shadcn/ui components

└── docker-compose.yml  Full stack orchestration with PostgreSQL


---

## 🚀 Features

- Simulate full 6-player Texas Hold'em hands
- Action logging: Fold, Call, Raise, All-in, etc.
- Automatic hand history saving
- Winnings calculated using `pokerkit`
- Backend and frontend integration via REST API
- Dockerized setup with PostgreSQL
- Clean separation of game logic and UI logic

---

## 🧱 Tech Stack

### 🔧 Backend
- **FastAPI** with `dataclass` models
- **PostgreSQL** with raw SQL (no ORMs)
- **Repository Pattern** for DB access
- **Poetry** for dependency management
- **pokerkit** for game resolution logic

### 💻 Frontend
- **Next.js** (App Router)
- **React + TypeScript**
- **shadcn/ui** for UI components
- **REST API integration**
- Game logic handled on client-side
- Logs and history displayed in clean UI

### 🐳 DevOps
- Docker & Docker Compose
- Multi-service container orchestration

---

## 📦 Setup Instructions

### 1️⃣ Clone and Setup

```bash
git clone https://github.com/Keba777/poker-game.git
cd poker-game
```
### 2️⃣ Run with Docker Compose
Ensure Docker is installed, then:
```bash
docker compose up -d
```
The app will be available at:

Frontend: http://localhost:3000

Backend API: http://localhost:8000/api/v1

## 🎮 How to Play
Click Start/Reset to initialize a new hand.

Use the action buttons (Fold, Check, Call, Raise, Allin) to simulate each player's move.

Game actions are logged on the left side.

Once a hand is completed, it is saved and appears on the Hand History (right side).

Amount controls respect big blind increments (default: 40 chips).

The full state, including player roles and outcomes, is tracked and logged.

## 📄 API Endpoints
Method	Endpoint	Description
GET	/api/v1/hands	Fetch hand history
POST	/api/v1/hands	Submit completed hand

## 🧪 Tests
Backend: Includes at least one API test

Frontend: Contains E2E or integration test for key logic
