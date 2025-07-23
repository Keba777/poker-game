import psycopg2
import json
from ..models.hand import Hand
from ..models.player import Player
import uuid


class HandRepository:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname="poker",
            user="poker_user",
            password="poker_pass",
            host="db",
            port="5432",
        )
        self.create_table()

    def create_table(self):
        with self.conn.cursor() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS hands (
                    id UUID PRIMARY KEY,
                    players JSONB NOT NULL,
                    actions JSONB NOT NULL,
                    cards JSONB NOT NULL,
                    winnings JSONB NOT NULL,
                    completed BOOLEAN NOT NULL
                )
            """
            )
            self.conn.commit()

    def save(self, hand: Hand):
        def player_to_dict(p):
            return {
                "id": str(p.id),
                "stack": p.stack,
                "position": p.position,
                "is_dealer": p.is_dealer,
                "is_small_blind": p.is_small_blind,
                "is_big_blind": p.is_big_blind,
            }

        with self.conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO hands (id, players, actions, cards, winnings, completed)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE
                SET players = EXCLUDED.players,
                    actions = EXCLUDED.actions,
                    cards = EXCLUDED.cards,
                    winnings = EXCLUDED.winnings,
                    completed = EXCLUDED.completed
            """,
                (
                    str(hand.id),
                    json.dumps([player_to_dict(p) for p in hand.players]),
                    json.dumps(hand.actions),
                    json.dumps({str(k): v for k, v in hand.cards.items()}),
                    json.dumps({str(k): v for k, v in hand.winnings.items()}),
                    hand.completed,
                ),
            )
            self.conn.commit()

    def find_all(self):
        with self.conn.cursor() as cur:
            cur.execute(
                "SELECT id, players, actions, cards, winnings, completed FROM hands"
            )
            rows = cur.fetchall()
            return [
                Hand(
                    uuid.UUID(row[0]),
                    [Player(**p) for p in row[1]],
                    row[2],
                    row[3],
                    row[4],
                    row[5],
                )
                for row in rows
            ]
