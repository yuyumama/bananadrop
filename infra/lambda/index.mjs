import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
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

// POST /api/save — save player game state
async function handlePostSave(sub, rawBody) {
  const body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;

  if (!body || !body.gameState) {
    return response(400, { error: 'Missing gameState in request body' });
  }

  const { gameState, userName } = body;
  const now = new Date().toISOString();

  // Extract score for leaderboard GSI
  const score = typeof gameState.score === 'number' ? gameState.score : 0;

  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `USER#${sub}`,
        sk: 'SAVE#01',
        userName: userName || 'Anonymous',
        score,
        leaderboardKey: 'GLOBAL',
        gameState,
        schemaVersion: '1',
        createdAt: now,
        updatedAt: now,
      },
    }),
  );

  return response(200, { success: true, updatedAt: now });
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
