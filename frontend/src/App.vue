<script setup>
import { ref, onMounted } from "vue";

const issues = ref([]);
const error = ref("");

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

onMounted(async () => {
  try {
    const res = await fetch(`${API_BASE}/api/issues?user_id=30`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    issues.value = await res.json();
  } catch (e) {
    error.value = e.message;
  }
});
</script>

<template>
  <div>
    <h2>今日更新されたチケット一覧</h2>
    <div v-if="error">⚠️ {{ error }}</div>
    <ul>
      <li v-for="i in issues" :key="i.id">
        <a :href="i.url" target="_blank">#{{ i.id }} - {{ i.subject }}</a>
      </li>
    </ul>
  </div>
</template>
