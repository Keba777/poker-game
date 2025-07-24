import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GameLogic } from "./GameLogic";

export function PlayerControls({ game }: { game: GameLogic }) {
  const [stackInput, setStackInput] = useState("10000"); // Match wireframe default
  const players = game.getCurrentHand()?.players || [];

  const handleReset = () => {
    game.startHand();
  };

  const handleApply = () => {
    const stack = Number(stackInput);
    if (!isNaN(stack)) {
      players.forEach((p) => (p.stack = stack));
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg">Stacks</h2>
        <Input
          type="number"
          value={stackInput}
          onChange={(e) => setStackInput(e.target.value)}
          className="w-24"
        />
        <Button
          onClick={handleApply}
          className="bg-blue-400 text-white hover:bg-blue-500"
        >
          Apply
        </Button>
        <Button
          onClick={handleReset}
          className="bg-green-400 text-white hover:bg-green-500"
        >
          {game.getHasStarted() ? "Reset" : "Start"}
        </Button>
      </div>
      <div className="space-y-2">
        {players.map((p) => (
          <div key={p.id} className="flex items-center gap-2">
            <span>
              Player {p.id.slice(0, 4)}: {p.stack}
            </span>
            {p.isDealer && <span className="text-yellow-500">Dealer</span>}
            {p.isSmallBlind && <span className="text-purple-500">SB</span>}
            {p.isBigBlind && <span className="text-red-500">BB</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
