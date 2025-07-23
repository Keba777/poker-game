import uuid
from pokerkit import NoLimitTexasHoldem, Automation
from ..models.hand import Hand
from ..models.player import Player
from ..repositories.hand_repository import HandRepository


class PokerService:
    def __init__(self):
        self.repo = HandRepository()

    def process_hand(self, hand_data: dict) -> Hand:
        players = [
            Player(
                uuid.UUID(p["id"]),
                p["stack"],
                p["position"],
                p.get("is_dealer", False),
                p.get("is_small_blind", False),
                p.get("is_big_blind", False),
            )
            for p in hand_data["players"]
        ]
        cards = {uuid.UUID(k): v for k, v in hand_data["cards"].items()}
        actions = hand_data["actions"]
        hand_id = uuid.uuid4()

        state = NoLimitTexasHoldem.create_state(
            (
                Automation.ANTE_POSTING,
                Automation.BET_COLLECTION,
                Automation.BLIND_OR_STRADDLE_POSTING,
                Automation.HOLE_CARDS_SHOWING_OR_MUCKING,
                Automation.HAND_KILLING,
                Automation.CHIPS_PUSHING,
                Automation.CHIPS_PULLING,
            ),
            False,
            0,
            (20, 40),
            40,
            [p.stack for p in players],
            len(players),
        )
        for p_id, cards_list in cards.items():
            state.deal_hole("".join(cards_list))
        for action in actions:
            if action.startswith("b"):
                state.complete_bet_or_raise_to(int(action[1:]))
            elif action.startswith("r"):
                state.complete_bet_or_raise_to(int(action[1:]))
            elif action == "c":
                state.check_or_call()
            elif action == "f":
                state.fold()
            elif action == "allin":
                state.complete_bet_or_raise_to(max(p.stack for p in players))

        winnings = {p.id: state.payoffs[i] for i, p in enumerate(players)}
        hand = Hand(hand_id, players, actions, cards, winnings, True)
        self.repo.save(hand)
        return hand
