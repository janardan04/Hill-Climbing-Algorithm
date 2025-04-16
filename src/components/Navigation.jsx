"use client"

import { useState } from "react"
import "../styles/main.css"
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Table,
  Form,
  Modal,
  Nav,
  Badge,
  Spinner,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap"
import {
  PeopleFill,
  Shop,
  TagFill,
  Search,
  PlusCircle,
  Trash,
  Pencil,
  BoxArrowRight,
  GearFill,
  ArrowClockwise,
  ExclamationTriangle,
  Grid,
  List,
} from "react-bootstrap-icons"

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
          <span className="ms-3 text-muted" style={{ fontSize: "0.9rem" }}>
            by{" "}
            <OverlayTrigger placement="bottom" overlay={<Tooltip>He Is Member Of Developing</Tooltip>}>
              <a
                href="https://www.linkedin.com/in/janardan-borase-25a546232/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
              >
                Janardan
              </a>
            </OverlayTrigger>{" "}
            &{" "}
            <OverlayTrigger placement="bottom" overlay={<Tooltip>He Is Member Of Developing</Tooltip>}>
              <a
                href="https://www.linkedin.com/in/krushna-andhale-811831265/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
              >
                Krushna
              </a>
            </OverlayTrigger>
          </span>

          {/* Desktop Navigation */}
          <div className="nav-links ms-4">
            <OverlayTrigger placement="bottom" overlay={<Tooltip>Home</Tooltip>}>
              <a href="/" className="nav-link fade-in" style={{ animationDelay: "0.1s" }}>
                Home
              </a>
            </OverlayTrigger>

            <OverlayTrigger placement="bottom" overlay={<Tooltip>Solve</Tooltip>}>
              <a href="/solve" className="nav-link fade-in" style={{ animationDelay: "0.2s" }}>
                Solve 8-Puzzle
              </a>
            </OverlayTrigger>

            <OverlayTrigger placement="bottom" overlay={<Tooltip>Algorithm</Tooltip>}>
              <a href="/algorithm" className="nav-link fade-in" style={{ animationDelay: "0.3s" }}>
                Algorithm
              </a>
            </OverlayTrigger>

            <OverlayTrigger placement="bottom" overlay={<Tooltip>Learn</Tooltip>}>
              <a href="/learn" className="nav-link fade-in" style={{ animationDelay: "0.4s" }}>
                Learn
              </a>
            </OverlayTrigger>
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
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Home</Tooltip>}>
          <a href="/" className="nav-link fade-in" style={{ animationDelay: "0.1s" }}>
            Home
          </a>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Solve</Tooltip>}>
          <a href="/solve" className="nav-link fade-in" style={{ animationDelay: "0.2s" }}>
            Solve 8-Puzzle
          </a>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Algorithm</Tooltip>}>
          <a href="/algorithm" className="nav-link fade-in" style={{ animationDelay: "0.3s" }}>
            Algorithm
          </a>
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={<Tooltip>Learn</Tooltip>}>
          <a href="/learn" className="nav-link fade-in" style={{ animationDelay: "0.4s" }}>
            Learn
          </a>
        </OverlayTrigger>
        <div className="text-muted text-center mt-3" style={{ fontSize: "0.9rem" }}>
          by{" "}
          <OverlayTrigger placement="bottom" overlay={<Tooltip>He Is Member Of Developing</Tooltip>}>
            <a
              href="https://www.linkedin.com/in/janardan-borase-25a546232/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
            >
              Janardan
            </a>
          </OverlayTrigger>{" "}
          &{" "}
          <OverlayTrigger placement="bottom" overlay={<Tooltip>He Is Member Of Developing</Tooltip>}>
            <a
              href="https://www.linkedin.com/in/krushna-andhale-811831265/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
            >
              Krushna
            </a>
          </OverlayTrigger>
        </div>
      </div>
    </nav>
  )
}

export default Navigation