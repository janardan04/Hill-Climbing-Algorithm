"use client"
import { useState, useEffect } from "react"
import PuzzleBoard from "../components/PuzzleBoard"
import PuzzleControls from "../components/PuzzleControls"
import StepVisualizer from "../components/StepVisualizer"
import { hillClimbing } from "../utils/hillClimbing"
import { generateRandomPuzzle } from "../utils/puzzleGenerator"
import { calculateManhattanDistance, getPossibleMoves, applyMove, findEmptyPosition } from "../utils/hillClimbing"
import { areStatesEqual, isSolvable } from "../utils/puzzleSolver"
import "../styles/solve-puzzle.css"
import "../styles/main.css"

const SolvePuzzlePage = () => {
  const [puzzle, setPuzzle] = useState([
    [1, 2, 3],
    [4, 0, 6],
    [7, 8, 5],
  ])
  const [goalState] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ])
  const [solution, setSolution] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [error, setError] = useState("")
  const [isSolving, setIsSolving] = useState(false)
  const [showAllSteps, setShowAllSteps] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(2000)

  const handleCellChange = (row, col, value) => {
    const newPuzzle = [...puzzle]
    newPuzzle[row][col] = value === "" ? 0 : Number.parseInt(value, 10)
    setPuzzle(newPuzzle)
  }

  const handleGenerateRandom = () => {
    const randomPuzzle = generateRandomPuzzle()
    setPuzzle(randomPuzzle)
    setSolution([])
    setCurrentStep(0)
    setError("")
  }

  const handleSolve = () => {
    setSolution([])
    setCurrentStep(0)
    setError("")

    if (!isSolvable(puzzle)) {
      setError(
        "This puzzle configuration is not solvable due to an odd number of inversions relative to the empty tile position."
      )
      return
    }

    setIsSolving(true)

    setTimeout(() => {
      try {
        const result = hillClimbing(puzzle, goalState)
        if (result.path.length === 0 || result.path[result.path.length - 1].hValue !== 0) {
          const lastState = result.path[result.path.length - 1].state
          const possibleMoves = getPossibleMoves(lastState)
          const currentHValue = calculateManhattanDistance(lastState, goalState)
          const moveEvaluations = possibleMoves.map((move) => {
            const newState = applyMove(lastState, move)
            return calculateManhattanDistance(newState, goalState)
          })
          const minNeighborHValue = Math.min(...moveEvaluations)
          let errorMessage = "No solution found. The hill climbing algorithm got stuck. "
          if (minNeighborHValue >= currentHValue) {
            errorMessage += "Reason: Local Optimum - No neighboring state has a better heuristic value."
          } else if (moveEvaluations.every((h) => h === currentHValue)) {
            errorMessage += "Reason: Plateau - All neighboring states have the same heuristic value."
          } else {
            errorMessage += "Reason: Possible ridge or visited states limit reached."
          }
          setError(errorMessage)
          setSolution(result.path)
        } else {
          setSolution(result.path)
        }
      } catch (err) {
        setError("Error solving puzzle: " + err.message)
      } finally {
        setIsSolving(false)
      }
    }, 1000)
  }

  const handleAnimateSolution = () => {
    if (solution.length === 0) return
    setIsAnimating(true)
    setCurrentStep(0)
  }

  const handleSpeedChange = (e) => {
    setAnimationSpeed(Number.parseInt(e.target.value))
  }

  useEffect(() => {
    let timer
    if (isAnimating && currentStep < solution.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, animationSpeed)
    } else if (currentStep >= solution.length - 1) {
      setIsAnimating(false)
    }
    return () => clearTimeout(timer)
  }, [isAnimating, currentStep, solution.length, animationSpeed])

  const getPossibleNextStates = (stepIndex) => {
    if (stepIndex >= solution.length) return []
    const currentState = solution[stepIndex].state
    const possibleMoves = getPossibleMoves(currentState)
    const nextStates = possibleMoves.map((move) => {
      const newState = applyMove(currentState, move)
      const hValue = calculateManhattanDistance(newState, goalState)
      return {
        state: newState,
        move,
        hValue,
        isSelected:
          solution[stepIndex + 1] &&
          solution[stepIndex + 1].move &&
          solution[stepIndex + 1].move.tile === move.tile &&
          solution[stepIndex + 1].move.direction === move.direction,
      }
    })
    return nextStates.sort((a, b) => a.hValue - b.hValue)
  }

  return (
    <div className="solve-puzzle-page">
      <h2 className="page-title mb-4 fade-in">Solve 8-Puzzle Problem</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="card-header">
              <h4>Puzzle Configuration</h4>
            </div>
            <div className="card-body">
              <PuzzleControls
                puzzle={puzzle}
                onCellChange={handleCellChange}
                onGenerateRandom={handleGenerateRandom}
                onSolve={handleSolve}
                isSolving={isSolving}
              />

              <div className="row mt-3 fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="col-6 d-flex justify-content-center">
                  <div>
                    <h5>Initial State</h5>
                    <PuzzleBoard puzzle={puzzle} />
                  </div>
                </div>
                <div className="col-6 d-flex justify-content-center">
                  <div>
                    <h5>Goal State</h5>
                    <PuzzleBoard puzzle={goalState} isGoalState={true} />
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger mt-3 fade-in" style={{ animationDelay: "0.4s" }}>
                  {error}
                  {error.includes("Local Optimum") && (
                    <p className="mt-2">Suggestion: Try generating a new random puzzle.</p>
                  )}
                  {error.includes("Plateau") && (
                    <p className="mt-2">
                      Suggestion: Stochastic hill climbing or random restarts could help escape plateaus by introducing
                      randomness in move selection.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="card-header">
              <h4>Solution Steps</h4>
            </div>
            <div className="card-body">
              {solution.length > 0 ? (
                <>
                  <div className="d-flex justify-content-between mb-3 fade-in" style={{ animationDelay: "0.3s" }}>
                    <span>
                      Step {currentStep + 1} of {solution.length}
                    </span>
                    <div>
                      <button className="btn btn-primary me-2" onClick={handleAnimateSolution} disabled={isAnimating}>
                        {isAnimating ? "Animating..." : "Animate Solution"}
                      </button>
                      <button className="btn btn-secondary" onClick={() => setShowAllSteps(!showAllSteps)}>
                        {showAllSteps ? "Hide All Steps" : "Show All Steps"}
                      </button>
                    </div>
                  </div>

                  <div className="speed-control fade-in" style={{ animationDelay: "0.35s" }}>
                    <label htmlFor="animationSpeed">Solve Speed:</label>
                    <select
                      id="animationSpeed"
                      value={animationSpeed}
                      onChange={handleSpeedChange}
                      disabled={isAnimating}
                    >
                      <option value="500">0.5s</option>
                      <option value="1000">1s</option>
                      <option value="2000">2s</option>
                      <option value="3000">3s</option>
                      <option value="4000">4s</option>
                      <option value="10000">10s</option>
                    </select>
                  </div>

                  <StepVisualizer
                    step={solution[currentStep]}
                    totalSteps={solution.length}
                    currentStep={currentStep}
                  />

                  <div className="step-navigation mt-3 fade-in" style={{ animationDelay: "0.4s" }}>
                    <button
                      className="btn btn-secondary"
                      disabled={currentStep === 0 || isAnimating}
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-secondary ms-2"
                      disabled={currentStep === solution.length - 1 || isAnimating}
                      onClick={() => setCurrentStep((prev) => prev + 1)}
                    >
                      Next
                    </button>
                  </div>

                  {currentStep < solution.length - 1 && (
                    <div className="possible-states mt-4 fade-in" style={{ animationDelay: "0.5s" }}>
                      <h5>Possible Next States</h5>
                      <div className="row">
                        {getPossibleNextStates(currentStep).map((nextState, index) => (
                          <div key={index} className="col-md-6 mb-3">
                            <div className={`card possible-state-card ${nextState.isSelected ? "selected" : ""}`}>
                              <div className="card-body">
                                <PuzzleBoard puzzle={nextState.state} />
                                <p className="mt-2 mb-0">
                                  Move: {nextState.move.tile} {nextState.move.direction}
                                </p>
                                <p className="mb-0">Heuristic Value: {nextState.hValue}</p>
                                {nextState.isSelected && <p className="mb-0 text-primary">Selected by Algorithm</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showAllSteps && (
                    <div className="all-steps-visualization mt-4 fade-in" style={{ animationDelay: "0.6s" }}>
                      <h5>All Solution Steps</h5>
                      <div className="solution-steps-container">
                        {solution.map((step, index) => (
                          <div
                            key={index}
                            className={`step-card ${index === currentStep ? "active" : ""}`}
                            onClick={() => {
                              setCurrentStep(index)
                              setIsAnimating(false)
                            }}
                          >
                            <div className="step-content">
                              <div className="puzzle-grid">
                                <PuzzleBoard puzzle={step.state} />
                              </div>
                              <div className="step-details">
                                <p className="mb-0">
                                  <strong>Step {index + 1}</strong>
                                  {step.move
                                    ? `: Moved tile ${step.move.tile} ${step.move.direction}`
                                    : ": Initial state"}
                                </p>
                                <p className="mb-1">Heuristic: {step.hValue}</p>
                                <div className="mt-2">
                                  <p className="mb-1">
                                    <strong>h (heuristic value):</strong> {step.hValue}
                                  </p>
                                  <p className="mb-1">
                                    <strong>g (steps from start):</strong> {step.gValue}
                                  </p>
                                  <p className="mb-1">
                                    <strong>f (total cost):</strong> {step.fValue}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-5 fade-in" style={{ animationDelay: "0.3s" }}>
                  <p>Solve the puzzle to see the solution steps here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolvePuzzlePage