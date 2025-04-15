
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">8-Puzzle Solver</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/solve">Solve 8-Puzzle</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/algorithm">Algorithm</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/learn">Learn</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;