import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import SolvePuzzlePage from './pages/SolvePuzzlePage';
import AlgorithmPage from './pages/AlgorithmPage';
import LearnPage from './pages/LearnPage';
import ManualPlayPage from "./components/ManualPlayPage";
import './styles/main.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/solve" element={<SolvePuzzlePage />} />
            <Route path="/algorithm" element={<AlgorithmPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/play" element={<ManualPlayPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
