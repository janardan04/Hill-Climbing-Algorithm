import React from 'react';
import PuzzleBoard from './PuzzleBoard';

const StepVisualizer = ({ step, totalSteps, currentStep }) => {
  const { state, move, hValue, gValue, fValue } = step;
  
  const getMoveDescription = () => {
    if (!move) return "Initial state";
    
    return `Moved tile ${move.tile} ${move.direction}`;
  };

  return (
    <div className="step-visualizer">
      <div className="row">
        <div className="col-md-6">
          <div className="d-flex justify-content-center">
            <PuzzleBoard puzzle={state} />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Step Information</h5>
              <p className="mb-1"><strong>Move:</strong> {getMoveDescription()}</p>
              <p className="mb-1"><strong>h (heuristic value):</strong> {hValue}</p>
              <p className="mb-1"><strong>g (steps from start):</strong> {gValue}</p>
              <p className="mb-1"><strong>f (total cost):</strong> {fValue}</p>
              
              <div className="progress mt-3">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: `${(currentStep + 1) / totalSteps * 100}%` }}
                  aria-valuenow={currentStep + 1} 
                  aria-valuemin="0" 
                  aria-valuemax={totalSteps}
                >
                  {Math.round((currentStep + 1) / totalSteps * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepVisualizer;