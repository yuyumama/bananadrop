import { useState, useEffect } from 'react';

// Ctrl+Shift+D で開発者モードを切り替える
export default function useDevMode() {
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDevMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return devMode;
}
