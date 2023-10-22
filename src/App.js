import { useState } from 'react';

function Square({ value, onSquareClick, isWinnerSquare }) {
  return (
    <button className={`square ${isWinnerSquare ? 'winner' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}


function Board({ xIsNext, squares, onPlay }) {
  function renderSquare(i) {
    const isWinnerSquare = winningSquares.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinnerSquare={isWinnerSquare}
      />
    );
  }

  function handleClick(i) {
    const { winner } = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const { winner, winningSquares } = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (squares.every((square) => square !== null)) {
    status = 'It\'s a draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      rowSquares.push(renderSquare(squareIndex));
    }
    boardRows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}


export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascendingOrder, setAscendingOrder] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function calculateRowCol(index) {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    return `(row ${row}, col ${col})`;
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const prevSquares = history[move - 1];
      const movedIndex = squares.findIndex((square, index) => square !== prevSquares[index]);
      const moveLocation = calculateRowCol(movedIndex);
      description = `Go to move #${move} ${moveLocation}`;
      move === currentMove? description = `You are at move #${move} ${moveLocation}` : null;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove ? description : <button onClick={() => jumpTo(move)}>{description}</button>}
      </li>
    );
  });

  function toggleOrder() {
    setAscendingOrder(!ascendingOrder);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div>
          <button onClick={toggleOrder}>
            Toggle Order ({ascendingOrder ? 'Ascending' : 'Descending'})
          </button>
        </div>
        <ol>{ascendingOrder ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningSquares: lines[i] };
    }
  }
  return { winner: null, winningSquares: [] };
}