"use client";

import { useEffect, useState } from "react";
import ActionButtons from "./ActionButtons";
import { GameLogic } from "./GameLogic";

interface ActionControlsProps {
  game: GameLogic;
  playerId: string;
}

export function ActionControls({ game, playerId }: ActionControlsProps) {
  const [disabledActions, setDisabledActions] = useState({
    fold: false,
    check: true,
    call: true,
    bet: true,
    raise: true,
    allin: false,
  });

  useEffect(() => {
    updateDisabledActions();
  }, [game.getCurrentHand(), game.getVersion(), playerId]); // Add getVersion()

  const updateDisabledActions = () => {
    if (!game.getCurrentHand()) return;
    setDisabledActions({
      fold: false,
      check: !game.isActionValid(playerId, "check"),
      call: !game.isActionValid(playerId, "call"),
      bet: !game.isActionValid(playerId, "bet"),
      raise: !game.isActionValid(playerId, "raise"),
      allin: false,
    });
  };

  const handleAction = (action: string, amount?: number) => {
    if (game.takeAction(playerId, action, amount)) {
      updateDisabledActions();
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <ActionButtons
        onAction={handleAction}
        disabledActions={disabledActions}
      />
    </div>
  );
}
