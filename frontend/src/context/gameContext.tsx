"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { GameLogic } from "@/components/poker/GameLogic";

interface GameContextType {
  game: GameLogic;
  currentPlayerId: string | null;
  setCurrentPlayerId: (id: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [game] = useState(() => new GameLogic());
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  return (
    <GameContext.Provider value={{ game, currentPlayerId, setCurrentPlayerId }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
