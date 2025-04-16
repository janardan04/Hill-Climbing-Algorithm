/**
 * Utility functions for solving the 8-puzzle using hill climbing
 */

export const calculateManhattanDistance = (currentState, goalState) => {
  let distance = 0;
  
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
  
  for (let tile = 1; tile <= 8; tile++) {
    const current = currentPositions[tile];
    const goal = goalPositions[tile];
    
    if (current && goal) {
      distance += Math.abs(current.row - goal.row) + Math.abs(current.col - goal.col);
    }
  }
  
  return distance;
};

const findEmptyPosition = (state) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (state[i][j] === 0) {
        return { row: i, col: j };
      }
    }
  }
};

const getPossibleMoves = (state) => {
  const { row, col } = findEmptyPosition(state);
  const moves = [];
  
  if (row < 2) {
    moves.push({
      direction: 'up',
      row: row + 1,
      col,
      tile: state[row + 1][col]
    });
  }
  
  if (row > 0) {
    moves.push({
      direction: 'down',
      row: row - 1,
      col,
      tile: state[row - 1][col]
    });
  }
  
  if (col < 2) {
    moves.push({
      direction: 'left',
      row,
      col: col + 1,
      tile: state[row][col + 1]
    });
  }
  
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

const applyMove = (state, move) => {
  const newState = state.map(row => [...row]);
  const emptyPos = findEmptyPosition(newState);
  
  newState[emptyPos.row][emptyPos.col] = newState[move.row][move.col];
  newState[move.row][move.col] = 0;
  
  return newState;
};

const stateToString = (state) => {
  return state.flat().join('');
};

export const areStatesEqual = (state1, state2) => {
  return stateToString(state1) === stateToString(state2);
};

export const isSolvable = (puzzle) => {
  const flatPuzzle = puzzle.flat();
  
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
  
  const emptyRow = 3 - Math.floor(flatPuzzle.indexOf(0) / 3);
  
  return (emptyRow % 2 === 0) ? (inversions % 2 === 1) : (inversions % 2 === 0);
};

export const solvePuzzle = (initialState, goalState) => {
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
  
  let maxIterations = 1000;
  let iterations = 0;
  
  while (iterations < maxIterations) {
    iterations++;
    
    const possibleMoves = getPossibleMoves(currentState);
    
    const evaluatedMoves = [];
    for (const move of possibleMoves) {
      const newState = applyMove(currentState, move);
      const stateString = stateToString(newState);
      
      if (visitedStates.has(stateString)) {
        continue;
      }
      
      const hValue = calculateManhattanDistance(newState, goalState);
      const gValue = path.length;
      const fValue = hValue + gValue;
      
      evaluatedMoves.push({
        move,
        state: newState,
        hValue,
        gValue,
        fValue
      });
    }
    
    if (evaluatedMoves.length === 0) {
      return path;
    }
    
    evaluatedMoves.sort((a, b) => {
      if (a.fValue !== b.fValue) {
        return a.fValue - b.fValue;
      }
      return a.hValue - b.hValue;
    });
    
    const bestMove = evaluatedMoves[0];
    
    const currentHValue = calculateManhattanDistance(currentState, goalState);
    if (bestMove.hValue >= currentHValue) {
      if (evaluatedMoves.length > 1) {
        const alternativeMove = evaluatedMoves[1];
        currentState = alternativeMove.state;
        path.push(alternativeMove);
        visitedStates.add(stateToString(alternativeMove.state));
      } else {
        return path;
      }
    } else {
      currentState = bestMove.state;
      path.push(bestMove);
      visitedStates.add(stateToString(bestMove.state));
    }
    
    if (areStatesEqual(currentState, goalState)) {
      return path;
    }
  }
  
  return path;
};