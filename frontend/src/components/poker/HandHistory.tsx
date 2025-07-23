import { useEffect, useState } from "react";
import { getHands } from "@/lib/api";
import { Hand } from "@/lib/types";

export function HandHistory() {
  const [hands, setHands] = useState<Hand[]>([]);

  useEffect(() => {
    getHands().then(setHands);
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Hand History</h2>
      {hands.map((hand) => (
        <div key={hand.id} className="mb-4">
          <p>{hand.id}</p>
          <p>
            Stacks:{" "}
            {hand.players
              .map((p) => `${p.id.slice(0, 4)}:${p.stack}`)
              .join(", ")}{" "}
            {hand.players
              .map(
                (p) =>
                  (p.isDealer && "Dealer") ||
                  (p.isSmallBlind && "SB") ||
                  (p.isBigBlind && "BB")
              )
              .filter(Boolean)
              .join(", ")}
          </p>
          <p>
            Cards:{" "}
            {Object.entries(hand.cards)
              .map(([id, cards]) => `${id.slice(0, 4)}:${cards.join(",")}`)
              .join(", ")}
          </p>
          <p>Actions: {hand.actions.join(" ")}</p>
          <p>
            Winnings:{" "}
            {Object.entries(hand.winnings)
              .map(
                ([id, win]) => `${id.slice(0, 4)}:${win > 0 ? `+${win}` : win}`
              )
              .join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}
