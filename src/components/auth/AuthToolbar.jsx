import { useEffect, useRef, useState } from 'react';
import ProfileModal from './ProfileModal';
import LeaderboardModal from '../ui/LeaderboardModal';

function AuthToolbar({
  authEnabled,
  user,
  userName,
  onUserNameChange,
  signOut,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    if (!isSettingsOpen) return undefined;
    const handlePointerDown = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsSettingsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSettingsOpen]);

  if (!authEnabled) return null;

  const handleOpenProfile = () => {
    setIsSettingsOpen(false);
    setIsProfileOpen(true);
  };

  const handleSignOut = () => {
    setIsSettingsOpen(false);
    signOut();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 50,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          gap: 6,
          maxWidth: 'calc(100vw - 24px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="logout-button"
          onClick={() => setIsLeaderboardOpen(true)}
          aria-label="リーダーボード"
          title="リーダーボード"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span>Ranking</span>
        </button>
        <div
          ref={settingsRef}
          style={{ position: 'relative', display: 'inline-flex' }}
        >
          <button
            className="logout-button"
            type="button"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            aria-label="設定"
            aria-expanded={isSettingsOpen}
            title={user?.email ?? '設定'}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Settings</span>
          </button>
          {isSettingsOpen && (
            <div className="glass-panel" style={menuStyles.menu}>
              <button
                type="button"
                className="settings-menu-item"
                onClick={handleOpenProfile}
                aria-label="プロフィール設定を開く"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <span style={menuStyles.itemLabel}>
                  <span style={menuStyles.itemTitle}>プロフィール</span>
                  {userName && (
                    <span style={menuStyles.itemSubtitle}>{userName}</span>
                  )}
                </span>
              </button>
              <button
                type="button"
                className="settings-menu-item"
                onClick={handleSignOut}
                aria-label={`ログアウト${user?.email ? ` (${user.email})` : ''}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span style={menuStyles.itemLabel}>
                  <span style={menuStyles.itemTitle}>ログアウト</span>
                  {user?.email && (
                    <span style={menuStyles.itemSubtitle}>{user.email}</span>
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
      {isProfileOpen && (
        <ProfileModal
          userName={userName}
          onClose={() => setIsProfileOpen(false)}
          onSaved={(newName) => onUserNameChange(newName)}
        />
      )}
      {isLeaderboardOpen && (
        <LeaderboardModal
          currentUserName={userName}
          onClose={() => setIsLeaderboardOpen(false)}
        />
      )}
    </>
  );
}

const menuStyles = {
  menu: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    right: 0,
    minWidth: 180,
    padding: 6,
    borderRadius: 14,
    background: 'rgba(255,255,255,0.96)',
    border: '1px solid var(--accent-gold-soft)',
    boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    zIndex: 60,
  },
  itemLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 0,
    flex: 1,
  },
  itemTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#3a3020',
    letterSpacing: '0.02em',
  },
  itemSubtitle: {
    fontSize: '0.65rem',
    color: '#8a7a60',
    maxWidth: 140,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

export default AuthToolbar;
