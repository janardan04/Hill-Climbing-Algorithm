import React from 'react';
import { Link } from 'react-router-dom';
import PuzzleBoard from '../components/PuzzleBoard';

const HomePage = () => {
  // Sample puzzle state
  const samplePuzzle = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0]
  ];

  return (
    <div className="home-page">
      <div className="jumbotron bg-light p-5 rounded">
        <h1 className="display-4">8-Puzzle Solver</h1>
        <p className="lead">
          Explore the classic 8-puzzle problem using Hill Climbing algorithm. 
          Learn how AI solves this sliding puzzle efficiently.
        </p>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Solve 8-Puzzle</h5>
              <p className="card-text">Enter your own puzzle configuration or generate a random one to solve.</p>
              <Link to="/solve" className="btn btn-primary">Start Solving</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Algorithm</h5>
              <p className="card-text">Understand the Hill Climbing algorithm and how it applies to the 8-puzzle problem.</p>
              <Link to="/algorithm" className="btn btn-primary">Learn Algorithm</Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Learn Step by Step</h5>
              <p className="card-text">Interactive tutorial on solving the 8-puzzle problem and visualization of hill climbing.</p>
              <Link to="/learn" className="btn btn-primary">Start Learning</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6">
          <h3>What is the 8-Puzzle?</h3>
          <p>
            The 8-puzzle is a sliding puzzle that consists of a 3×3 grid with 8 square tiles labeled 1 through 8, 
            and one empty space. The goal is to rearrange the tiles from a given initial state to reach a specific 
            goal state by sliding tiles horizontally or vertically into the empty space.
          </p>
        </div>
        <div className="col-md-6">
          <h3>Example Puzzle</h3>
          <div className="d-flex justify-content-center">
            <PuzzleBoard puzzle={samplePuzzle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;