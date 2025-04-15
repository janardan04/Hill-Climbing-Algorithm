import React from 'react';
import '../styles/components.css';

const PuzzleBoard = ({ puzzle, onClick = null }) => {
  return (
    <div className="puzzle-board">
      {puzzle.map((row, rowIndex) => (
        <div key={rowIndex} className="puzzle-row">
          {row.map((cell, colIndex) => (
            <div 
              key={colIndex} 
              className={`puzzle-cell ${cell === 0 ? 'empty' : ''}`}
              onClick={() => onClick && onClick(rowIndex, colIndex)}
            >
              {cell !== 0 && cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PuzzleBoard;