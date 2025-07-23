from dataclasses import dataclass
import uuid


@dataclass
class Player:
    id: uuid.UUID
    stack: int
    position: int
    is_dealer: bool = False
    is_small_blind: bool = False
    is_big_blind: bool = False
