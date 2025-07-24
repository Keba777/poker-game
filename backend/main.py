from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # 👈 import this
from pydantic import BaseModel
from src.poker.repositories.hand_repository import HandRepository
from src.poker.services.poker_service import PokerService

app = FastAPI()


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HandCreate(BaseModel):
    players: list[dict]
    actions: list[str]
    cards: dict[str, list[str]]
    winnings: dict[str, int]


@app.post("/api/v1/hands/", status_code=201)
async def create_hand(hand_data: HandCreate):
    service = PokerService()
    hand = service.process_hand(hand_data.model_dump())
    return {"id": str(hand.id), "winnings": hand.winnings}


@app.get("/api/v1/hands/", status_code=200)
async def get_hands():
    repo = HandRepository()
    hands = repo.find_all()
    return [
        {
            "id": str(h.id),
            "players": [p.__dict__ for p in h.players],
            "actions": h.actions,
            "cards": h.cards,
            "winnings": h.winnings,
        }
        for h in hands
    ]
