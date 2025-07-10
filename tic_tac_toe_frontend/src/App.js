import React, { useState, useEffect } from "react";
import "./App.css";

// No in-app color palette; all colors/fonts set via retro theme CSS.

const initialBoard = Array(9).fill(null);

// Helper function to check winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main UI and logic for the Tic Tac Toe App (retro themed).
   * - 2-player local gameplay
   * - Interactive board
   * - Game over & announcement
   * - Game reset
   * - Responsive, retro UI
   */
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [isTie, setIsTie] = useState(false);

  // Reset state on new game
  // PUBLIC_INTERFACE
  const handleReset = () => {
    setBoard(initialBoard);
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
    setIsTie(false);
    setHistory([]);
  };

  // Cell click handler
  // PUBLIC_INTERFACE
  const handleClick = idx => {
    if (board[idx] || gameOver) return;

    const newBoard = [...board];
    newBoard[idx] = xIsNext ? "X" : "O";
    setBoard(newBoard);
    setHistory([...history, board]);
    setXIsNext(!xIsNext);

    const currentWinner = calculateWinner(newBoard);
    if (currentWinner) {
      setWinner(currentWinner);
      setGameOver(true);
      setScore(s => ({
        ...s,
        [currentWinner]: s[currentWinner] + 1
      }));
      setIsTie(false);
    } else if (newBoard.every(Boolean)) {
      // All filled, no winner: tie.
      setGameOver(true);
      setWinner(null);
      setIsTie(true);
    }
  };

  // Keyboard accessibility (Enter/Space triggers click)
  // PUBLIC_INTERFACE
  const handleCellKeyDown = (e, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick(idx);
    }
  };

  // Accessibility: Announce winner/tie
  useEffect(() => {
    if (gameOver) {
      if (winner) {
        // eslint-disable-next-line
        document.title = `Winner: ${winner}! | Tic Tac Toe`;
      } else if (isTie) {
        // eslint-disable-next-line
        document.title = "It’s a tie! | Tic Tac Toe";
      }
    } else {
      document.title = "Tic Tac Toe";
    }
  }, [gameOver, winner, isTie]);

  // PUBLIC_INTERFACE
  const renderCell = idx => (
    <button
      className="ttt-cell"
      data-testid={`cell-${idx}`}
      onClick={() => handleClick(idx)}
      onKeyDown={e => handleCellKeyDown(e, idx)}
      aria-label={`Cell ${idx + 1}, ${board[idx] ? board[idx] : "empty"}`}
      tabIndex={0}
      disabled={!!board[idx] || gameOver}
    >
      {board[idx]}
    </button>
  );

  // PUBLIC_INTERFACE
  function GameOverBanner() {
    if (!gameOver) return null;
    return (
      <div className="ttt-gameover" data-testid="gameover-announcement">
        {winner ? (
          <span>
            Winner:
            <strong className={winner === "X" ? "score-x" : "score-o"}>
              {" "}
              Player {winner}
            </strong>
            !
          </span>
        ) : (
          <span style={{ fontWeight: 700 }}>
            It&apos;s a tie!
          </span>
        )}
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function Scoreboard() {
    // Add a retro underline (box-shadow) to show turn
    return (
      <div className="ttt-scoreboard" aria-label="Scoreboard">
        <div
          className={`score score-x${xIsNext && !gameOver ? " active" : ""}`}
          style={
            xIsNext && !gameOver
              ? { boxShadow: "0 0 2px 2px #fd5cd2, 2px 2px 0 #fff" }
              : {}
          }
        >
          Player X
          <span className="score-value">{score.X}</span>
        </div>
        <div
          className={`score score-o${!xIsNext && !gameOver ? " active" : ""}`}
          style={
            !xIsNext && !gameOver
              ? { boxShadow: "0 0 2px 2px #a6ff00, 2px 2px 0 #fff" }
              : {}
          }
        >
          Player O
          <span className="score-value">{score.O}</span>
        </div>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function Controls() {
    return (
      <div className="ttt-controls">
        <button className="ttt-btn" onClick={handleReset}>
          Reset Game
        </button>
      </div>
    );
  }

  return (
    <main className="app-wrapper">
      <div className="game-container">
        <h1 className="ttt-title">
          TIC TAC TOE
        </h1>
        <Scoreboard />
        <section className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
          {board.map((_, idx) => (
            <div role="gridcell" className="ttt-cell-wrapper" key={idx}>
              {renderCell(idx)}
            </div>
          ))}
        </section>
        <GameOverBanner />
        <Controls />
      </div>
      <footer className="ttt-footer">
        <span>
          <a
            href="https://react.dev/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            React
          </a>{" "}
          Tic Tac Toe &middot; {new Date().getFullYear()}
        </span>
      </footer>
    </main>
  );
}

export default App;
