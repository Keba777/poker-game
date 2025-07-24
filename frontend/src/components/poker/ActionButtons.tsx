"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ActionButtonsProps {
  onAction: (action: string, amount?: number) => void;
  disabledActions: { [key: string]: boolean };
}

export default function ActionButtons({
  onAction,
  disabledActions,
}: ActionButtonsProps) {
  const [betAmount, setBetAmount] = useState(40);
  const [raiseAmount, setRaiseAmount] = useState(40);
  const bigBlindSize = 40;

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center">
      <Button
        variant="outline"
        onClick={() => onAction("fold")}
        disabled={disabledActions.fold}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Fold
      </Button>
      <Button
        variant="outline"
        onClick={() => onAction("check")}
        disabled={disabledActions.check}
        className="bg-gray-300 text-black hover:bg-gray-400"
      >
        Check
      </Button>
      <Button
        variant="outline"
        onClick={() => onAction("call")}
        disabled={disabledActions.call}
        className="bg-green-500 text-white hover:bg-green-600"
      >
        Call
      </Button>

      <div className="flex items-center gap-1 bg-orange-300 rounded px-2 py-1">
        <Button
          variant="ghost"
          onClick={() =>
            setBetAmount(Math.max(bigBlindSize, betAmount - bigBlindSize))
          }
        >
          -
        </Button>
        <span className="text-sm">Bet {betAmount}</span>
        <Button
          variant="ghost"
          onClick={() => setBetAmount(betAmount + bigBlindSize)}
        >
          +
        </Button>
        <Button
          onClick={() => onAction("bet", betAmount)}
          disabled={disabledActions.bet}
          className="ml-2 bg-orange-500 text-white hover:bg-orange-600"
        >
          BET {betAmount}
        </Button>
      </div>

      <div className="flex items-center gap-1 bg-orange-400 rounded px-2 py-1">
        <Button
          variant="ghost"
          onClick={() =>
            setRaiseAmount(Math.max(bigBlindSize, raiseAmount - bigBlindSize))
          }
        >
          -
        </Button>
        <span className="text-sm">Raise {raiseAmount}</span>
        <Button
          variant="ghost"
          onClick={() => setRaiseAmount(raiseAmount + bigBlindSize)}
        >
          +
        </Button>
        <Button
          onClick={() => onAction("raise", raiseAmount)}
          disabled={disabledActions.raise}
          className="ml-2 bg-orange-600 text-white hover:bg-orange-700"
        >
          RAISE {raiseAmount}
        </Button>
      </div>

      <Button
        variant="outline"
        onClick={() => onAction("allin")}
        disabled={disabledActions.allin}
        className="bg-red-500 text-white hover:bg-red-600"
      >
        ALLIN
      </Button>
    </div>
  );
}
