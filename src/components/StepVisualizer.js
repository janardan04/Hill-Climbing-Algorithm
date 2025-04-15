import PuzzleBoard from "./PuzzleBoard"
import "../styles/step-visualizer.css"

const StepVisualizer = ({ step, totalSteps, currentStep }) => {
  const { state, move, hValue, gValue, fValue } = step

  const getMoveDescription = () => {
    if (!move) return "Initial state"

    return `Moved tile ${move.tile} ${move.direction}`
  }

  return (
    <div className="step-visualizer fade-in">
      <div className="row">
        <div className="col-md-6">
          <div className="d-flex justify-content-center">
            <PuzzleBoard puzzle={state} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="step-info-card">
            <h5 className="card-title">Step Information</h5>
            <p className="mb-1 fade-in" style={{ animationDelay: "0.1s" }}>
              <strong>Move:</strong> {getMoveDescription()}
            </p>
            <p className="mb-1 fade-in" style={{ animationDelay: "0.2s" }}>
              <strong>h (heuristic value):</strong> {hValue}
            </p>
            <p className="mb-1 fade-in" style={{ animationDelay: "0.3s" }}>
              <strong>g (steps from start):</strong> {gValue}
            </p>
            <p className="mb-1 fade-in" style={{ animationDelay: "0.4s" }}>
              <strong>f (total cost):</strong> {fValue}
            </p>

            <div className="progress mt-3 fade-in" style={{ animationDelay: "0.5s" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                aria-valuenow={currentStep + 1}
                aria-valuemin="0"
                aria-valuemax={totalSteps}
              >
                {Math.round(((currentStep + 1) / totalSteps) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepVisualizer
