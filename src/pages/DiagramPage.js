import "../styles/diagram.css";
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PuzzleBoard from "../components/PuzzleBoard";

const DiagramPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dataParam = searchParams.get("data");
  const data = dataParam ? JSON.parse(decodeURIComponent(dataParam) || "{}") : {};
  const { solution = [], initialState = [], goalState = [] } = data;
  const [diagramData, setDiagramData] = useState(null);

  useEffect(() => {
    console.log("useEffect triggered with data:", { solution, initialState, goalState });
    if (solution.length > 0 && initialState.length > 0 && goalState.length > 0) {
      const nodes = [];
      const edges = [];

      nodes.push({
        id: "A",
        state: initialState,
        hValue: calculateManhattanDistance(initialState, goalState),
        gValue: 0,
        fValue: calculateManhattanDistance(initialState, goalState),
      });

      solution.forEach((step, index) => {
        if (!step || !step.state || !Array.isArray(step.state)) {
          console.error("Invalid step in solution:", step);
          return;
        }
        const parentId = nodes[index].id;
        const newId = String.fromCharCode(65 + index + 1);
        nodes.push({
          id: newId,
          state: step.state,
          hValue: step.hValue,
          gValue: step.gValue,
          fValue: step.fValue,
        });
        edges.push({ from: parentId, to: newId, move: step.move });
      });

      setDiagramData({ nodes, edges });
    } else {
      console.warn("Skipping diagram generation: Invalid or empty data", { solution, initialState, goalState });
      setDiagramData(null);
    }
  }, [solution, initialState, goalState]);

  const renderDiagram = () => {
    if (!diagramData) return <p>Loading diagram...</p>;

    return (
      <div>
        <h2>Search Tree Diagram</h2>
        <div>
          <h4>Initial State (A)</h4>
          <PuzzleBoard puzzle={initialState} />
          <p>h = {calculateManhattanDistance(initialState, goalState)}, g = 0, f = {calculateManhattanDistance(initialState, goalState)}</p>
        </div>
        {diagramData.nodes.map((node, index) => (
          index > 0 && (
            <div key={node.id}>
              <h4>
                {node.id} (Selected: {solution[index - 1]?.move ? "Yes" : "No"})
              </h4>
              <PuzzleBoard puzzle={node.state} />
              <p>h = {node.hValue}, g = {node.gValue}, f = {node.fValue}</p>
              {diagramData.edges.find((edge) => edge.to === node.id) && (
                <p>
                  Move:{" "}
                  {diagramData.edges.find((edge) => edge.to === node.id).move?.tile}{" "}
                  {diagramData.edges.find((edge) => edge.to === node.id).move?.direction}
                </p>
              )}
            </div>
          )
        ))}
      </div>
    );
  };

  const calculateManhattanDistance = (state, goal) => {
    let distance = 0;
    for (let i = 0; i < state.length; i++) {
      for (let j = 0; j < state[i].length; j++) {
        const value = state[i][j];
        if (value !== 0) {
          const [goalI, goalJ] = findGoalPosition(value, goal);
          distance += Math.abs(i - goalI) + Math.abs(j - goalJ);
        }
      }
    }
    return distance || 0;
  };

  const findGoalPosition = (value, goal) => {
    for (let i = 0; i < goal.length; i++) {
      for (let j = 0; j < goal[i].length; j++) {
        if (goal[i][j] === value) return [i, j];
      }
    }
    return [0, 0];
  };

  const handleBackClick = () => {
    console.log("Back button clicked, navigating to /"); // Debug
    navigate("/");
  };

  return (
    <div className="diagram-page">
      {renderDiagram()}
      <button className="btn btn-secondary mt-3" onClick={handleBackClick}>
        Back to Puzzle
      </button>
    </div>
  );
};

export default DiagramPage;