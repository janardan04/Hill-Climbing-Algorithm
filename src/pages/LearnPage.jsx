"use client"

import { useState } from "react"
import PuzzleBoard from "../components/PuzzleBoard"
import "../styles/main.css"

const LearnPage = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const tutorialSteps = [
    {
      title: "Understanding the 8-Puzzle",
      content: (
        <>
          <p className="fade-in" style={{ animationDelay: "0.1s" }}>
            The 8-puzzle consists of 8 numbered tiles and one empty space on a 3×3 grid. The goal is to rearrange the
            tiles to match a specific goal state.
          </p>
          <p className="fade-in" style={{ animationDelay: "0.2s" }}>
            Tiles can only move into the adjacent empty space. The possible moves for each tile depend on the current
            position of the empty space.
          </p>
          <div className="d-flex justify-content-center my-3 fade-in" style={{ animationDelay: "0.3s" }}>
            <PuzzleBoard
              puzzle={[
                [1, 2, 3],
                [4, 0, 6],
                [7, 5, 8],
              ]}
            />
          </div>
          <p className="fade-in" style={{ animationDelay: "0.4s" }}>
            In the puzzle above, the tiles 2, 4, 6, and 5 can move into the empty space.
          </p>
        </>
      ),
    },
    {
      title: "Heuristic Function",
      content: (
        <>
          <p className="fade-in" style={{ animationDelay: "0.1s" }}>
            To solve the puzzle using hill climbing, we need a way to evaluate how "good" a particular state is. This is
            done using a heuristic function.
          </p>
          <p className="fade-in" style={{ animationDelay: "0.2s" }}>
            The most common heuristic for the 8-puzzle is the <strong>Manhattan distance</strong>, which is the sum of
            the horizontal and vertical distances of each tile from its goal position.
          </p>
          <div className="row my-3 fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="col-md-6">
              <h5>Current State</h5>
              <PuzzleBoard
                puzzle={[
                  [1, 2, 3],
                  [4, 0, 6],
                  [7, 5, 8],
                ]}
              />
            </div>
            <div className="col-md-6">
              <h5>Goal State</h5>
              <PuzzleBoard
                puzzle={[
                  [1, 2, 3],
                  [4, 5, 6],
                  [7, 8, 0],
                ]}
                isGoalState={true}
              />
            </div>
          </div>
          <p className="fade-in" style={{ animationDelay: "0.4s" }}>
            For this example, the Manhattan distance would be:
          </p>
          <ul className="fade-in" style={{ animationDelay: "0.5s" }}>
            <li>Tile 5 is 1 move away from its goal position</li>
            <li>Tile 0 (empty space) is 1 move away from its goal position</li>
            <li>All other tiles are already in their goal positions (0 distance)</li>
          </ul>
          <p className="fade-in" style={{ animationDelay: "0.6s" }}>
            Total heuristic value: 1 + 1 = 2
          </p>
        </>
      ),
    },
    // Other tutorial steps remain the same but with added animations
    {
      title: "Hill Climbing Process",
      content: (
        <>
          <p className="fade-in" style={{ animationDelay: "0.1s" }}>
            Hill climbing works by evaluating all possible moves from the current state, and choosing the one that
            results in the lowest heuristic value (closest to the goal).
          </p>
          <p className="fade-in" style={{ animationDelay: "0.2s" }}>
            Let's see the process in action:
          </p>
          <div className="card mb-3 fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="card-body">
              <h5>Starting State</h5>
              <div className="row">
                <div className="col-md-6">
                  <PuzzleBoard
                    puzzle={[
                      [1, 2, 3],
                      [4, 0, 6],
                      [7, 5, 8],
                    ]}
                  />
                </div>
                <div className="col-md-6">
                  <p>Heuristic Value: 2</p>
                  <p>Possible moves:</p>
                  <ul>
                    <li>Move tile 2 down (↓)</li>
                    <li>Move tile 4 right (→)</li>
                    <li>Move tile 6 left (←)</li>
                    <li>Move tile 5 up (↑)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <p className="fade-in" style={{ animationDelay: "0.4s" }}>
            After evaluating all moves, moving tile 5 up results in the best heuristic value.
          </p>
        </>
      ),
    },
    {
      title: "Making the Best Move",
      content: (
        <>
          <div className="card mb-3 fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="card-body">
              <h5>Next State (After Moving Tile 5 Up)</h5>
              <div className="row">
                <div className="col-md-6">
                  <PuzzleBoard
                    puzzle={[
                      [1, 2, 3],
                      [4, 5, 6],
                      [7, 0, 8],
                    ]}
                  />
                </div>
                <div className="col-md-6">
                  <p>Heuristic Value: 1</p>
                  <p>Possible moves:</p>
                  <ul>
                    <li>Move tile 5 down (↓)</li>
                    <li>Move tile 7 right (→)</li>
                    <li>Move tile 8 left (←)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <p className="fade-in" style={{ animationDelay: "0.2s" }}>
            Now, moving tile 8 left gives us the best heuristic value.
          </p>
        </>
      ),
    },
    {
      title: "Reaching the Goal",
      content: (
        <>
          <div className="card mb-3 fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="card-body">
              <h5>Final State (After Moving Tile 8 Left)</h5>
              <div className="row">
                <div className="col-md-6">
                  <PuzzleBoard
                    puzzle={[
                      [1, 2, 3],
                      [4, 5, 6],
                      [7, 8, 0],
                    ]}
                    isGoalState={true}
                  />
                </div>
                <div className="col-md-6">
                  <p>Heuristic Value: 0</p>
                  <p>We've reached the goal state!</p>
                </div>
              </div>
            </div>
          </div>
          <p className="fade-in" style={{ animationDelay: "0.2s" }}>
            Hill climbing has successfully found a path to the goal state. However, it's important to note that hill
            climbing can get stuck in local optima for more complex puzzles.
          </p>
          <p className="fade-in" style={{ animationDelay: "0.3s" }}>
            For more difficult puzzles, algorithms like A* search are often more effective as they explore more paths
            and guarantee finding the optimal solution.
          </p>
        </>
      ),
    },
    {
      title: "When Hill Climbing Fails",
      content: (
        <>
          <p className="fade-in" style={{ animationDelay: "0.1s" }}>
            Hill climbing isn't guaranteed to find a solution for all puzzles. It can get stuck in:
          </p>
          <ul className="fade-in" style={{ animationDelay: "0.2s" }}>
            <li>
              <strong>Local Optima:</strong> States where no immediate move improves the situation but the state isn't
              the goal.
            </li>
            <li>
              <strong>Plateaus:</strong> Areas where all neighboring states have the same heuristic value.
            </li>
          </ul>
          <div className="card mb-3 fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="card-body">
              <h5>Example of a Challenging Puzzle</h5>
              <div className="row">
                <div className="col-md-6">
                  <PuzzleBoard
                    puzzle={[
                      [8, 1, 3],
                      [4, 0, 2],
                      [7, 6, 5],
                    ]}
                  />
                </div>
                <div className="col-md-6">
                  <p>
                    For this puzzle, hill climbing might make some progress but could get stuck before reaching the goal
                    state.
                  </p>
                  <p>
                    One solution to this problem is to use variations like steepest-ascent hill climbing or stochastic
                    hill climbing, or to switch to more advanced algorithms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ]

  return (
    <div className="learn-page">
      <h2 className="page-title mb-4 fade-in">Learn 8-Puzzle Solving</h2>

      <div className="card mb-4 fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h4>{tutorialSteps[currentStep].title}</h4>
            <div>
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>
          </div>
        </div>
        <div className="card-body">{tutorialSteps[currentStep].content}</div>
        <div className="card-footer">
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-secondary fade-in"
              style={{ animationDelay: "0.4s" }}
              onClick={() => setCurrentStep((prev) => prev - 1)}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              className="btn btn-primary fade-in"
              style={{ animationDelay: "0.5s" }}
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={currentStep === tutorialSteps.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearnPage
