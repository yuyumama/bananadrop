# AWS Architecture Design

## Overview

BanaDrop のバックエンド・インフラストラクチャの設計書。
静的ホスティング、認証、API、データベースを AWS 上に構築する。

```
User
  |
  |-- HTTPS --> CloudFront (xxxx.cloudfront.net)
                    |
                    |-- /*      --> S3 (静的ファイル, OAC)
                    |
                    |-- /api/*  --> API Gateway (HTTP API, JWT Authorizer)
                                        |
                                        v
                                      Lambda (bananadrop-api)
                                        |
                                        v
                                      DynamoDB (bananadrop)
  |
  |-- ログイン/JWT取得 --> Cognito User Pool
```

**CloudFront マルチオリジン構成** により、フロントエンドと API が同一ドメインで提供される。
ブラウザから見てすべて Same-Origin となるため **CORS 設定が完全に不要**。

### CI/CD

```
GitHub Actions
  |
  |-- infra.yml  (infra/** 変更時)  --> Terraform apply --> AWS リソース + Lambda
  |
  |-- deploy.yml (src/** 等変更時)  --> npm build --> S3 Sync + CloudFront Invalidation
```

---

## AWS Region

**ap-northeast-1 (Tokyo)**

CloudFront はグローバルサービスだが、Cognito / API Gateway / Lambda / DynamoDB / S3 はすべて ap-northeast-1 に配置する。

---

## Components

### 1. CloudFront + S3 (Static Hosting)

| Item          | Value                                                    | Reason                                             |
| ------------- | -------------------------------------------------------- | -------------------------------------------------- |
| Origin        | S3 (OAC)                                                 | Origin Access Control でバケット直接アクセスを遮断 |
| HTTPS         | 強制リダイレクト                                         | セキュリティ要件                                   |
| Cache         | `index.html` はキャッシュ無効 / アセットは長期キャッシュ | Vite の hash 付きビルドに対応                      |
| Custom Domain | 未定 (将来 ACM + Route 53 で対応)                        | -                                                  |
| Error Pages   | 403/404 -> `/index.html` (200)                           | SPA フォールバック                                 |
| Public Access | 全ブロック                                               | CloudFront 経由のみ                                |

#### Multi-Origin Behaviors

| Behavior | Path Pattern | Origin                      | Cache Policy                                            | Origin Request Policy       |
| -------- | ------------ | --------------------------- | ------------------------------------------------------- | --------------------------- |
| API      | `/api/*`     | API Gateway (custom origin) | `CachingDisabled`                                       | `AllViewerExceptHostHeader` |
| Default  | `*`          | S3 (OAC)                    | `index.html`: キャッシュ無効 / アセット: 長期キャッシュ | -                           |

**API Gateway Origin Config:**

```hcl
origin {
  domain_name = replace(aws_apigatewayv2_api.main.api_endpoint, "https://", "")
  origin_id   = "api-gateway"

  custom_origin_config {
    http_port              = 80
    https_port             = 443
    origin_protocol_policy = "https-only"
    origin_ssl_protocols   = ["TLSv1.2"]
  }
}
```

**`/api/*` Behavior Config:**

```hcl
ordered_cache_behavior {
  path_pattern             = "/api/*"
  target_origin_id         = "api-gateway"
  viewer_protocol_policy   = "redirect-to-https"
  allowed_methods          = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
  cached_methods           = ["GET", "HEAD"]
  cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
  origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host.id
}
```

**Notes:**

- API Gateway は HTTPS のみ -> `origin_protocol_policy = "https-only"`
- CloudFront はデフォルトで `Host: xxxx.cloudfront.net` を転送するが、API Gateway は自身のホスト名でないと **403 Forbidden** を返す。`AllViewerExceptHostHeader` ポリシーで Host 以外のヘッダー (`Authorization` 等) のみ転送することで回避
- 認証付きリクエスト (JWT) や POST のキャッシュは不整合の原因になるため、API ビヘイビアは `CachingDisabled` を使用

**Why CloudFront + S3, not Amplify Hosting:**

- Terraform + GitHub Actions で統一管理したい
- Cognito / API Gateway / Lambda / DynamoDB を別途管理するため、Amplify のブラックボックス化が障害になる
- Amplify の S3 ソース方式は S3 更新を自動検知しないため、Git 連携なしだと手動再デプロイが必要

---

### 2. Cognito User Pool (Authentication)

メール/パスワード認証。OAuth (Google/GitHub) は将来検討。

| Item         | Value                                           |
| ------------ | ----------------------------------------------- |
| Sign-up      | Email + Password                                |
| MFA          | 無効 (当面)                                     |
| Token Expiry | Access: 1h / Refresh: 30d                       |
| App Client   | SPA 向け (クライアントシークレットなし)         |
| Hosted UI    | 独自 UI を実装、または将来 OAuth 追加時に有効化 |
| JWT Usage    | API Gateway JWT Authorizer                      |

**Notes:**

- OAuth は後から Identity Provider を追加できるため、必要になったタイミングで対応可能
- `sub` をキーにしているため、認証方式の変更がセーブデータに影響しない
- Cognito の managed login experience (2024 年リリース) も選択肢として検討可能

---

### 3. API Gateway (HTTP API)

| Item       | Value                                                       |
| ---------- | ----------------------------------------------------------- |
| Type       | HTTP API                                                    |
| Authorizer | JWT Authorizer (Cognito issuer/audience)                    |
| Endpoints  | `GET /api/save` / `POST /api/save` / `GET /api/leaderboard` |
| CORS       | **不要** (CloudFront マルチオリジンにより Same-Origin)      |

**Why HTTP API over REST API:**

|              | REST API       | HTTP API       |
| ------------ | -------------- | -------------- |
| Cognito Auth | Native         | JWT Authorizer |
| Cost         | $3.50 / 1M req | $1.00 / 1M req |
| Features     | Full           | Lightweight    |

JWT 検証のみのシンプルな構成のため HTTP API を採用。

> **CORS が不要な理由:** CloudFront のマルチオリジン構成により、フロントエンド (S3) と API (API Gateway) が同一ドメイン (`xxxx.cloudfront.net`) で配信される。ブラウザから見て Same-Origin のため、CORS ヘッダーや OPTIONS プリフライトが発生しない。API Gateway 側の CORS 設定 (`allowOrigins` 等) も不要。

---

### 4. Lambda

単一 Lambda で全ルートを処理。Lambda 内でパス + メソッドによるルーティング。

| Item          | Value                                               |
| ------------- | --------------------------------------------------- |
| Function Name | `bananadrop-api`                                    |
| Runtime       | Node.js 22.x                                        |
| Memory        | 128MB                                               |
| Timeout       | 10s                                                 |
| Env Vars      | `TABLE_NAME`                                        |
| IAM           | DynamoDB `GetItem` / `PutItem` / `Query` (GSI 含む) |
| Logs          | `/aws/lambda/bananadrop-api`, retention 30d         |

**Endpoints:**

```
GET  /api/save                     -> GetItem (sub をキーに gameState 取得)
POST /api/save  body:{ gameState } -> PutItem (gameState 保存)
GET  /api/leaderboard              -> GSI Query (ランキング上位 N 件)
```

JWT claims からユーザー識別: `event.requestContext.authorizer.jwt.claims.sub`

---

### 5. DynamoDB

#### Design Principles

- **Single Table Design** - 1 テーブルで全データを管理
- **Save Slots** - 現在は 1 スロット (`SAVE#01`)。将来 3 スロットに拡張予定
- **Schema Versioning** - `schemaVersion` でマイグレーション分岐を可能に
- **Leaderboard** - GSI で追加テーブルなしにランキング機能を実現

#### Table: `bananadrop`

| Item          | Value                       |
| ------------- | --------------------------- |
| Table Name    | `bananadrop`                |
| Capacity      | On-Demand (PAY_PER_REQUEST) |
| Partition Key | `pk` (String)               |
| Sort Key      | `sk` (String)               |

#### Save Record

```
pk: "USER#<cognito_sub>"
sk: "SAVE#01"
```

| Attribute        | Type   | Example        | Description    |
| ---------------- | ------ | -------------- | -------------- |
| `pk`             | String | `USER#abc-123` | Cognito sub    |
| `sk`             | String | `SAVE#01`      | Slot number    |
| `userName`       | String | `バナナ太郎`   | Display name   |
| `score`          | Number | `15000`        | GSI SK         |
| `leaderboardKey` | String | `GLOBAL`       | GSI PK         |
| `gameState`      | Map    | see below      | Game state     |
| `schemaVersion`  | String | `1`            | Schema version |
| `createdAt`      | String | ISO 8601       | First save     |
| `updatedAt`      | String | ISO 8601       | Last save      |

**gameState example:**

```json
{
  "totalScore": 15000,
  "highScore": 20000,
  "upgrades": {
    "clickPower": 3,
    "autoSpawn": 2
  },
  "unlockedTiers": [1, 2, 3]
}
```

#### GSI: `leaderboard-index`

| Attribute        | Role   | Value              |
| ---------------- | ------ | ------------------ |
| `leaderboardKey` | GSI PK | `GLOBAL`           |
| `score`          | GSI SK | Score (descending) |

**Projection: INCLUDE** - `userName` のみ追加。`pk`, `sk`, `leaderboardKey`, `score` は自動含有。

#### Access Patterns

| Operation     | Method                                                      |
| ------------- | ----------------------------------------------------------- |
| Save (upsert) | PutItem `pk=USER#<sub>` `sk=SAVE#01`                        |
| Load save     | GetItem `pk=USER#<sub>` `sk=SAVE#01`                        |
| List slots    | Query `pk=USER#<sub>` `sk begins_with SAVE#`                |
| Leaderboard   | GSI Query `leaderboardKey=GLOBAL` `ScanIndexForward: false` |

---

### 6. Terraform State Management

S3 リモートバックエンド + **S3 ネイティブロック** を採用。
DynamoDB によるロックテーブルは不要。

#### Background

Terraform 1.10 で S3 バックエンドにネイティブステートロック機能 (`use_lockfile = true`) が追加された。
S3 の **conditional writes** (ETag ベースの条件付き PUT) を利用し、`.tflock` ファイルで排他制御を行う。
これにより、従来必要だった DynamoDB ロックテーブルが不要になった。

> **Note:** `dynamodb_table` パラメータは Terraform 1.10+ で非推奨。新規プロジェクトでは `use_lockfile = true` を使用すること。

#### Configuration

```hcl
# backend.tf
terraform {
  required_version = ">= 1.10"

  backend "s3" {
    bucket       = "bananadrop-tfstate"
    key          = "bananadrop/terraform.tfstate"
    region       = "ap-northeast-1"
    encrypt      = true
    use_lockfile = true   # S3 native locking (no DynamoDB needed)
  }
}
```

#### Required IAM Permissions

State file + lock file 操作に必要な権限:

- `s3:GetObject` - state/lock ファイルの読み取り
- `s3:PutObject` - state/lock ファイルの書き込み (conditional writes)
- `s3:DeleteObject` - lock ファイルの削除
- `s3:ListBucket` - バケット内のオブジェクト一覧

対象: `bananadrop-tfstate/bananadrop/terraform.tfstate` および `*.tflock`

#### Notes

- `.tflock` はクラッシュ時に残る可能性がある -> `terraform force-unlock` で解除
- S3 バージョニングを有効にして state recovery に備える
- **このバケットは Terraform 管理外で先に手動作成する (bootstrap)**

---

### 7. CI/CD (GitHub Actions + Terraform)

#### Design Principles

- Lambda コードも Terraform 経由でデプロイ
- AWS リソースの変更はすべて `terraform apply` で完結
- AWS 認証は OIDC federation (IAM ロール AssumeRole)

#### Directory Structure

```
bananadrop/
├── infra/                    # Terraform (Lambda コード含む)
│   ├── backend.tf
│   ├── main.tf
│   ├── variables.tf
│   └── lambda/               # Lambda handler source
│       ├── save.js
│       └── package.json
├── src/                      # Frontend (existing)
└── .github/workflows/
    ├── infra.yml             # infra/** 変更時
    └── deploy.yml            # src/** 等変更時
```

Lambda デプロイ: Terraform `archive_file` data source で `infra/lambda/` を zip 化 -> `aws_lambda_function` で一括デプロイ。

#### infra.yml (AWS Resources + Lambda)

**Trigger:** `infra/**` への push

```
1. terraform init
2. terraform plan
3. (main merge 時のみ) terraform apply -auto-approve
```

#### deploy.yml (Frontend)

**Trigger:** フロントエンドビルドに影響するファイルへの push

```yaml
paths:
  - 'src/**'
  - 'public/**'
  - 'index.html'
  - 'package.json'
  - 'package-lock.json'
  - 'vite.config.js'
```

```
1. npm ci
2. npm run build
3. aws s3 sync dist/ s3://<bucket> --delete
4. aws cloudfront create-invalidation --paths "/*"
```

#### AWS Authentication (OIDC)

- GitHub OIDC プロバイダーを AWS IAM に登録
- `infra.yml` 用と `deploy.yml` 用にそれぞれ IAM ロールを作成 (最小権限)
- `aws-actions/configure-aws-credentials` で AssumeRole

---

## Cost Estimate

### Monthly (Active Users ~100)

| Service     | Usage                       | Cost               |
| ----------- | --------------------------- | ------------------ |
| CloudFront  | ~1GB / ~50K req             | **$0** (free tier) |
| S3          | ~10MB / ~5K GET             | **$0** (free tier) |
| Cognito     | 100 users                   | **$0** (free tier) |
| API Gateway | ~1,500 req                  | **$0** (free tier) |
| Lambda      | ~1,500 exec / 128MB / ~0.1s | **$0** (free tier) |
| DynamoDB    | ~1,500 WCU + ~750 RCU       | **$0** (free tier) |
| **Total**   |                             | **~$0/mo**         |

---

## Future Considerations

### Custom Domain

現在は CloudFront デフォルトドメイン (`xxxx.cloudfront.net`) で運用。

| Service              | Cost         |
| -------------------- | ------------ |
| Route 53 Hosted Zone | $0.50/mo     |
| ACM Certificate      | $0           |
| Domain (.com)        | $10-15/yr    |
| **Additional**       | **~$1-2/mo** |

CORS `allowOrigins` の更新が必要。

### Other

- [ ] Environment separation (dev / prod)
- [ ] OAuth support (Google / GitHub)
- [ ] WAF
- [ ] CloudWatch Alarms
