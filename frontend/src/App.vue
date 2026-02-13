<script setup>
import { ref, onMounted } from "vue";

const issues = ref([]);
const error = ref("");
const users = ref([]);
const selectedUserId = ref(null);
const loading = ref(false);

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * プロジェクト名から一意の背景色を生成
 * HSL色空間を使用して視認性の良い色を生成
 */
const getProjectColor = (projectName) => {
  if (!projectName) return 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf2 100%)';
  
  // プロジェクト名からハッシュ値を生成
  let hash = 0;
  for (let i = 0; i < projectName.length; i++) {
    hash = projectName.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // 32bit整数に変換
  }
  
  // ハッシュ値から色相(Hue)を生成 (0-360)
  const hue = Math.abs(hash % 360);
  
  // 彩度と明度を固定して読みやすい色に
  // 薄めの背景色用に彩度を低め、明度を高めに設定
  const saturation = 65;
  const lightness1 = 92;
  const lightness2 = 85;
  
  return `linear-gradient(135deg, hsl(${hue}, ${saturation}%, ${lightness1}%) 0%, hsl(${hue}, ${saturation}%, ${lightness2}%) 100%)`;
};

/**
 * ユーザー一覧を取得
 */
const fetchUsers = async () => {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    users.value = await res.json();
  } catch (e) {
    console.error("ユーザー取得エラー:", e.message);
  }
};

/**
 * チケットを取得
 */
const fetchIssues = async (userId) => {
  if (!userId) {
    issues.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const res = await fetch(`${API_BASE}?user_id=${userId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    issues.value = await res.json();
    error.value = "";
  } catch (e) {
    error.value = e.message;
    issues.value = [];
  } finally {
    loading.value = false;
  }
};

/**
 * ユーザー選択時の処理
 */
const onUserChange = () => {
  fetchIssues(selectedUserId.value);
};

onMounted(async () => {
  // 初回アクセス時にユーザー一覧を取得
  await fetchUsers();
});
</script>

<template>
  <div class="app-container">
    <div class="content-wrapper">
      <header class="app-header">
        <h1 class="title">📋 今日更新されたチケット一覧</h1>
        
        <!-- ユーザー選択プルダウン -->
        <div class="user-select-container">
          <label for="user-select" class="user-select-label">👤 ユーザー選択:</label>
          <select 
            id="user-select" 
            v-model="selectedUserId" 
            @change="onUserChange"
            class="user-select"
          >
            <option :value="null">-- ユーザーを選択してください --</option>
            <option 
              v-for="user in users" 
              :key="user.id" 
              :value="user.id"
            >
              {{ user.lastname }} {{ user.firstname }} ({{ user.login }})
            </option>
          </select>
        </div>
      </header>
      
      <div v-if="error" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ error }}</span>
      </div>
      
      <div v-else-if="!selectedUserId" class="placeholder">
        ユーザーを選択してください
      </div>
      
      <div v-else-if="loading" class="loading">
        読み込み中...
      </div>
      
      <div v-else-if="issues.length === 0" class="empty-message">
        更新されたチケットはありません
      </div>
      
      <div v-else class="issues-container">
        <div class="issue-card" 
             v-for="i in issues" 
             :key="i.id"
             :style="{ background: getProjectColor(i.project_name) }">
          <div class="issue-header">
            <span class="issue-id">#{{ i.id }}</span>
          </div>
          <div class="project-name">{{ i.project_name }}</div>
          <a :href="i.url" target="_blank" class="issue-link">
            {{ i.subject }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.app-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 3px solid #667eea;
}

.title {
  font-size: 2rem;
  color: #5a4d8f;
  margin: 0 0 1.5rem 0;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.user-select-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.user-select-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #5a4d8f;
}

.user-select {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: 2px solid #667eea;
  border-radius: 8px;
  background: white;
  color: #2d3748;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 300px;
  font-weight: 500;
}

.user-select:hover {
  border-color: #764ba2;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}

.user-select:focus {
  outline: none;
  border-color: #764ba2;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.placeholder {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #667eea;
  font-weight: 600;
}

.error-message {
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(238, 90, 111, 0.3);
}

.error-icon {
  font-size: 1.5rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #667eea;
  font-weight: 600;
}

.empty-message {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #718096;
  font-weight: 600;
}

.issues-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}/* background色は動的に設定されます */

.issue-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.issue-card:hover {
  transform: translateY(-4px);
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
}

.issue-header {
  margin-bottom: 0.75rem;
}

.issue-id {
  display: inline-block;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.project-name {
  font-weight: 700;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  letter-spacing: 0.3px;
}

.issue-link {
  display: block;
  color: #2d3748;
  text-decoration: none;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 500;
  transition: color 0.2s ease;
}

.issue-link:hover {
  color: #667eea;
}

/* タブレット */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 1.5rem;
    border-radius: 15px;
  }
  
  .title {
    font-size: 1.6rem;
  }

  .user-select-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .user-select {
    min-width: 100%;
  }
  
  .issues-container {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
}

/* モバイル */
@media (max-width: 480px) {
  .app-container {
    padding: 0.5rem;
  }
  
  .content-wrapper {
    padding: 1rem;
    border-radius: 10px;
  }
  
  .title {
    font-size: 1.3rem;
  }

  .user-select-label {
    font-size: 1rem;
  }

  .user-select {
    min-width: 100%;
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  
  .issues-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .issue-card {
    padding: 1rem;
  }
}
</style>
