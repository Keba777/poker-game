"use client";

import { useEffect } from "react";
import { PlayerControls } from "@/components/poker/PlayerControls";
import { PlayLog } from "@/components/poker/PlayLog";
import { HandHistory } from "@/components/poker/HandHistory";
import { ActionControls } from "@/components/poker/ActionControls";
import { GameProvider, useGame } from "@/context/gameContext";

function HomeContent() {
  const { game, currentPlayerId, setCurrentPlayerId } = useGame();

  useEffect(() => {
    if (!game.getCurrentHand()) game.startHand();
    setCurrentPlayerId(game.getCurrentHand()?.players[0].id || null);
  }, [game, setCurrentPlayerId]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-primary">Poker Game</h1>
          <PlayerControls game={game} />
          {currentPlayerId && (
            <ActionControls game={game} playerId={currentPlayerId} />
          )}
          <PlayLog />
        </div>
        <div>
          <HandHistory />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <HomeContent />
    </GameProvider>
  );
}
