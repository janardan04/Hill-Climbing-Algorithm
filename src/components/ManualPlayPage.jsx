"use client"

import { useState } from "react"
import PuzzleBoard from "../components/PuzzleBoard"
import { generateRandomPuzzle, isSolvable } from "../utils/puzzleGenerator"
import { calculateManhattanDistance, getPossibleMoves, applyMove, findEmptyPosition } from "../utils/hillClimbing"
import { areStatesEqual } from "../utils/puzzleSolver" // Corrected import
import "../styles/main.css"
import "../styles/puzzle-board.css"

const ManualPlayPage = () => {
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
  const [moveHistory, setMoveHistory] = useState([])
  const [error, setError] = useState("")
  const [isGoalReached, setIsGoalReached] = useState(false)

  const handleGenerateRandom = () => {
    const randomPuzzle = generateRandomPuzzle()
    setPuzzle(randomPuzzle)
    setMoveHistory([])
    setError("")
    setIsGoalReached(false)
  }

  const handleMove = (direction) => {
    const possibleMoves = getPossibleMoves(puzzle)
    const move = possibleMoves.find((m) => m.direction === direction)
    if (!move) {
      setError(`Cannot move ${direction}!`)
      return
    }

    const newState = applyMove(puzzle, move)
    setPuzzle(newState)
    setMoveHistory([...moveHistory, { state: newState, move }])
    setError("")

    if (areStatesEqual(newState, goalState)) {
      setIsGoalReached(true)
    }
  }

  const handlePlayAgain = () => {
    handleGenerateRandom()
  }

  const calculateHeuristicDetails = (state) => {
    const details = []
    const goalPositions = {}
    let hValue = 0

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const value = goalState[i][j]
        if (value !== 0) {
          goalPositions[value] = { row: i, col: j }
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const value = state[i][j]
        if (value !== 0 && goalPositions[value]) {
          const goal = goalPositions[value]
          const distance = Math.abs(i - goal.row) + Math.abs(j - goal.col)
          hValue += distance
          details.push(
            `Tile ${value}: Current pos (${i},${j}), Goal pos (${goal.row},${goal.col}), Distance = |${i}-${goal.row}| + |${j}-${goal.col}| = ${distance}`
          )
        }
      }
    }

    return { hValue, details }
  }

  const { hValue, details } = calculateHeuristicDetails(puzzle)
  const gValue = moveHistory.length
  const fValue = hValue + gValue

  return (
    <div className="manual-play-page">
      <h2 className="page-title mb-4 fade-in">Play 8-Puzzle Manually</h2>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="card-header">
              <h4>Puzzle Play Area</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <button
                  className="btn btn-secondary fade-in"
                  style={{ animationDelay: "0.2s" }}
                  onClick={handleGenerateRandom}
                >
                  Generate Random
                </button>
              </div>

              <div className="row mb-3 fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="col-6 d-flex justify-content-center">
                  <div>
                    <h5>Current State</h5>
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

              <div className="move-controls text-center mb-3 fade-in" style={{ animationDelay: "0.4s" }}>
                <button
                  className="btn btn-primary m-1"
                  onClick={() => handleMove("up")}
                  disabled={!getPossibleMoves(puzzle).some((m) => m.direction === "up")}
                >
                  Up
                </button>
                <div>
                  <button
                    className="btn btn-primary m-1"
                    onClick={() => handleMove("left")}
                    disabled={!getPossibleMoves(puzzle).some((m) => m.direction === "left")}
                  >
                    Left
                  </button>
                  <button
                    className="btn btn-primary m-1"
                    onClick={() => handleMove("right")}
                    disabled={!getPossibleMoves(puzzle).some((m) => m.direction === "right")}
                  >
                    Right
                  </button>
                </div>
                <button
                  className="btn btn-primary m-1"
                  onClick={() => handleMove("down")}
                  disabled={!getPossibleMoves(puzzle).some((m) => m.direction === "down")}
                >
                  Down
                </button>
              </div>

              {error && (
                <div className="alert alert-danger fade-in" style={{ animationDelay: "0.5s" }}>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="card-header">
              <h4>State Information</h4>
            </div>
            <div className="card-body">
              <p className="mb-1 fade-in" style={{ animationDelay: "0.3s" }}>
                <strong>h (heuristic value):</strong> {hValue}
              </p>
              <p className="mb-1 fade-in" style={{ animationDelay: "0.4s" }}>
                <strong>g (steps from start):</strong> {gValue}
              </p>
              <p className="mb-1 fade-in" style={{ animationDelay: "0.5s" }}>
                <strong>f (total cost):</strong> {fValue}
              </p>

              <div className="mt-3 fade-in" style={{ animationDelay: "0.6s" }}>
                <h5>Heuristic Calculation</h5>
                <ul>
                  {details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
                <p>Total h = {details.map((d) => d.split(" = ")[1]).join(" + ")} = {hValue}</p>
              </div>

              <div className="mt-3 fade-in" style={{ animationDelay: "0.7s" }}>
                <h5>Other Calculations</h5>
                <p>g = Number of moves made = {gValue}</p>
                <p>f = g + h = {gValue} + {hValue} = {fValue}</p>
              </div>

              {moveHistory.length > 0 && (
                <div className="mt-3 fade-in" style={{ animationDelay: "0.8s" }}>
                  <h5>Move History</h5>
                  <ul>
                    {moveHistory.map((step, index) => (
                      <li key={index}>
                        Move {index + 1}: Moved tile {step.move.tile} {step.move.direction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {isGoalReached && (
                <div className="mt-3 fade-in" style={{ animationDelay: "0.9s" }}>
                  <div className="alert alert-success">
                    <h4>Congratulations!</h4>
                    <p>You have successfully solved the puzzle!</p>
                    <button className="btn btn-primary" onClick={handlePlayAgain}>
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManualPlayPage