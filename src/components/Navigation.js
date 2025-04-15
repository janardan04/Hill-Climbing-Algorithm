import React, { useState } from 'react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Internal CSS styles
  const styles = {
    nav: {
      backgroundColor: '#fffde7', // Light yellow
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    flexRow: {
      display: 'flex'
    },
    spacer: {
      marginLeft: '1rem'
    },
    logo: {
      fontWeight: 'bold',
      fontSize: '1.25rem',
      color: '#000',
      textDecoration: 'none',
      padding: '1rem 0',
      display: 'inline-block',
      transition: 'transform 0.3s ease'
    },
    logoHover: {
      transform: 'scale(1.05)'
    },
    desktopMenu: {
      display: 'none',
      '@media (min-width: 768px)': {
        display: 'flex',
        alignItems: 'center'
      }
    },
    navItem: {
      color: '#000',
      fontWeight: 'bold',
      padding: '1rem 0.75rem',
      textDecoration: 'none', 
      position: 'relative',
      transition: 'transform 0.3s ease'
    },
    navItemHover: {
      backgroundColor: 'rgba(0,0,0,0.05)',
      transform: 'translateY(-2px)'
    },
    mobileMenuBtn: {
      padding: '0.5rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.3s ease'
    },
    mobileMenuBtnHover: {
      transform: 'rotate(90deg)'
    },
    mobileMenuContainer: {
      '@media (min-width: 768px)': {
        display: 'none'
      }
    },
    mobileMenu: {
      height: isOpen ? 'auto' : '0',
      overflow: 'hidden',
      transition: 'height 0.4s ease-out, opacity 0.3s ease',
      opacity: isOpen ? '1' : '0',
      backgroundColor: '#fffbe6'
    },
    mobileNavItem: {
      display: 'block',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      color: '#000',
      fontWeight: 'bold',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      transform: isOpen ? 'translateX(0)' : 'translateX(-10px)',
      opacity: isOpen ? '1' : '0'
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.flexBetween}>
          <div style={styles.flexRow}>
            {/* Logo */}
            <div style={{display: 'flex', alignItems: 'center'}}>
              <a 
                href="/" 
                style={styles.logo}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                8-Puzzle Solver
              </a>
            </div>

            {/* Desktop Navigation */}
            <div style={{display: 'none', alignItems: 'center', marginLeft: '1rem', '@media (min-width: 768px)': {display: 'flex'}}}>
              <a 
                href="/" 
                style={styles.navItem}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Home
              </a>
              <a 
                href="/solve" 
                style={styles.navItem}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Solve 8-Puzzle
              </a>
              <a 
                href="/algorithm" 
                style={styles.navItem}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Algorithm
              </a>
              <a 
                href="/learn" 
                style={styles.navItem}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Learn
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div style={{display: 'flex', alignItems: 'center', '@media (min-width: 768px)': {display: 'none'}}}>
            <button 
              onClick={toggleMenu} 
              style={styles.mobileMenuBtn}
              onMouseEnter={(e) => e.target.style.transform = 'rotate(90deg)'}
              onMouseLeave={(e) => e.target.style.transform = 'rotate(0)'}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{color: '#000'}}>
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div style={styles.mobileMenu} className="md:hidden">
        <a href="/" style={{...styles.mobileNavItem, transitionDelay: isOpen ? '0.1s' : '0s'}}>Home</a>
        <a href="/solve" style={{...styles.mobileNavItem, transitionDelay: isOpen ? '0.2s' : '0s'}}>Solve 8-Puzzle</a>
        <a href="/algorithm" style={{...styles.mobileNavItem, transitionDelay: isOpen ? '0.3s' : '0s'}}>Algorithm</a>
        <a href="/learn" style={{...styles.mobileNavItem, transitionDelay: isOpen ? '0.4s' : '0s'}}>Learn</a>
      </div>
    </nav>
  );
};

export default Navigation;