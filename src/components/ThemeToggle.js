// src/components/ThemeToggle.js
import { useTheme } from '../context/ThemeContext';

// Update your ThemeToggle.js
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
  
    return (
      <button 
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className="theme-toggle btn position-absolute"
        style={{
          top: '1rem',
          right: '1rem',
          zIndex: 1000
        }}
      >
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
    );
  };

  export default ThemeToggle;