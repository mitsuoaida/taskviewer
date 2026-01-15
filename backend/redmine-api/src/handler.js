import { fetchIssuesUpdatedTodayByUser } from "./fetchUpdatedToday.js";
import { fetchUsers } from "./fetchUsers.js";

export const handler = async (event) => {
  try {
    // パスから /users エンドポイントかどうか判定
    const path = event.rawPath || event.path || "";
    
    // /users エンドポイント
    if (path.includes("/users")) {
      const users = await fetchUsers();
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(users),
      };
    }

    // 既存の /issues エンドポイント（デフォルト）
    const qs = event.queryStringParameters || {};
    const userId = Number(qs.user_id || 0);
    const projectId = qs.project_id ? Number(qs.project_id) : undefined;

    const issues = await fetchIssuesUpdatedTodayByUser(userId, projectId);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(issues),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
