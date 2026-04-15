import { getAccessToken } from './cognitoAuth';

// sub の先頭6文字からデフォルトのプレイヤー名を生成（バックエンドと同じロジック）
export const autoUserName = (sub) =>
  `Player-${sub.replace(/-/g, '').slice(0, 6)}`;

async function authFetch(path, options = {}) {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');
  return fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

export async function loadSave() {
  const res = await authFetch('/api/save');
  if (!res.ok) throw new Error(`loadSave failed: ${res.status}`);
  return res.json();
}

export async function postSave(gameState) {
  const res = await authFetch('/api/save', {
    method: 'POST',
    body: JSON.stringify({ gameState }),
  });
  if (!res.ok) throw new Error(`postSave failed: ${res.status}`);
  return res.json();
}

export async function putProfile(userName) {
  const res = await authFetch('/api/profile', {
    method: 'PUT',
    body: JSON.stringify({ userName }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? `putProfile failed: ${res.status}`);
  }
  return res.json();
}
