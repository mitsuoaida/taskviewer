// ESM 前提（package.json に "type": "module"）
import axios from "axios";

/**
 * Redmine で「今日更新されたチケット」を取得し、
 * その中から「updated_by == targetUserId」のものだけを返す。
 *
 * 引数:
 *   targetUserId: number  … 更新者（ジャーナルの user.id）
 *   projectId?: number    … プロジェクトを絞りたい場合（任意）
 *   config?: object       … Redmine接続設定
 *     - baseUrl: string (デフォルト: process.env.REDMINE_BASE_URL)
 *     - apiKey: string (デフォルト: process.env.REDMINE_API_KEY)
 *     - basicUser?: string (デフォルト: process.env.BASIC_USER)
 *     - basicPassword?: string (デフォルト: process.env.BASIC_PASSWORD)
 *
 * 返値:
 *   issues: Array<{ id, subject, updated_on, project_name, ... }>
 */
export async function fetchIssuesUpdatedTodayByUser(targetUserId, projectId) {
  const baseUrl = process.env.REDMINE_BASE_URL;
  if (!baseUrl) throw new Error("REDMINE_BASE_URL is not set");
  
  const apiKey = process.env.REDMINE_API_KEY;
  if (!apiKey) throw new Error("REDMINE_API_KEY is not set");

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
    // タイムアウトは適宜
    timeout: 20000,
  });

  // --- 「今日」の日付範囲（ローカル日付ベース） ---
  // 例: 2025-11-21 の 0:00 ～ 2025-11-22 の 0:00
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const today = `${yyyy}-${mm}-${dd}`;

  const tomorrowDate = new Date(now);
  tomorrowDate.setDate(now.getDate() + 1);
  const yyyy2 = tomorrowDate.getFullYear();
  const mm2 = String(tomorrowDate.getMonth() + 1).padStart(2, "0");
  const dd2 = String(tomorrowDate.getDate()).padStart(2, "0");
  const tomorrow = `${yyyy2}-${mm2}-${dd2}`;

  // Redmineの一覧APIは updated_on に範囲指定ができる（><from|to）
  // URLエンコードすると %3E%3Cfrom|to
  const updatedRange = `><${today}|${tomorrow}`;

  // ページングしながら「今日更新されたチケット」を集める
  const pageLimit = 100;
  let offset = 0;
  const todaysIssues = [];

  while (true) {
    const params = {
      offset,
      limit: pageLimit,
      updated_on: updatedRange,
      // 必要ならプロジェクトで絞る
      ...(projectId ? { project_id: projectId } : {}),
      // fieldsを増やしたいなら include=attachments,relations など（一覧では journals は不可）
    };

    const res = await client.get("/issues.json", { params });
    const { issues = [], total_count = 0 } = res.data || {};
    todaysIssues.push(...issues);

    offset += issues.length;
    if (offset >= total_count || issues.length === 0) break;
  }

  // ここから「更新者」を journals で判定する
  // 複数呼び出しになるので、必要に応じて並列数を抑える
  const concurrency = 5;
  const queue = todaysIssues.slice();
  const result = [];

  const worker = async () => {
    while (queue.length) {
      const issue = queue.shift();
      try {
        const detail = await client.get(`/issues/${issue.id}.json`, {
          params: { include: "journals" },
        });
        const full = detail.data?.issue;

        // journals の中で「今日」かつ「user.id == targetUserId」があるか確認
        const hit = (full.journals || []).some((j) => {
          if (!j.user || !j.created_on) return false;
          // created_on は "2025-11-21T08:12:32Z" のような形式
          const dt = new Date(j.created_on);
          const dY = dt.getFullYear();
          const dM = String(dt.getMonth() + 1).padStart(2, "0");
          const dD = String(dt.getDate()).padStart(2, "0");
          const dStr = `${dY}-${dM}-${dD}`;
          return j.user.id === Number(targetUserId) && dStr === today;
        });

        if (hit) {
          result.push({
            id: full.id,
            subject: full.subject,
            updated_on: full.updated_on,
            project: full.project,
            project_name: full.project?.name || '',
            tracker: full.tracker,
            status: full.status,
            assigned_to: full.assigned_to,
            author: full.author,
            url: `${baseUrl.replace(/\/+$/, "")}/issues/${full.id}`,
          });
        }
      } catch (e) {
        // 必要ならログ
        // console.error("Failed to fetch issue detail", issue.id, e.message);
      }
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  // 例として updated_on 降順で返す
  return result.sort((a, b) => new Date(b.updated_on) - new Date(a.updated_on));
}
