import { useState } from "react";

const symbols: string[] = ["🍒", "🍋", "🔔", "💎", "7️⃣", "🍀", "⭐️"];

function getRandomSymbol(): string {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

type SymbolGrid = string[][];

export default function MainPage() {
  const [slots, setSlots] = useState<SymbolGrid>(
    Array(3)
      .fill(null)
      .map(() => Array(3).fill("❔")),
  );

  const [spinning, setSpinning] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const spin = (): void => {
    setSpinning(true);
    setMessage("");

    let intervalId: number;
    let spinCount = 0;

    intervalId = setInterval(() => {
      const newGrid: SymbolGrid = Array(3)
        .fill(null)
        .map(() =>
          Array(3)
            .fill(null)
            .map(() => getRandomSymbol()),
        );

      setSlots(newGrid);
      spinCount++;

      if (spinCount >= 15) {
        clearInterval(intervalId);
        setSpinning(false);
        checkWin(newGrid);
      }
    }, 100);
  };

  const checkWin = (grid: SymbolGrid): void => {
    const lines: string[][] = [
      ...grid,
      [0, 1, 2].map((i) => grid[i][0]),
      [0, 1, 2].map((i) => grid[i][1]),
      [0, 1, 2].map((i) => grid[i][2]),
      [grid[0][0], grid[1][1], grid[2][2]],
      [grid[0][2], grid[1][1], grid[2][0]],
    ];

    const won: boolean = lines.some((line) => line.every((s) => s === line[0]));
    setMessage(won ? "Победа!" : "Попробуй снова!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-black flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold mb-8 tracking-wide">🎰 Слот-машина</h1>

      <div className="grid grid-cols-3 gap-4 bg-gray-900 p-6 rounded-2xl shadow-2xl transition-all duration-300">
        {slots.flat().map((symbol: string, index: number) => (
          <div
            key={index}
            className="w-20 h-20 flex items-center justify-center text-4xl bg-gray-800 rounded-xl shadow-inner border border-gray-700 transition-transform duration-300 transform hover:scale-105"
          >
            <span className={`transition-opacity duration-200 ease-in`}>
              {symbol}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className={`mt-6 px-6 py-3 rounded-full text-xl font-semibold transition-all ${spinning
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg"
          }`}
      >
        {spinning ? "Крутим..." : "Крутить"}
      </button>

      {message && (
        <div className="mt-4 text-2xl font-bold animate-bounce">{message}</div>
      )}
    </div>
  );
}
