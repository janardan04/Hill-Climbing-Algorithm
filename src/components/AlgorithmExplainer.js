import React, { useState } from 'react';
import PuzzleBoard from './PuzzleBoard';
import '../styles/main.css';

const AlgorithmExplainer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Example puzzle states for explanation
  const exampleStates = [
    {
      title: "Initial State",
      puzzle: [
        [2, 8, 3],
        [1, 6, 4],
        [7, 0, 5]
      ],
      explanation: `This is our starting puzzle configuration. The goal is to reach the state where tiles are ordered 
      from 1-8 with the empty space in the bottom right. Hill climbing will help us find a path to the goal state by 
      making incremental improvements based on a heuristic function.`
    },
    {
      title: "Step 1: Evaluate Current State",
      puzzle: [
        [2, 8, 3],
        [1, 6, 4],
        [7, 0, 5]
      ],
      explanation: `First, we evaluate the current state using a heuristic function, usually the Manhattan distance. 
      This measures how far each tile is from its goal position. For this state, the Manhattan distance is 14.`
    },
    {
      title: "Step 2: Generate Neighbors",
      puzzle: [
        [2, 8, 3],
        [1, 6, 4],
        [7, 0, 5]
      ],
      explanation: `We identify all possible moves from the current state. Here, we can move a tile into the empty space:
      - Move tile 6 down
      - Move tile 7 right
      - Move tile 1 down
      Each move creates a new state that we'll evaluate.`
    },
    {
      title: "Step 3: Evaluate Neighbors",
      puzzle: [
        [2, 8, 3],
        [1, 0, 4],
        [7, 6, 5]
      ],
      explanation: `After evaluating all possible moves, moving tile 6 down gives us the best heuristic value of 12, 
      which is an improvement from 14. So we'll choose this move and continue the algorithm.`
    },
    {
      title: "Step 4: Move to Best Neighbor",
      puzzle: [
        [2, 8, 3],
        [1, 0, 4],
        [7, 6, 5]
      ],
      explanation: `We move to the state with the best heuristic value and repeat the process. From this new state, 
      we'll again evaluate all possible moves and choose the one that minimizes our heuristic function.`
    },
    {
      title: "Step 5: Repeat Until Goal or Local Optimum",
      puzzle: [
        [2, 0, 3],
        [1, 8, 4],
        [7, 6, 5]
      ],
      explanation: `We continue this process, always moving to the state with the lowest heuristic value, until we 
      either reach the goal state (heuristic value of 0) or get stuck at a local optimum where no neighbor offers 
      an improvement.`
    },
    {
      title: "Potential Problem: Local Optima",
      puzzle: [
        [1, 2, 3],
        [4, 5, 6],
        [0, 7, 8]
      ],
      explanation: `Sometimes hill climbing gets stuck in a local optimum. In this example, we're close to the goal 
      state, but the heuristic value will increase for any single move we make. This is where variations like random 
      restart or simulated annealing can help overcome local optima.`
    }
  ];

  const currentExample = exampleStates[currentStep];
  
  // For demonstration purposes, we'll define these functions here
  // In a real app, they would be imported from utils
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

  const calculateManhattanDistance = (currentState, goalState) => {
    let distance = 0;
    const goalPositions = {};

    // Create a map of tile values to their goal positions
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const value = goalState[i][j];
        if (value !== 0) {
          goalPositions[value] = { row: i, col: j };
        }
      }
    }

    // Calculate Manhattan distance for each tile
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const value = currentState[i][j];
        if (value !== 0 && goalPositions[value]) {
          const goal = goalPositions[value];
          distance += Math.abs(i - goal.row) + Math.abs(j - goal.col);
        }
      }
    }

    return distance;
  };
  
  // Generate all possible moves from the current state for visualization
  const possibleMoves = getPossibleMoves(currentExample.puzzle);
  
  // Calculate heuristic values for all possible moves
  const goalState = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];
  
  const movesWithHeuristics = possibleMoves.map(move => {
    const newState = applyMove(currentExample.puzzle, move);
    const hValue = calculateManhattanDistance(newState, goalState);
    
    return {
      ...move,
      newState,
      hValue
    };
  });
  
  // Sort by heuristic value
  movesWithHeuristics.sort((a, b) => a.hValue - b.hValue);

  return (
    <div className="algorithm-explainer">
      <div className="card mb-4 fade-in">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>{currentExample.title}</h4>
          <div>
            <span>Step {currentStep + 1} of {exampleStates.length}</span>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5 className="fade-in" style={{animationDelay: '0.1s'}}>Current Puzzle State</h5>
              <div className="d-flex justify-content-center mb-4 fade-in" style={{animationDelay: '0.2s'}}>
                <PuzzleBoard puzzle={currentExample.puzzle} />
              </div>
              
              {(currentStep === 2 || currentStep === 3) && (
                <div className="mt-4 fade-in" style={{animationDelay: '0.3s'}}>
                  <h5>Possible Moves</h5>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Move Tile</th>
                          <th>Direction</th>
                          <th>New Heuristic Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movesWithHeuristics.map((move, index) => (
                          <tr key={index} className={index === 0 ? 'table-success' : ''}>
                            <td>{move.tile}</td>
                            <td>{move.direction}</td>
                            <td>{move.hValue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <h5 className="fade-in" style={{animationDelay: '0.1s'}}>Explanation</h5>
              <p className="fade-in" style={{animationDelay: '0.2s'}}>{currentExample.explanation}</p>
              
              {currentStep === 1 && (
                <div className="card bg-light p-3 fade-in" style={{animationDelay: '0.3s'}}>
                  <h6>Manhattan Distance Calculation</h6>
                  <p>For each tile, we calculate:</p>
                  <code>|current_row - goal_row| + |current_col - goal_col|</code>
                  <p className="mt-2">For example, tile 5 should be at position (1, 2) but is at (2, 2):</p>
                  <code>|2 - 1| + |2 - 2| = 1</code>
                  <p className="mt-2">Adding all these distances gives us the total Manhattan distance.</p>
                </div>
              )}
              
              {currentStep === 6 && (
                <div className="card bg-light p-3 fade-in" style={{animationDelay: '0.3s'}}>
                  <h6>Ways to Overcome Local Optima</h6>
                  <ul>
                    <li>Random restart: Start over from different random configurations</li>
                    <li>Stochastic hill climbing: Randomly choose from moves that improve the state</li>
                    <li>Simulated annealing: Accept worse moves with decreasing probability</li>
                    <li>Use A* search algorithm instead, which guarantees optimal solution</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="d-flex justify-content-between">
            <button 
              className="btn btn-secondary fade-in" 
              style={{animationDelay: '0.4s'}}
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
            >
              Previous Step
            </button>
            <button 
              className="btn btn-primary fade-in" 
              style={{animationDelay: '0.5s'}}
              onClick={() => setCurrentStep(prev => Math.min(exampleStates.length - 1, prev + 1))}
              disabled={currentStep === exampleStates.length - 1}
            >
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmExplainer;
