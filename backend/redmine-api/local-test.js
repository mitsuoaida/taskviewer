import 'dotenv/config'; // dotenv を使って .env ファイルから環境変数を読み込む
import { fetchIssuesUpdatedTodayByUser } from "./src/fetchUpdatedToday.js";

(async () => {
  const targetUserId = Number(process.env.DEFAULT_TARGET_USER_ID);   // 「更新者」として判定したい Redmine ユーザーID
  const projectId    = undefined; // プロジェクトで絞るならIDを入れる

  const issues = await fetchIssuesUpdatedTodayByUser(targetUserId, projectId, undefined);
  console.log(`Found ${issues.length} issues updated today by user ${targetUserId}`);
  for (const i of issues) {
    console.log(`#${i.id} [${i.project_name}] [${i.status?.name}] ${i.subject} (${i.url})`);
  }
})();
