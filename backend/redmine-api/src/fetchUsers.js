// ESM 前提（package.json に "type": "module"）
import axios from "axios";

/**
 * Redmine から環境変数 STAFF_USER_IDS で指定されたユーザーの情報を取得する
 * 
 * 環境変数:
 *   STAFF_USER_IDS: string
 *   REDMINE_BASE_URL: string
 *   REDMINE_API_KEY: string
 *   BASIC_USER: string (任意)
 *   BASIC_PASSWORD: string (任意)
 * 
 * 返値:
 *   users: Array<{ id, firstname, lastname, login }>
 */
export async function fetchUsers() {
  const baseUrl = process.env.REDMINE_BASE_URL;
  if (!baseUrl) throw new Error("REDMINE_BASE_URL is not set");
  
  const apiKey = process.env.REDMINE_API_KEY;
  if (!apiKey) throw new Error("REDMINE_API_KEY is not set");

  const staffUserIds = process.env.STAFF_USER_IDS;
  if (!staffUserIds) throw new Error("STAFF_USER_IDS is not set");

  const basicUser = process.env.BASIC_USER || "";
  const basicPass = process.env.BASIC_PASSWORD || "";
  const needBasic = basicUser && basicPass;

  const client = axios.create({
    baseURL: baseUrl.replace(/\/+$/, ""),
    headers: {
      "X-Redmine-API-Key": apiKey,
      ...(needBasic
        ? { Authorization: "Basic " + Buffer.from(`${basicUser}:${basicPass}`).toString("base64") }
        : {}),
    },
    timeout: 20000,
  });

  // STAFF_USER_IDs をカンマ区切りで配列に変換
  const userIds = staffUserIds.split(",").map(id => id.trim()).filter(Boolean);

  // 各ユーザー情報を並行取得
  const userPromises = userIds.map(async (userId) => {
    try {
      const res = await client.get(`/users/${userId}.json`);
      const user = res.data?.user;
      if (!user) return null;

      return {
        id: user.id,
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        login: user.login || "",
      };
    } catch (error) {
      console.error(`Failed to fetch user ${userId}:`, error.message);
      return null;
    }
  });

  const users = await Promise.all(userPromises);
  
  // null を除外して返す
  return users.filter(user => user !== null);
}
