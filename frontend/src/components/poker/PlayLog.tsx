import { GameLogic } from "./GameLogic";

export function PlayLog({ game }: { game: GameLogic }) {
  const log = game.getPlayLog();
  return (
    <div className="mb-4 p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Play Log</h2>
      <ul>
        {log.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}
