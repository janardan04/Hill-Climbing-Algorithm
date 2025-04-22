import { calculateManhattanDistance, getPossibleMoves, applyMove } from "./hillClimbing";
import { areStatesEqual } from "../utils/puzzleSolver";

// Simple Priority Queue implementation
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item, priority) {
    if (!item || !item.state || !Array.isArray(item.state)) {
      console.error("Enqueue rejected: Invalid item", item);
      return;
    }
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    const item = this.items.shift();
    if (!item) {
      console.warn("Dequeuing from empty queue");
      return null;
    }
    if (!item.item || !item.item.state || !Array.isArray(item.item.state)) {
      console.error("Dequeue rejected: Invalid item", item);
      return null;
    }
    console.log("Dequeued:", item.item);
    return item.item;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

export const aStar = (initialState, goalState) => {
  console.log("A* initiated with initialState:", initialState, "goalState:", goalState);
  if (!initialState || !goalState || !Array.isArray(initialState) || !Array.isArray(goalState)) {
    console.error("A* aborted: Invalid input", { initialState, goalState });
    return { path: [] };
  }

  const openList = new PriorityQueue();
  const closedList = new Set();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();
  const MAX_ITERATIONS = 1000; // Limit to prevent infinite loops
  let iterations = 0;

  const stateToString = (state) => {
    if (!state || !Array.isArray(state)) {
      console.error("stateToString failed: Invalid state", state);
      return "";
    }
    return JSON.stringify(state);
  };

  const initialHValue = calculateManhattanDistance(initialState, goalState);
  console.log("Initial heuristic:", initialHValue);
  if (isNaN(initialHValue)) {
    console.error("A* aborted: Invalid initial heuristic", initialHValue);
    return { path: [] };
  }

  const initialNode = { state: initialState, move: null, hValue: initialHValue, gValue: 0, fValue: initialHValue };
  gScore.set(stateToString(initialState), 0);
  fScore.set(stateToString(initialState), initialHValue);
  openList.enqueue(initialNode, initialHValue);
  console.log("Initial node enqueued:", initialNode);

  while (!openList.isEmpty() && iterations < MAX_ITERATIONS) {
    iterations++;
    const current = openList.dequeue();
    if (!current || !current.state || !Array.isArray(current.state)) {
      console.error("A* loop aborted: Invalid current node at iteration", iterations, current);
      break;
    }
    console.log("Processing node at iteration", iterations, ":", current);
    const currentState = current.state;

    if (areStatesEqual(currentState, goalState)) {
      console.log("Goal reached at iteration", iterations);
      const path = [];
      let currentNode = current;
      let pathSteps = 0;
      while (currentNode && pathSteps < MAX_ITERATIONS) {
        pathSteps++;
        path.push(currentNode);
        const prevStateStr = cameFrom.get(stateToString(currentNode.state));
        console.log("Path step", pathSteps, "current:", currentNode.state, "prev:", prevStateStr);
        if (!prevStateStr) {
          console.log("Path complete at step", pathSteps);
          break;
        }
        if (!prevStateStr.state || !Array.isArray(prevStateStr.state)) {
          console.error("Invalid previous state at step", pathSteps, prevStateStr);
          break;
        }
        currentNode = path.find((node) => areStatesEqual(node.state, prevStateStr.state));
        if (!currentNode) {
          console.warn("No matching previous node at step", pathSteps);
          break;
        }
      }
      console.log("Final path:", path);
      return { path: path.reverse() };
    }

    closedList.add(stateToString(currentState));

    const possibleMoves = getPossibleMoves(currentState);
    if (!possibleMoves || !Array.isArray(possibleMoves)) {
      console.error("Invalid moves at iteration", iterations, possibleMoves);
      continue;
    }
    console.log("Possible moves at iteration", iterations, ":", possibleMoves);
    for (const move of possibleMoves) {
      const newState = applyMove(currentState, move);
      if (!newState || !Array.isArray(newState)) {
        console.warn("Invalid new state at iteration", iterations, "for move", move, newState);
        continue;
      }
      const newStateStr = stateToString(newState);
      console.log("New state at iteration", iterations, ":", newState);

      if (closedList.has(newStateStr)) {
        console.log("State already visited at iteration", iterations, newStateStr);
        continue;
      }

      const tentativeGScore = current.gValue + 1;
      const hValue = calculateManhattanDistance(newState, goalState);
      if (isNaN(hValue)) {
        console.warn("Invalid heuristic at iteration", iterations, "for state", newState);
        continue;
      }
      const fValue = tentativeGScore + hValue;

      if (!gScore.has(newStateStr) || tentativeGScore < gScore.get(newStateStr)) {
        cameFrom.set(newStateStr, { state: currentState, move });
        gScore.set(newStateStr, tentativeGScore);
        fScore.set(newStateStr, fValue);
        openList.enqueue({ state: newState, move, hValue, gValue: tentativeGScore, fValue }, fValue);
        console.log("Enqueued at iteration", iterations, ":", newState, "fValue:", fValue);
      }
    }
  }

  console.log("A* terminated: No solution or max iterations", iterations, "reached");
  return { path: [] };
};