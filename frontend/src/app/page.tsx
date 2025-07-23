"use client";

import { useState, useEffect } from "react";
import { PlayerControls } from "@/components/poker/PlayerControls";
import { ActionControls } from "@/components/poker/ActionControls";
import { PlayLog } from "@/components/poker/PlayLog";
import { HandHistory } from "@/components/poker/HandHistory";
import { GameLogic } from "@/components/poker/GameLogic";

export default function Home() {
  const [game] = useState(
    () =>
      new GameLogic([
        { id: "1", stack: 1000, position: 0 },
        { id: "2", stack: 1000, position: 1 },
      ])
  );
  const [currentPlayerId, _] = useState("1");

  useEffect(() => {
    if (!game.getCurrentHand()) game.startHand();
  }, [game]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Poker Game</h1>
      <PlayerControls game={game} />
      <ActionControls game={game} playerId={currentPlayerId} />
      <PlayLog game={game} />
      <HandHistory />
    </div>
  );
}
