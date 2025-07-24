import { useGame } from "@/context/gameContext";
import { useEffect, useState } from "react";

export function PlayLog() {
  const { game } = useGame();
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    setLog(game.getPlayLog()); // initial
    const interval = setInterval(() => {
      setLog(game.getPlayLog());
    }, 500);
    return () => clearInterval(interval);
  }, [game]);

  return (
    <div className="bg-card p-4 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-2">Playing field log</h2>
      <ul className="text-foreground">
        {log.map((entry, index) => (
          <li key={index} className="py-1">
            {entry}
          </li>
        ))}
      </ul>
    </div>
  );
}
