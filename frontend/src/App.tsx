import { useEffect, useState, type JSX } from "react";
import { redDisc, yellowDisc } from "../constants/svg";
import { socket } from "./socket";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { LoaderIcon } from "lucide-react";

const GRID: any = [
  [0, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, 31, 32, 33, 34],
  [35, 36, 37, 38, 39, 40, 41],
];

function App() {
  const [gameState, setGameState] = useState<any>(GRID);
  const [currentPlayer, setCurrentPlayer] = useState("yellow");
  const [finishedState, setFinishedState] = useState("");
  const [finishedArrayState, setFinishedArrayState] = useState<number[]>([]);
  const [startGame, setStartGame] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [playingAs, setPlayingAs] = useState("");
  const [icon, setIcon] = useState<JSX.Element | null>(null);

  useEffect(() => {
    function onConnect() {
      setStartGame(true);
    }

    function onDisconnect() {
      setStartGame(false);
    }

    socket.on("connect", onConnect);

    socket.on("opponentNotFound", () => {
      setOpponentName("");
    });

    socket.on("opponentFound", (data) => {
      setPlayingAs(data.playingAs);
      setOpponentName(data.opponentName);
    });

    socket.on("playerMoveFromServer", (data) => {
      const id = data.state.id;

      setGameState((prev: any) => {
        const finalState = [...prev];
        const rowIndex = Math.floor(id / 7);
        const colIndex = id % 7;
        finalState[rowIndex][colIndex] = data.state.sign;
        return finalState;
      });
      setCurrentPlayer(data.state.sign === "red" ? "yellow" : "red");
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const onStart = () => {
    if (!playerName) return;

    socket.connect();

    socket.emit("request_to_play", {
      playerName: playerName,
    });
  };

  const onClickGrid = (id: any) => {
    if (currentPlayer !== playingAs) return;
    if (finishedState) return;
    if (!icon) {
      if (currentPlayer === "red") {
        setIcon(redDisc);
      }
      if (currentPlayer === "yellow") {
        setIcon(yellowDisc);
      }

      socket.emit("playerMoveFromClient", {
        state: {
          id,
          sign: currentPlayer,
        },
      });

      setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red");

      setGameState((prev: any) => {
        const finalState = [...prev];
        const rowIndex = Math.floor(id / 7);
        const colIndex = id % 7;
        finalState[rowIndex][colIndex] = currentPlayer;
        return finalState;
      });
      setIcon(null);
    }
  };

  const checkWinner = () => {
    const rows = 6;
    const cols = 7;

    // Check horizontally
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        if (
          gameState[r][c] === gameState[r][c + 1] &&
          gameState[r][c + 1] === gameState[r][c + 2] &&
          gameState[r][c + 2] === gameState[r][c + 3]
        ) {
          setFinishedArrayState([
            r * 6 + c,
            r * 6 + c + 1,
            r * 6 + c + 2,
            r * 6 + c + 3,
          ]);
          return gameState[r][c];
        }
      }
    }

    // Check vertically
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 0; c < cols; c++) {
        if (
          gameState[r][c] === gameState[r + 1][c] &&
          gameState[r + 1][c] === gameState[r + 2][c] &&
          gameState[r + 2][c] === gameState[r + 3][c]
        ) {
          setFinishedArrayState([
            r * 7 + c,
            (r + 1) * 7 + c,
            (r + 2) * 7 + c,
            (r + 3) * 7 + c,
          ]);
          return gameState[r][c];
        }
      }
    }

    // Check diagonally (bottom-left to top-right)
    for (let r = 3; r < rows; r++) {
      for (let c = 0; c < cols - 4; c++) {
        if (
          gameState[r][c] === gameState[r - 1][c + 1] &&
          gameState[r - 1][c + 1] === gameState[r - 2][c + 2] &&
          gameState[r - 2][c + 2] === gameState[r - 3][c + 3]
        ) {
          setFinishedArrayState([
            r * 7 + c,
            (r - 1) * 7 + (c + 1),
            (r - 2) * 7 + (c + 2),
            (r - 3) * 7 + (c + 2),
          ]);
          return gameState[r][c];
        }
      }
    }

    // Check diagonally (top-left to bottom-right)
    for (let r = 0; r <= rows - 4; r++) {
      for (let c = 0; c <= cols - 4; c++) {
        if (
          gameState[r][c] === gameState[r + 1][c + 1] &&
          gameState[r + 1][c + 1] === gameState[r + 2][c + 2] &&
          gameState[r + 2][c + 2] === gameState[r + 3][c + 3]
        ) {
          setFinishedArrayState([
            r * 7 + c,
            (r + 1) * 7 + (c + 1),
            (r + 2) * 7 + (c + 2),
            (r + 3) * 7 + (c + 3),
          ]);
          return gameState[r][c];
        }
      }
    }

    const isDraw = gameState.flat().every((e: any) => {
      if (e === "red" || e === "yellow") {
        return true;
      }
    });

    if (isDraw) return "draw";
  };

  useEffect(() => {
    const winner = checkWinner();
    if (winner === "red" || winner === "yellow") {
      setFinishedState(winner);
      return;
    }

    if (winner === "draw") setFinishedState("draw");
  }, [gameState]);

  if (!startGame) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Play</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="John Doe"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={onStart}>Start</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (startGame && !opponentName) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4 text-3xl">
        Waiting for opponent...
        <LoaderIcon
          role="status"
          aria-label="Loading"
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        {/* Grid */}
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-7 gap-2 p-6 bg-slate-900/50 rounded-xl">
            {gameState.map((grid: any, rowIndex: number) =>
              grid.map((el: any, colIndex: number) => (
                <div
                  onClick={() => onClickGrid(rowIndex * 7 + colIndex)}
                  key={rowIndex * 7 + colIndex}
                  className={`w-16 h-16 rounded-lg transition-all duration-300  border-2 flex items-center justify-center text-xs font-mono ${
                    finishedState
                      ? "cursor-not-allowed"
                      : "hover:cursor-pointer"
                  } ${
                    currentPlayer !== playingAs ? "cursor-not-allowed" : ""
                  } ${
                    finishedArrayState.includes(rowIndex * 7 + colIndex)
                      ? finishedState === "yellow"
                        ? "bg-[#DD7F9F]"
                        : "bg-[#3FA7F0]"
                      : ""
                  }`}
                >
                  {el === "red" ? redDisc : el === "yellow" ? yellowDisc : icon}
                </div>
              ))
            )}
          </div>
        </div>
        {finishedState && finishedState === "draw" && (
          <div className="">Draw</div>
        )}
        {finishedState && finishedState !== "draw" && (
          <div className="">{finishedState} won the game</div>
        )}
        {!finishedState && opponentName && opponentName !== "" && (
          <div className="">Opponent {opponentName}</div>
        )}
      </div>
    </div>
  );
}

export default App;
