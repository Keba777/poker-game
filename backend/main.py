from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.poker.models.player import Player
from src.poker.models.hand import Hand
from src.poker.repositories.hand_repository import HandRepository
from src.poker.services.poker_service import PokerService
import uuid
import json

app = FastAPI()


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
