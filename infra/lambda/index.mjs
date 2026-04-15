import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.TABLE_NAME;

export async function handler(event) {
  const method = event.requestContext?.http?.method;
  const path = event.requestContext?.http?.path;
  const sub = event.requestContext?.authorizer?.jwt?.claims?.sub;

  if (!sub) {
    return response(401, { error: 'Unauthorized' });
  }

  try {
    if (path === '/api/save' && method === 'GET') {
      return await handleGetSave(sub);
    }
    if (path === '/api/save' && method === 'POST') {
      return await handlePostSave(sub, event.body);
    }
    if (path === '/api/profile' && method === 'PUT') {
      return await handlePutProfile(sub, event.body);
    }
    if (path === '/api/leaderboard' && method === 'GET') {
      return await handleGetLeaderboard();
    }
    return response(404, { error: 'Not found' });
  } catch (err) {
    console.error('Handler error:', err);
    return response(500, { error: 'Internal server error' });
  }
}

// GET /api/save — load player save data
async function handleGetSave(sub) {
  const result = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      // sk は 'SAVE#01' 固定 — セーブスロットは1つのみの設計
      Key: { pk: `USER#${sub}`, sk: 'SAVE#01' },
    }),
  );

  if (!result.Item) {
    return response(200, { exists: false, gameState: null });
  }

  return response(200, {
    exists: true,
    gameState: result.Item.gameState,
    userName: result.Item.userName,
    updatedAt: result.Item.updatedAt,
  });
}

// sub の先頭6文字からプレイヤー表示名を自動生成する
// （ユーザーが意識する必要なく、メールアドレスを公開しない匿名識別子）
function autoUserName(sub) {
  return `Player-${sub.replace(/-/g, '').slice(0, 6)}`;
}

// POST /api/save — save player game state
async function handlePostSave(sub, rawBody) {
  let body;
  try {
    body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
  } catch {
    return response(400, { error: 'Invalid JSON in request body' });
  }

  if (!body || !body.gameState) {
    return response(400, { error: 'Missing gameState in request body' });
  }

  const { gameState } = body;
  const now = new Date().toISOString();

  // Extract score for leaderboard GSI
  const score = typeof gameState.score === 'number' ? gameState.score : 0;

  // UpdateCommand を使い、初回保存時のみ createdAt・userName をセット（以降は上書きしない）
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      // sk は 'SAVE#01' 固定 — セーブスロットは1つのみの設計
      Key: { pk: `USER#${sub}`, sk: 'SAVE#01' },
      UpdateExpression: [
        'SET score = :score',
        'leaderboardKey = :lk',
        'gameState = :gameState',
        'schemaVersion = :sv',
        'updatedAt = :now',
        'createdAt = if_not_exists(createdAt, :now)',
        'userName = if_not_exists(userName, :autoName)',
      ].join(', '),
      ExpressionAttributeValues: {
        ':score': score,
        ':lk': 'GLOBAL',
        ':gameState': gameState,
        ':sv': '1',
        ':now': now,
        ':autoName': autoUserName(sub),
      },
    }),
  );

  return response(200, { success: true, updatedAt: now });
}

// PUT /api/profile — ユーザー名を変更する
async function handlePutProfile(sub, rawBody) {
  let body;
  try {
    body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
  } catch {
    return response(400, { error: 'Invalid JSON in request body' });
  }
  const cleaned = sanitizeUserName(body?.userName);

  if (!cleaned) {
    return response(400, { error: 'userName は1〜20文字で入力してください' });
  }

  try {
    await ddb.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { pk: `USER#${sub}`, sk: 'SAVE#01' },
        UpdateExpression: 'SET userName = :userName',
        // セーブデータが存在するユーザーのみ更新を許可（孤立アイテムの生成を防ぐ）
        ConditionExpression: 'attribute_exists(pk)',
        ExpressionAttributeValues: { ':userName': cleaned },
      }),
    );
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return response(404, {
        error:
          'セーブデータが見つかりません。一度ゲームを遊んでから設定してください。',
      });
    }
    throw err;
  }

  return response(200, { success: true, userName: cleaned });
}

// ユーザーが入力したユーザー名を検証・整形する（日本語対応、最大20文字）
function sanitizeUserName(raw) {
  if (typeof raw !== 'string') return null;
  const cleaned = raw
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/<[^>]*>/g, '')
    .trim();
  if (cleaned.length === 0 || cleaned.length > 20) return null;
  return cleaned;
}

// GET /api/leaderboard — top N players
async function handleGetLeaderboard() {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'leaderboard-index',
      KeyConditionExpression: 'leaderboardKey = :gk',
      ExpressionAttributeValues: { ':gk': 'GLOBAL' },
      ScanIndexForward: false,
      Limit: 20,
      ProjectionExpression: 'userName, score',
    }),
  );

  return response(200, {
    entries: (result.Items || []).map((item, i) => ({
      rank: i + 1,
      userName: item.userName,
      score: item.score,
    })),
  });
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
