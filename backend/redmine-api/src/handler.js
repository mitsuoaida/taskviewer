const axios = require('axios');

exports.handler = async (event) => {
  const issueId = event.pathParameters?.id;

  const url = `https://works.freemind.co.jp/redmine/issues/${issueId}.json`;

  // BASIC 認証のユーザー名とパスワードをエンコード
  const basicAuth = Buffer.from(
    `${process.env.BASIC_USER}:${process.env.BASIC_PASSWORD}`
  ).toString("base64");

  const res = await axios.get(url, {
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "X-Redmine-API-Key": process.env.REDMINE_API_KEY
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(res.data),
    headers: { "Content-Type": "application/json" }
  };
};
