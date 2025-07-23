def test_player_init():
    from src.poker.models.player import Player
    import uuid

    player = Player(id=uuid.uuid4(), stack=1000, position=0)
    assert player.stack == 1000
    assert player.position == 0
