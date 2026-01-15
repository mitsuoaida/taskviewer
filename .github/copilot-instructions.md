# TaskViewer プロジェクト - GitHub Copilot 指示書

## プロジェクト概要
Redmineで今日更新されたチケットを特定ユーザー別に表示するWebアプリケーション。
AWS上にデプロイされ、フロントエンドはS3/CloudFront、バックエンドはLambda/HTTP APIで構成。

## 技術スタック

### フロントエンド (`/frontend`)
- **フレームワーク**: Vue.js 3.5 (Composition API)
- **ビルドツール**: Vite 7.1
- **言語**: JavaScript (ES Modules)
- **スタイル**: Scoped CSS (グラデーション、レスポンシブデザイン)
- **ホスティング**: AWS S3 + CloudFront

### バックエンド (`/backend/redmine-api`)
- **ランタイム**: Node.js 22 (ES Modules)
- **フレームワーク**: AWS Lambda (HTTP API)
- **主要ライブラリ**: 
  - axios: Redmine API呼び出し
  - express/cors: ローカル開発用
- **言語**: JavaScript (ES Modules)

### インフラ (`/infra`)
- **IaC**: AWS CloudFormation
- **CI/CD**: AWS CodeBuild (buildspec.yml)
- **デプロイ先**: AWS Lambda, S3, CloudFront, HTTP API Gateway

## アーキテクチャ

```
[ユーザー] 
    ↓ (HTTPS)
[CloudFront/S3] (静的ホスティング)
    ↓ (API呼び出し)
[HTTP API Gateway]
    ↓
[Lambda Function] ← (環境変数: REDMINE_BASE_URL, REDMINE_API_KEY, BASIC_USER/PASSWORD)
    ↓ (Redmine REST API)
[Redmine サーバー] (Basic認証対応)
```

## コーディング規約

### 共通ルール
- **モジュール形式**: ES Modules (`import/export`)を使用
- **Node.jsバージョン**: 22.x (package.jsonのenginesに指定)
- **コメント**: 複雑なロジックには日本語でコメントを記載

### フロントエンド規約
- **Vue.js**: 
  - Composition APIの`<script setup>`構文を使用
  - `ref`/`onMounted`等の組み込み関数を活用
- **スタイル**:
  - `scoped`属性を必ず付与
  - レスポンシブデザイン対応（モバイル: 480px以下、タブレット: 768px以下）
  - グラデーション背景 (`linear-gradient`) を積極的に使用
  - ホバーエフェクトで視覚的フィードバックを提供
- **環境変数**: `import.meta.env.VITE_*` でアクセス
- **エラーハンドリング**: try-catchでエラーをキャッチし、UIに表示

### バックエンド規約
- **Lambda関数**:
  - `handler`関数は必ず`async`
  - イベント形式: HTTP API (`event.queryStringParameters`)
  - レスポンス形式: `{ statusCode, headers, body }`
- **Redmine API連携**:
  - axiosクライアントでタイムアウト設定 (20秒)
  - API Key認証 + Basic認証の両対応
  - ページネーション処理 (100件ずつ取得)
  - ジャーナル詳細取得で並行処理 (concurrency: 5)
- **日付処理**:
  - ローカルタイムゾーンで「今日」を判定
  - `YYYY-MM-DD`形式で文字列化
- **エラーハンドリング**:
  - 環境変数チェック（REDMINE_BASE_URL, REDMINE_API_KEY必須）
  - try-catchで500エラーレスポンス
- **新規redmine-api/srcモジュール追加時の命名規則**:
  - 動詞的命名 (例: fetchUpdatedToday.js)
  - backend/redmine-api/src/配下に配置
  - backend/redmine-api/配下にlocal-[モジュール名].jsで単体テストコードを作成可能

### インフラ規約
- **CloudFormation**:
  - パラメータは明示的にデフォルト値を設定
  - 機密情報 (API Key, パスワード) は `NoEcho: true`
- **CodeBuild**:
  - Node.js 22を使用
  - S3同期時のキャッシュ制御: 静的アセットは1年、index.htmlはno-cache
  - CloudFront無効化は`DISTRIBUTION_ID`が設定されている場合のみ

## ファイル構成

```
taskviewer/
├── buildspec.yml              # CodeBuild設定
├── frontend/                  # フロントエンド
│   ├── src/
│   │   ├── App.vue           # メインコンポーネント
│   │   └── main.js           # エントリーポイント
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/                   # バックエンド
│   └── redmine-api/
│       ├── index.js          # Lambda エントリー
│       ├── server.js         # ローカル開発用Expressサーバー
│       ├── package.json
│       └── src/
│           ├── handler.js    # Lambda ハンドラー
│           └── fetchUpdatedToday.js  # Redmine API呼び出しロジック
└── infra/                     # インフラコード
    ├── cloudfront-s3-tokyo.yml
    └── redmine-api-http.yml
```
### 変数名
* キャメルケース (`camelCase`) を使用してください。
例: `userName`, `orderId`
* 短縮形は避けてください。
例: `usrNm` (X) -> `userName` (O)
* 定数には全て大文字のスネークケース (`SNAKE_CASE`) を使用してください。
例: `MAX_RETRIES`, `DEFAULT_TIMEOUT`

### 関数名
* 動詞から始め、キャメルケース (`camelCase`) を使用してください。
例: `getUserProfile`, `calculateTotalPrice`
* 関数が何を行うか明確にわかるように命名してください。

### クラス名
* パスカルケース (`PascalCase`) を使用してください。
例: `UserService`, `ProductRepository`

### コメント
* 複雑なロジックや意図が分かりにくい箇所には、JSDoc形式のコメントを記述してください。
* TODOコメントは、対応が完了したら削除してください。

### インデント
* スペース2つを使用してください。

### その他
* マジックナンバーは使用せず、定数として定義してください。
* エラーハンドリングを適切に行ってください。
* ログ出力は、プロダクション環境では冗長にならないように注意してください。

## 主要機能

### 1. 今日更新されたチケット取得 (fetchUpdatedToday.js)
- Redmine APIで`updated_on`範囲検索 (今日0:00～明日0:00)
- 各チケットの`journals`を取得し、指定ユーザーによる今日の更新を判定
- 並行処理で複数チケット詳細を効率的に取得 (concurrency: 5)

### 2. フロントエンド表示 (App.vue)
- URLパラメータ`user_id`でユーザー指定 (デフォルト: 30)
- グリッドレイアウトでカード表示 (300px minimum width)
- チケットIDとタイトルをRedmineへのリンクとして表示
- ローディング/エラー状態をUI表示

### 3. デプロイメント (buildspec.yml, CloudFormation)
- CodeBuildでViteビルド → S3同期 → CloudFront無効化
- Lambda関数にRedmine接続情報を環境変数で注入
- HTTP API GatewayでCORS設定済み

## 新機能追加時の指針

### フロントエンド機能追加
1. `App.vue`にコンポーネントを追加 (または新規.vueファイル作成)
2. Composition APIで`ref`/`computed`を活用
3. レスポンシブデザインを考慮したCSS追加
4. 環境変数が必要な場合は`VITE_`プレフィックスで定義

### バックエンド機能追加
1. `src/`ディレクトリに新規モジュール追加
2. `handler.js`でクエリパラメータ/パスパラメータを処理
3. Redmine API呼び出しは`axios`クライアントを再利用
4. エラーハンドリングとログ出力を忘れずに

### インフラ変更
1. CloudFormationテンプレートを編集
2. パラメータ追加時はデフォルト値を設定
3. Lambda環境変数はテンプレート経由で注入
4. 変更後はスタック更新でデプロイ

## 環境変数

### フロントエンド (.env)
```bash
VITE_API_BASE_URL=<HTTP API Gateway URL>
```

### バックエンド (Lambda環境変数)
```bash
REDMINE_BASE_URL=<Redmine URL>
REDMINE_API_KEY=<Redmine API Key>
BASIC_USER=<Basic認証ユーザー名> (任意)
BASIC_PASSWORD=<Basic認証パスワード> (任意)
```

### CodeBuild (環境変数)
```bash
S3_BUCKET_NAME=<デプロイ先S3バケット>
DISTRIBUTION_ID=<CloudFront Distribution ID> (任意)
AWS_DEFAULT_REGION=ap-northeast-1
```

## テスト・デバッグ

### ローカル開発
- **フロントエンド**: `cd frontend && npm run dev` (Vite開発サーバー)
- **バックエンド**: `cd backend/redmine-api && node server.js` (Express)
  - `.env`ファイルにRedmine接続情報を設定

### デプロイ確認
- CodeBuildログで各フェーズの成功/失敗を確認
- CloudFrontアクセスでフロントエンドの表示確認
- HTTP API直接呼び出しでバックエンドのレスポンス確認

## 注意事項
- Redmine API Keyは絶対にコミットしない (CloudFormationパラメータで渡す)
- Basic認証は任意 (環境変数が空の場合はスキップ)
- 大量のチケットがある場合、並行処理数を調整 (fetchUpdatedToday.js)
- S3キャッシュ戦略: 静的アセットは長期キャッシュ、HTMLは毎回検証
