def test_hand_repository_save():
    from src.poker.repositories.hand_repository import HandRepository
    from src.poker.models.player import Player
    from src.poker.models.hand import Hand
    import uuid

    repo = HandRepository()
    hand = Hand(uuid.uuid4(), [Player(uuid.uuid4(), 1000, 0)], [], {}, {})
    repo.save(hand)
    hands = repo.find_all()
    assert len(hands) > 0
