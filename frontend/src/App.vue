<script setup>
import { ref, onMounted } from "vue";

const issues = ref([]);
const error = ref("");

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}?user_id=30`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    issues.value = await res.json();
  } catch (e) {
    error.value = e.message;
  }
});
</script>

<template>
  <div class="app-container">
    <div class="content-wrapper">
      <header class="app-header">
        <h1 class="title">📋 今日更新されたチケット一覧</h1>
      </header>
      
      <div v-if="error" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ error }}</span>
      </div>
      
      <div v-else-if="issues.length === 0" class="loading">
        読み込み中...
      </div>
      
      <div v-else class="issues-container">
        <div class="issue-card" v-for="i in issues" :key="i.id">
          <div class="issue-header">
            <span class="issue-id">#{{ i.id }}</span>
          </div>
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
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.5px;
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

.issues-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

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
  
  .issues-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .issue-card {
    padding: 1rem;
  }
}
</style>
