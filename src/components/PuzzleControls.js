"use client"
import "../styles/puzzle-controls.css"

const PuzzleControls = ({ puzzle, onCellChange, onGenerateRandom, onSolve, isSolving }) => {
  const handleInputChange = (event, row, col) => {
    const value = event.target.value

    // Only allow numbers 0-8
    if (value === "" || (Number.parseInt(value, 10) >= 0 && Number.parseInt(value, 10) <= 8)) {
      onCellChange(row, col, value)
    }
  }

  return (
    <div className="puzzle-controls">
      <div className="mb-3">
        <h5 className="fade-in">Manual Input</h5>
        <div className="manual-input">
          {puzzle.map((row, rowIndex) => (
            <div key={rowIndex} className="input-row">
              {row.map((cell, colIndex) => (
                <input
                  key={colIndex}
                  type="number"
                  min="0"
                  max="8"
                  className="form-control puzzle-input fade-in"
                  style={{ animationDelay: `${(rowIndex * 3 + colIndex) * 0.05}s` }}
                  value={cell === 0 ? "" : cell}
                  onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
        <small className="text-muted fade-in" style={{ animationDelay: "0.3s" }}>
          Enter numbers 1-8 and leave one cell empty (or 0) for the empty space.
        </small>
      </div>

      <div className="btn-container">
        <button
          className="btn btn-secondary fade-in"
          style={{ animationDelay: "0.4s" }}
          onClick={onGenerateRandom}
          disabled={isSolving}
        >
          Generate Random
        </button>
        <button className="btn btn-primary" onClick={onSolve} disabled={isSolving}>
          {isSolving ? "Solving..." : "Solve"}
        </button>
      </div>
    </div>
  )
}

export default PuzzleControls
