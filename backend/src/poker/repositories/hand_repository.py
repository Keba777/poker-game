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
            host="localhost",
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
                    hand.id,
                    json.dumps([p.__dict__ for p in hand.players]),
                    json.dumps(hand.actions),
                    json.dumps(hand.cards),
                    json.dumps(hand.winnings),
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
                    [Player(**p) for p in json.loads(row[1])],
                    json.loads(row[2]),
                    json.loads(row[3]),
                    json.loads(row[4]),
                    row[5],
                )
                for row in rows
            ]
