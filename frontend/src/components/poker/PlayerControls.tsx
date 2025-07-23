import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GameLogic } from "./GameLogic";

export function PlayerControls({ game }: { game: GameLogic }) {
  const [stack, setStack] = useState(1000);
  const players = game.getCurrentHand()?.players || [];

  const handleReset = () => {
    game.startHand();
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        <Input
          type="number"
          value={stack}
          onChange={(e) => setStack(Number(e.target.value))}
          className="w-24"
        />
        <Button onClick={() => players.forEach((p) => (p.stack = stack))}>
          Set All Stacks
        </Button>
        <Button onClick={handleReset}>
          {game.getCurrentHand() ? "Reset" : "Start"}
        </Button>
      </div>
      <div>
        {players.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <span>
              Player {p.id.slice(0, 4)}: {p.stack}
            </span>
            {p.isDealer && <span>Dealer</span>}
            {p.isSmallBlind && <span>SB</span>}
            {p.isBigBlind && <span>BB</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
