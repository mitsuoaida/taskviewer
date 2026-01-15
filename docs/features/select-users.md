# 機能名: ユーザープルダウン追加

## 概要
特定のユーザーのタスクを見れるようにする為、画面にユーザー選択プルダウンを作成する

## 変更範囲
- [◯] フロントエンド (frontend/src/App.vue)
- [◯] バックエンド (backend/redmine-api/src/handler.js)
- [◯] バックエンド (backend/redmine-api/src/fetchUsers.js)
- [◯] バックエンド (backend/redmine-api/local-fetchUsers.js)

## 仕様
### UI
- 初回アクセス時にredmineのユーザー取得APIよりユーザーの一覧を取得する
- 初回アクセス時はユーザー選択プルダウンで誰も選択されていない

### API
- 選択できるユーザーは、Lambdaの環境変数 STAFF_USER_IDS のユーザーIDに一致するユーザーを取得する
- ローカルテスト用の単体テスト用ファイルは必ず作成する

## 参考
- Redmine API: /users.json