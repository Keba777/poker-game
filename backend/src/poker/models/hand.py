from dataclasses import dataclass
import uuid
from typing import List, Dict
from .player import Player


@dataclass
class Hand:
    id: uuid.UUID
    players: List[Player]
    actions: List[str]
    cards: Dict[uuid.UUID, List[str]]
    winnings: Dict[uuid.UUID, int]
    completed: bool = False
