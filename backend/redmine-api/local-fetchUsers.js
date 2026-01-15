// ローカルテスト用
// 使い方: node ./local-fetchUsers.js

import "dotenv/config";
import { fetchUsers } from "./src/fetchUsers.js";

(async () => {
  try {
    console.log("=== fetchUsers ローカルテスト開始 ===");
    console.log("環境変数チェック:");
    console.log("  REDMINE_BASE_URL:", process.env.REDMINE_BASE_URL || "(未設定)");
    console.log("  REDMINE_API_KEY:", process.env.REDMINE_API_KEY ? "***" : "(未設定)");
    console.log("  STAFF_USER_IDS:", process.env.STAFF_USER_IDS || "(未設定)");
    console.log("  BASIC_USER:", process.env.BASIC_USER || "(未設定)");
    console.log("");

    const users = await fetchUsers();

    console.log(`取得したユーザー数: ${users.length}`);
    console.log("ユーザー一覧:");
    users.forEach(user => {
      console.log(`  - ID: ${user.id}, 名前: ${user.lastname} ${user.firstname}, ログイン: ${user.login}`);
    });

    console.log("\n=== テスト完了 ===");
  } catch (error) {
    console.error("❌ エラー:", error.message);
    process.exit(1);
  }
})();
