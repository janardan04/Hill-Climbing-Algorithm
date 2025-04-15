/**
 * Implementation of the Hill Climbing algorithm for the 8-puzzle problem
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
  
  // Calculate the number of misplaced tiles
  export const calculateMisplacedTiles = (currentState, goalState) => {
    let misplaced = 0;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // Skip the empty space
        if (currentState[i][j] !== 0 && currentState[i][j] !== goalState[i][j]) {
          misplaced++;
        }
      }
    }
    
    return misplaced;
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
  export const getPossibleMoves = (state) => {
    const { row, col } = findEmptyPosition(state);
    const moves = [];
    
    // Define possible directions
    const directions = [
      { dr: -1, dc: 0, name: 'up' },    // Move empty space up (tile below moves up)
      { dr: 1, dc: 0, name: 'down' },   // Move empty space down (tile above moves down)
      { dr: 0, dc: -1, name: 'left' },  // Move empty space left (tile to right moves left)
      { dr: 0, dc: 1, name: 'right' }   // Move empty space right (tile to left moves right)
    ];
    
    for (const dir of directions) {
      const newRow = row + dir.dr;
      const newCol = col + dir.dc;
      
      // Check if the new position is valid
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        moves.push({
          direction: dir.name,
          row: newRow,
          col: newCol,
          tile: state[newRow][newCol]
        });
      }
    }
    
    return moves;
  };
  
  // Apply a move to the current state
  export const applyMove = (state, move) => {
    const newState = state.map(row => [...row]);
    const emptyPos = findEmptyPosition(newState);
    
    // Swap the empty space with the moving tile
    newState[emptyPos.row][emptyPos.col] = newState[move.row][move.col];
    newState[move.row][move.col] = 0;
    
    return newState;
  };
  
  // Hill climbing algorithm implementation
  export const hillClimbing = (initialState, goalState, heuristicFunction = calculateManhattanDistance) => {
    let currentState = initialState.map(row => [...row]);
    let currentHValue = heuristicFunction(currentState, goalState);
    
    const path = [{
      state: currentState,
      move: null,
      hValue: currentHValue,
      gValue: 0,
      fValue: currentHValue
    }];
    
    const maxIterations = 1000; // Prevent infinite loops
    let iterations = 0;
    
    // Set to keep track of visited states
    const visitedStates = new Set();
    visitedStates.add(JSON.stringify(currentState));
    
    while (iterations < maxIterations) {
      iterations++;
      
      // Get all possible moves
      const possibleMoves = getPossibleMoves(currentState);
      
      let bestMove = null;
      let bestState = null;
      let bestHValue = Infinity;
      
      // Evaluate each move
      for (const move of possibleMoves) {
        const newState = applyMove(currentState, move);
        const stateString = JSON.stringify(newState);
        
        // Skip if we've already visited this state
        if (visitedStates.has(stateString)) {
          continue;
        }
        
        const hValue = heuristicFunction(newState, goalState);
        
        // If this state is better than our current best
        if (hValue < bestHValue) {
          bestMove = move;
          bestState = newState;
          bestHValue = hValue;
        }
      }
      
      // If no better move is found or all states have been visited, we're at a local optimum
      if (!bestMove || bestHValue >= currentHValue) {
        return {
          path,
          solution: false,
          message: "Stuck in local optimum"
        };
      }
      
      // Move to the better state
      currentState = bestState;
      currentHValue = bestHValue;
      
      // Add to path and mark as visited
      path.push({
        state: currentState,
        move: bestMove,
        hValue: currentHValue,
        gValue: path.length, // g is the number of steps from start
        fValue: currentHValue + path.length // f = g + h
      });
      visitedStates.add(JSON.stringify(currentState));
      
      // Check if we've reached the goal
      if (currentHValue === 0) {
        return {
          path,
          solution: true,
          message: "Solution found"
        };
      }
    }
    
    // If we've reached the maximum iterations, return what we have
    return {
      path,
      solution: false,
      message: "Maximum iterations reached"
    };
  };
  
  // Steepest Ascent Hill Climbing (always chooses the best move)
  export const steepestAscentHillClimbing = (initialState, goalState) => {
    return hillClimbing(initialState, goalState, calculateManhattanDistance);
  };
  
  // Stochastic Hill Climbing (randomly selects among better moves)
  export const stochasticHillClimbing = (initialState, goalState) => {
    let currentState = initialState.map(row => [...row]);
    let currentHValue = calculateManhattanDistance(currentState, goalState);
    
    const path = [{
      state: currentState,
      move: null,
      hValue: currentHValue,
      gValue: 0,
      fValue: currentHValue
    }];
    
    const maxIterations = 1000;
    let iterations = 0;
    
    const visitedStates = new Set();
    visitedStates.add(JSON.stringify(currentState));
    
    while (iterations < maxIterations) {
      iterations++;
      
      const possibleMoves = getPossibleMoves(currentState);
      const betterMoves = [];
      
      // Find moves that improve the current state
      for (const move of possibleMoves) {
        const newState = applyMove(currentState, move);
        const stateString = JSON.stringify(newState);
        
        if (visitedStates.has(stateString)) {
          continue;
        }
        
        const hValue = calculateManhattanDistance(newState, goalState);
        
        if (hValue < currentHValue) {
          betterMoves.push({
            move,
            state: newState,
            hValue
          });
        }
      }
      
      // If no better moves, we're stuck
      if (betterMoves.length === 0) {
        return {
          path,
          solution: false,
          message: "Stuck in local optimum"
        };
      }
      
      // Randomly select one of the better moves
      const selectedMove = betterMoves[Math.floor(Math.random() * betterMoves.length)];
      
      currentState = selectedMove.state;
      currentHValue = selectedMove.hValue;
      
      path.push({
        state: currentState,
        move: selectedMove.move,
        hValue: currentHValue,
        gValue: path.length,
        fValue: currentHValue + path.length
      });
      visitedStates.add(JSON.stringify(currentState));
      
      if (currentHValue === 0) {
        return {
          path,
          solution: true,
          message: "Solution found"
        };
      }
    }
    
    return {
      path,
      solution: false,
      message: "Maximum iterations reached"
    };
  };
  
  // Random Restart Hill Climbing
  export const randomRestartHillClimbing = (initialState, goalState, maxRestarts = 5) => {
    let bestPath = null;
    let bestResult = null;
    
    for (let i = 0; i < maxRestarts; i++) {
      const result = hillClimbing(initialState, goalState);
      
      // If we found a solution, return it
      if (result.solution) {
        return result;
      }
      
      // Otherwise, keep track of the best partial solution
      if (!bestPath || result.path.length > bestPath.length) {
        bestPath = result.path;
        bestResult = result;
      }
    }
    
    // If no solution is found after all restarts, return the best partial solution
    return bestResult;
  };
