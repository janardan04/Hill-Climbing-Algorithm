import HillVisualization from "../components/HillVisualization"
import "../styles/main.css"

const AlgorithmPage = () => {
  return (
    <div className="algorithm-page">
      <h2 className="page-title mb-4 fade-in">Hill Climbing Algorithm</h2>

      <div className="card mb-4 fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="card-body">
          <h3>Overview</h3>
          <p>
            Hill Climbing is a heuristic search technique used for mathematical optimization problems. It's an iterative
            algorithm that starts with an arbitrary solution to a problem, then attempts to find a better solution by
            making an incremental change to the solution. If the change produces a better solution, another incremental
            change is made to the new solution. This continues until no further improvements can be found.
          </p>
          <p>
            For the 8-puzzle problem, Hill Climbing works by evaluating possible moves from the current state and
            selecting the move that brings us closest to the goal state, as determined by a heuristic function.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4 fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="card-header">
              <h4>Algorithm Pseudocode</h4>
            </div>
            <div className="card-body">
              <pre className="pseudocode">
                {`function hillClimbing(initial_state):
    current = initial_state
    
    while true:
        neighbors = getNeighbors(current)
        if neighbors is empty:
            return current
            
        next = neighbor with lowest heuristic value
        
        if heuristic(next) >= heuristic(current):
            // We've reached a peak (local optimum)
            return current
            
        current = next
`}
              </pre>
            </div>
          </div>

          <div className="card mb-4 fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="card-header">
              <h4>Heuristic Functions</h4>
            </div>
            <div className="card-body">
              <h5>Manhattan Distance</h5>
              <p>
                Sum of the distances of each tile from its goal position, measured along the grid. For each tile, we
                calculate |x1 - x2| + |y1 - y2| where (x1, y1) is the current position and (x2, y2) is the goal
                position.
              </p>

              <h5>Misplaced Tiles</h5>
              <p>
                Count of tiles that are not in their goal position. This is a simpler heuristic but less informative
                than Manhattan distance.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4 fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="card-header">
              <h4>Limitations</h4>
            </div>
            <div className="card-body">
              <p>The main limitation of Hill Climbing is that it can get stuck in:</p>
              <ul>
                <li>
                  <strong>Local Maxima:</strong> States where no neighbor has a better value, but the state is not the
                  goal.
                </li>
                <li>
                  <strong>Plateaus:</strong> Flat areas of the search space where all neighbors have the same value.
                </li>
                <li>
                  <strong>Ridges:</strong> Areas where simple moves won't improve the situation, but more complex
                  sequences would.
                </li>
              </ul>
              <p>
                For the 8-puzzle problem, Hill Climbing might not always find the optimal solution or might get stuck in
                a local optimum. This is why more advanced algorithms like A* are often preferred for this problem.
              </p>
            </div>
          </div>

          <div className="card fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="card-header">
              <h4>Hill Climbing Visualization</h4>
            </div>
            <div className="card-body">
              <HillVisualization />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlgorithmPage
