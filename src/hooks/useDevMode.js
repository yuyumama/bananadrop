import { useState, useEffect } from 'react';

// Ctrl+Shift+D で開発者モードを切り替える
export default function useDevMode() {
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // CapsLock オン時は e.key が 'd' になるため e.code も併用する
      if (e.ctrlKey && e.shiftKey && (e.code === 'KeyD' || e.key === 'D')) {
        e.preventDefault();
        setDevMode((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return devMode;
}
