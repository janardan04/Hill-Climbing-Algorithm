"use client"

import { useState } from "react"
import "../styles/main.css"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="d-flex align-items-center">
          <a href="/" className="nav-logo">
            8-Puzzle Solver
          </a>

          {/* Desktop Navigation */}
          <div className="nav-links ms-4">
            <a href="/" className="nav-link fade-in" style={{ animationDelay: "0.1s" }}>
              Home
            </a>
            <a href="/solve" className="nav-link fade-in" style={{ animationDelay: "0.2s" }}>
              Solve 8-Puzzle
            </a>
            <a href="/algorithm" className="nav-link fade-in" style={{ animationDelay: "0.3s" }}>
              Algorithm
            </a>
            <a href="/learn" className="nav-link fade-in" style={{ animationDelay: "0.4s" }}>
              Learn
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <button onClick={toggleMenu} className="mobile-menu-btn" aria-label="Toggle menu">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        <a href="/" className="nav-link fade-in" style={{ animationDelay: "0.1s" }}>
          Home
        </a>
        <a href="/solve" className="nav-link fade-in" style={{ animationDelay: "0.2s" }}>
          Solve 8-Puzzle
        </a>
        <a href="/algorithm" className="nav-link fade-in" style={{ animationDelay: "0.3s" }}>
          Algorithm
        </a>
        <a href="/learn" className="nav-link fade-in" style={{ animationDelay: "0.4s" }}>
          Learn
        </a>
      </div>
    </nav>
  )
}

export default Navigation
