import { useState } from 'react';
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

  if (!authEnabled) return null;

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
        <button
          className="logout-button"
          onClick={() => setIsProfileOpen(true)}
          aria-label="プロフィール設定"
          title={userName ?? ''}
          style={{ gap: 5 }}
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
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
          <span
            style={{
              maxWidth: 80,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {userName ?? '…'}
          </span>
        </button>
        <button
          className="logout-button"
          onClick={signOut}
          aria-label={`ログアウト${user?.email ? ` (${user.email})` : ''}`}
          title={user?.email}
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
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

export default AuthToolbar;
