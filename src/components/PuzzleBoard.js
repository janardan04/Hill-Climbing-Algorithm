"use client"
import "../styles/puzzle-board.css"

const PuzzleBoard = ({ puzzle, onClick = null, isGoalState = false }) => {
  return (
    <div className={`puzzle-board ${isGoalState ? "goal-state" : ""}`}>
      {puzzle.map((row, rowIndex) => (
        <div key={rowIndex} className="puzzle-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`puzzle-cell ${cell === 0 ? "empty" : ""}`}
              onClick={() => onClick && onClick(rowIndex, colIndex)}
              style={{
                animationDelay: `${(rowIndex * 3 + colIndex) * 0.05}s`,
              }}
            >
              {cell !== 0 && cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default PuzzleBoard
