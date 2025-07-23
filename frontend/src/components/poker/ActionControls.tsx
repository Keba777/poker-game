import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GameLogic } from "./GameLogic";

export function ActionControls({
  game,
  playerId,
}: {
  game: GameLogic;
  playerId: string;
}) {
  const [betAmount, setBetAmount] = useState(40);
  const isValid = (action: string, amount?: number) =>
    game.isActionValid(playerId, action, amount);

  const handleAction = (action: string, amount?: number) => {
    if (game.takeAction(playerId, action, amount)) game.completeHand();
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-2">
        <Button
          onClick={() => handleAction("fold")}
          disabled={!isValid("fold")}
        >
          Fold
        </Button>
        <Button
          onClick={() => handleAction("check")}
          disabled={!isValid("check")}
        >
          Check
        </Button>
        <Button
          onClick={() => handleAction("call")}
          disabled={!isValid("call")}
        >
          Call
        </Button>
        <Button
          onClick={() => handleAction("allin")}
          disabled={!isValid("allin")}
        >
          Allin
        </Button>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setBetAmount(Math.max(40, betAmount - 40))}>
          -
        </Button>
        <Input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          className="w-24"
        />
        <Button onClick={() => setBetAmount(betAmount + 40)}>+</Button>
        <Button
          onClick={() => handleAction("bet", betAmount)}
          disabled={!isValid("bet", betAmount)}
        >
          Bet
        </Button>
        <Button
          onClick={() => handleAction("raise", betAmount)}
          disabled={!isValid("raise", betAmount)}
        >
          Raise
        </Button>
      </div>
    </div>
  );
}
