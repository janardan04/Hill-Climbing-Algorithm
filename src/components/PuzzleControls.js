import React from 'react';

const PuzzleControls = ({ puzzle, onCellChange, onGenerateRandom, onSolve, isSolving }) => {
  const handleInputChange = (event, row, col) => {
    const value = event.target.value;
    
    // Only allow numbers 0-8
    if (value === '' || (parseInt(value, 10) >= 0 && parseInt(value, 10) <= 8)) {
      onCellChange(row, col, value);
    }
  };

  return (
    <div className="puzzle-controls">
      <div className="mb-3">
        <h5>Manual Input</h5>
        <div className="manual-input">
          {puzzle.map((row, rowIndex) => (
            <div key={rowIndex} className="input-row">
              {row.map((cell, colIndex) => (
                <input
                  key={colIndex}
                  type="number"
                  min="0"
                  max="8"
                  className="form-control puzzle-input"
                  value={cell === 0 ? '' : cell}
                  onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
        <small className="text-muted">
          Enter numbers 1-8 and leave one cell empty (or 0) for the empty space.
        </small>
      </div>
      
      <div className="d-flex">
        <button 
          className="btn btn-secondary me-2"
          onClick={onGenerateRandom}
          disabled={isSolving}
        >
          Generate Random
        </button>
        <button 
          className="btn btn-primary"
          onClick={onSolve}
          disabled={isSolving}
        >
          {isSolving ? 'Solving...' : 'Solve Puzzle'}
        </button>
      </div>
    </div>
  );
};

export default PuzzleControls;