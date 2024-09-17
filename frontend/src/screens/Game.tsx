import { Chessboard } from "../components/Chessboard";
import { Button } from "../components/Button";
import { useSocket } from "../hooks/useSocket";
import { useEffect, useState } from "react";
import { Chess} from 'chess.js';

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board()); // Corrected
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!socket) return;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
    
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board()); // Update board with the new game state
          setStarted(true);
          break;
        case MOVE:
          { const move = message.payload;
          chess.move(move); // Make the move
          setBoard(chess.board()); // Update the board after the move
          console.log("Move made");
          break; }
        case GAME_OVER:
          console.log("Game Over");
          break;
      }
    };
  }, [socket, chess]); // Added `chess` as a dependency

  if (!socket) return <div>Connecting...</div>;

  return (
    <div className="justify-center flex">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full"> {/* Corrected className */}
          <div className="col-span-4 w-full flex justify-center">
            <Chessboard chess = {chess} setBoard={setBoard} socket={socket} board={board} /> {/* Corrected the component closing */}
          </div>
          <div className="col-span-2 bg-slate-900 w-full flex justify-center">
            <div className="pt-8">
                {!started && <Button
                onClick={() => {
                    socket.send(
                    JSON.stringify({
                        type: INIT_GAME,
                    })
                    );
                }}
                >
                Play
                </Button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};