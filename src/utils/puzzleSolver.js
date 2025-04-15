/**
 * Utility functions for solving the 8-puzzle using hill climbing
 */

// Calculate Manhattan distance heuristic
export const calculateManhattanDistance = (currentState, goalState) => {
    let distance = 0;
    
    // Calculate the position of each number in both states
    const currentPositions = {};
    const goalPositions = {};
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentValue = currentState[i][j];
        const goalValue = goalState[i][j];
        
        if (currentValue !== 0) {
          currentPositions[currentValue] = { row: i, col: j };
        }
        
        if (goalValue !== 0) {
          goalPositions[goalValue] = { row: i, col: j };
        }
      }
    }
    
    // Calculate Manhattan distance for each tile
    for (let tile = 1; tile <= 8; tile++) {
      const current = currentPositions[tile];
      const goal = goalPositions[tile];
      
      if (current && goal) {
        distance += Math.abs(current.row - goal.row) + Math.abs(current.col - goal.col);
      }
    }
    
    return distance;
  };
  
  // Find the position of the empty space (0)
  const findEmptyPosition = (state) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (state[i][j] === 0) {
          return { row: i, col: j };
        }
      }
    }
  };
  
  // Get possible moves from current state
  const getPossibleMoves = (state) => {
    const { row, col } = findEmptyPosition(state);
    const moves = [];
    
    // Move up (tile below moves up)
    if (row < 2) {
      moves.push({
        direction: 'up',
        row: row + 1,
        col,
        tile: state[row + 1][col]
      });
    }
    
    // Move down (tile above moves down)
    if (row > 0) {
      moves.push({
        direction: 'down',
        row: row - 1,
        col,
        tile: state[row - 1][col]
      });
    }
    
    // Move left (tile to the right moves left)
    if (col < 2) {
      moves.push({
        direction: 'left',
        row,
        col: col + 1,
        tile: state[row][col + 1]
      });
    }
    
    // Move right (tile to the left moves right)
    if (col > 0) {
      moves.push({
        direction: 'right',
        row,
        col: col - 1,
        tile: state[row][col - 1]
      });
    }
    
    return moves;
  };
  
  // Apply a move to the current state
  const applyMove = (state, move) => {
    const newState = state.map(row => [...row]);
    const emptyPos = findEmptyPosition(newState);
    
    // Swap the empty space with the moving tile
    newState[emptyPos.row][emptyPos.col] = newState[move.row][move.col];
    newState[move.row][move.col] = 0;
    
    return newState;
  };
  
  // Convert state to string for comparison
  const stateToString = (state) => {
    return state.flat().join('');
  };
  
  // Check if two states are equal
  const areStatesEqual = (state1, state2) => {
    return stateToString(state1) === stateToString(state2);
  };
  
  // Check if the puzzle is solvable
  export const isSolvable = (puzzle) => {
    // Flatten the puzzle
    const flatPuzzle = puzzle.flat();
    
    // Count inversions
    let inversions = 0;
    for (let i = 0; i < flatPuzzle.length - 1; i++) {
      if (flatPuzzle[i] === 0) continue;
      
      for (let j = i + 1; j < flatPuzzle.length; j++) {
        if (flatPuzzle[j] === 0) continue;
        
        if (flatPuzzle[i] > flatPuzzle[j]) {
          inversions++;
        }
      }
    }
    
    // Find the row of the empty tile from the bottom
    const emptyRow = 3 - Math.floor(flatPuzzle.indexOf(0) / 3);
    
    // If grid width is odd, puzzle is solvable if inversions is even
    // If grid width is even, puzzle is solvable if:
    //   - the empty tile is on an even row from the bottom and inversions is odd, or
    //   - the empty tile is on an odd row from the bottom and inversions is even
    return (emptyRow % 2 === 0) ? (inversions % 2 === 1) : (inversions % 2 === 0);
  };
  
  // Hill climbing algorithm for 8-puzzle
  export const solvePuzzle = (initialState, goalState) => {
    // Check if already at goal state
    if (areStatesEqual(initialState, goalState)) {
      return [{
        state: initialState,
        move: null,
        hValue: 0,
        gValue: 0,
        fValue: 0
      }];
    }
    
    let currentState = initialState.map(row => [...row]);
    let path = [{
      state: currentState,
      move: null,
      hValue: calculateManhattanDistance(currentState, goalState),
      gValue: 0,
      fValue: calculateManhattanDistance(currentState, goalState)
    }];
    
    const visitedStates = new Set();
    visitedStates.add(stateToString(currentState));
    
    let maxIterations = 1000; // Safety to prevent infinite loops
    let iterations = 0;
    
    while (iterations < maxIterations) {
      iterations++;
      
      // Get possible moves
      const possibleMoves = getPossibleMoves(currentState);
      
      // Evaluate each move
      const evaluatedMoves = [];
      for (const move of possibleMoves) {
        const newState = applyMove(currentState, move);
        const stateString = stateToString(newState);
        
        // Skip if we've visited this state
        if (visitedStates.has(stateString)) {
          continue;
        }
        
        const hValue = calculateManhattanDistance(newState, goalState);
        const gValue = path.length;
        const fValue = hValue + gValue; // Total cost (f = g + h)
        
        evaluatedMoves.push({
          move,
          state: newState,
          hValue,
          gValue,
          fValue
        });
      }
      
      // If no moves are possible, we're stuck
      if (evaluatedMoves.length === 0) {
        return path;
      }
      
      // Sort by f-value, then h-value (ascending)
      evaluatedMoves.sort((a, b) => {
        if (a.fValue !== b.fValue) {
          return a.fValue - b.fValue;
        }
        return a.hValue - b.hValue;
      });
      
      // Choose the best move
      const bestMove = evaluatedMoves[0];
      
      // If the current state is better or equal to the best move, we're at a local optimum
      const currentHValue = calculateManhattanDistance(currentState, goalState);
      if (bestMove.hValue >= currentHValue) {
        // Try to escape the local optimum by picking a different move
        if (evaluatedMoves.length > 1) {
          const alternativeMove = evaluatedMoves[1];
          currentState = alternativeMove.state;
          path.push(alternativeMove);
          visitedStates.add(stateToString(alternativeMove.state));
        } else {
          // No way to escape, return the path so far
          return path;
        }
      } else {
        // Move to the better state
        currentState = bestMove.state;
        path.push(bestMove);
        visitedStates.add(stateToString(bestMove.state));
      }
      
      // Check if we've reached the goal
      if (areStatesEqual(currentState, goalState)) {
        return path;
      }
    }
    
    // Return the path so far if we hit the iteration limit
    return path;
  };