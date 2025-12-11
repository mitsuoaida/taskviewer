import { fetchIssuesUpdatedTodayByUser } from "./fetchUpdatedToday.js";

export const handler = async (event) => {
  try {
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
