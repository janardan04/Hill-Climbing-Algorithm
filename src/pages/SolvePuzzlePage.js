import React, { useState, useEffect } from 'react';
import PuzzleBoard from '../components/PuzzleBoard';
import PuzzleControls from '../components/PuzzleControls';
import StepVisualizer from '../components/StepVisualizer';
import { solvePuzzle, isSolvable } from '../utils/puzzleSolver';
import { hillClimbing, steepestAscentHillClimbing } from '../utils/hillClimbing';
import { generateRandomPuzzle } from '../utils/puzzleGenerator';

const SolvePuzzlePage = () => {
  const [puzzle, setPuzzle] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ]);
  const [goalState] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ]);
  const [solution, setSolution] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [hillClimbingType, setHillClimbingType] = useState('simple');

  const handleCellChange = (row, col, value) => {
    const newPuzzle = [...puzzle];
    newPuzzle[row][col] = value === '' ? 0 : parseInt(value, 10);
    setPuzzle(newPuzzle);
  };

  const handleGenerateRandom = () => {
    const randomPuzzle = generateRandomPuzzle();
    setPuzzle(randomPuzzle);
    setSolution([]);
    setCurrentStep(0);
    setError('');
  };

  const handleSolve = () => {
    setSolution([]);
    setCurrentStep(0);
    setError('');

    if (!isSolvable(puzzle)) {
      setError('This puzzle configuration is not solvable due to an odd number of inversions relative to the empty tile position.');
      return;
    }

    setIsSolving(true);

    setTimeout(() => {
      try {
        let result;
        if (hillClimbingType === 'simple') {
          result = hillClimbing(puzzle, goalState);
          result = result.path; // Extract path for consistency
        } else {
          result = steepestAscentHillClimbing(puzzle, goalState);
          result = result.path;
        }

        if (result.length === 0 || result[result.length - 1].hValue !== 0) {
          const lastState = result[result.length - 1].state;
          const possibleMoves = getPossibleMoves(lastState);
          const currentHValue = calculateManhattanDistance(lastState, goalState);

          const moveEvaluations = possibleMoves.map(move => {
            const newState = applyMove(lastState, move);
            return calculateManhattanDistance(newState, goalState);
          });

          const minNeighborHValue = Math.min(...moveEvaluations);

          let errorMessage = 'No solution found. The hill climbing algorithm got stuck. ';

          if (minNeighborHValue >= currentHValue) {
            errorMessage += 'Reason: Local Optimum - No neighboring state has a better heuristic value.';
          } else if (moveEvaluations.every(h => h === currentHValue)) {
            errorMessage += 'Reason: Plateau - All neighboring states have the same heuristic value.';
          } else {
            errorMessage += 'Reason: Possible ridge or visited states limit reached.';
          }

          setError(errorMessage);
          setSolution(result);
        } else {
          setSolution(result);
        }
      } catch (err) {
        setError('Error solving puzzle: ' + err.message);
      } finally {
        setIsSolving(false);
      }
    }, 100);
  };

  const handleAnimateSolution = () => {
    if (solution.length === 0) return;

    setIsAnimating(true);
    setCurrentStep(0);
  };

  useEffect(() => {
    let timer;
    if (isAnimating && currentStep < solution.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1000);
    } else if (currentStep >= solution.length - 1) {
      setIsAnimating(false);
    }

    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, solution.length]);

  // Helper functions from puzzleSolver.js
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

  // Generate possible next states for the current step
  const getPossibleNextStates = (stepIndex) => {
    if (stepIndex >= solution.length) return [];

    const currentState = solution[stepIndex].state;
    const possibleMoves = getPossibleMoves(currentState);
    const nextStates = possibleMoves.map(move => {
      const newState = applyMove(currentState, move);
      const hValue = calculateManhattanDistance(newState, goalState);
      return {
        state: newState,
        move,
        hValue,
        isSelected: solution[stepIndex + 1] && 
                    solution[stepIndex + 1].move && 
                    solution[stepIndex + 1].move.tile === move.tile && 
                    solution[stepIndex + 1].move.direction === move.direction
      };
    });

    return nextStates.sort((a, b) => a.hValue - b.hValue);
  };

  return (
    <div className="solve-puzzle-page">
      <h2 className="mb-4">Solve 8-Puzzle Problem</h2>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h4>Puzzle Configuration</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="hillClimbingType" className="form-label">Hill Climbing Type:</label>
                <select
                  id="hillClimbingType"
                  className="form-select"
                  value={hillClimbingType}
                  onChange={(e) => setHillClimbingType(e.target.value)}
                  disabled={isSolving}
                >
                  <option value="simple">Simple Hill Climbing</option>
                  <option value="steepest">Steepest Hill Climbing</option>
                </select>
              </div>

              <PuzzleControls 
                puzzle={puzzle} 
                onCellChange={handleCellChange} 
                onGenerateRandom={handleGenerateRandom}
                onSolve={handleSolve}
                isSolving={isSolving}
              />
              
              <div className="row mt-3">
                <div className="col-6 d-flex justify-content-center">
                  <div>
                    <h5>Initial State</h5>
                    <PuzzleBoard puzzle={puzzle} />
                  </div>
                </div>
                <div className="col-6 d-flex justify-content-center">
                  <div>
                    <h5>Goal State</h5>
                    <PuzzleBoard puzzle={goalState} />
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="alert alert-danger mt-3">
                  {error}
                  {error.includes('Local Optimum') && (
                    <p className="mt-2">
                      Suggestion: Try generating a new random puzzle.
                    </p>
                  )}
                  {error.includes('Plateau') && (
                    <p className="mt-2">
                      Suggestion: Stochastic hill climbing or random restarts could help escape plateaus by introducing randomness in move selection.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>Solution Steps</h4>
            </div>
            <div className="card-body">
              {solution.length > 0 ? (
                <>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Step {currentStep + 1} of {solution.length}</span>
                    <button 
                      className="btn btn-primary"
                      onClick={handleAnimateSolution}
                      disabled={isAnimating}
                    >
                      {isAnimating ? 'Animating...' : 'Animate Solution'}
                    </button>
                  </div>
                  
                  <StepVisualizer 
                    step={solution[currentStep]} 
                    totalSteps={solution.length} 
                    currentStep={currentStep}
                  />
                  
                  <div className="step-navigation mt-3">
                    <button 
                      className="btn btn-secondary"
                      disabled={currentStep === 0 || isAnimating}
                      onClick={() => setCurrentStep(prev => prev - 1)}
                    >
                      Previous
                    </button>
                    <button 
                      className="btn btn-secondary ms-2"
                      disabled={currentStep === solution.length - 1 || isAnimating}
                      onClick={() => setCurrentStep(prev => prev + 1)}
                    >
                      Next
                    </button>
                  </div>

                  {/* Possible Next States */}
                  {currentStep < solution.length - 1 && (
                    <div className="possible-states mt-4">
                      <h5>Possible Next States</h5>
                      <div className="row">
                        {getPossibleNextStates(currentStep).map((nextState, index) => (
                          <div key={index} className="col-md-6 mb-3">
                            <div className={`card ${nextState.isSelected ? 'border-primary' : ''}`}>
                              <div className="card-body">
                                <PuzzleBoard puzzle={nextState.state} />
                                <p className="mt-2 mb-0">
                                  Move: {nextState.move.tile} {nextState.move.direction}
                                </p>
                                <p className="mb-0">Heuristic Value: {nextState.hValue}</p>
                                {nextState.isSelected && (
                                  <p className="mb-0 text-primary">Selected by Algorithm</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Steps Visualization */}
                  <div className="all-steps-visualization mt-4">
                    <h5>All Solution Steps</h5>
                    <div className="steps-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {solution.map((step, index) => (
                        <div 
                          key={index} 
                          className={`step-card mb-2 p-2 ${index === currentStep ? 'bg-light' : ''}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setCurrentStep(index);
                            setIsAnimating(false);
                          }}
                        >
                          <div className="row align-items-center">
                            <div className="col-4">
                              <PuzzleBoard puzzle={step.state} />
                            </div>
                            <div className="col-8">
                              <p className="mb-0">
                                <strong>Step {index + 1}</strong>
                                {step.move ? `: Moved tile ${step.move.tile} ${step.move.direction}` : ': Initial state'}
                              </p>
                              <p className="mb-0">Heuristic: {step.hValue}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <p>Solve the puzzle to see the solution steps here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvePuzzlePage;