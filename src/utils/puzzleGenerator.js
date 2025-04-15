import { isSolvable } from './puzzleSolver';

/**
 * Generate a random solvable 8-puzzle
 */
export const generateRandomPuzzle = () => {
  let puzzle;
  let isSolvablePuzzle = false;
  
  while (!isSolvablePuzzle) {
    // Create an array of tiles 0-8
    const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
    // Shuffle the array
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    
    // Convert to 2D array
    puzzle = [
      [tiles[0], tiles[1], tiles[2]],
      [tiles[3], tiles[4], tiles[5]],
      [tiles[6], tiles[7], tiles[8]]
    ];
    
    // Check if the puzzle is solvable
    isSolvablePuzzle = isSolvable(puzzle);
  }
  
  return puzzle;
};

/**
 * Generate a puzzle that's a specific number of moves away from solved
 * @param {number} difficulty - Number of random moves to make from solved state
 */
export const generatePuzzleByDifficulty = (difficulty = 10) => {
  // Start with the goal state
  const puzzle = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];
  
  // Find the position of the empty tile
  let emptyRow = 2;
  let emptyCol = 2;
  
  // Make a series of random moves
  for (let i = 0; i < difficulty; i++) {
    // Get possible moves
    const possibleMoves = [];
    
    // Check up
    if (emptyRow > 0) {
      possibleMoves.push({ row: emptyRow - 1, col: emptyCol });
    }
    
    // Check down
    if (emptyRow < 2) {
      possibleMoves.push({ row: emptyRow + 1, col: emptyCol });
    }
    
    // Check left
    if (emptyCol > 0) {
      possibleMoves.push({ row: emptyRow, col: emptyCol - 1 });
    }
    
    // Check right
    if (emptyCol < 2) {
      possibleMoves.push({ row: emptyRow, col: emptyCol + 1 });
    }
    
    // Pick a random move
    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    
    // Apply the move
    puzzle[emptyRow][emptyCol] = puzzle[randomMove.row][randomMove.col];
    puzzle[randomMove.row][randomMove.col] = 0;
    
    // Update empty position
    emptyRow = randomMove.row;
    emptyCol = randomMove.col;
  }
  
  return puzzle;
};