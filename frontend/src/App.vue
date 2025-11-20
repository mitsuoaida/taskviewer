<script setup>
import { ref } from 'vue'

const workers = ref([
  { name: 'ワーカーA', value: 85, color: '#4CAF50' },
  { name: 'ワーカーB', value: 72, color: '#2196F3' },
  { name: 'ワーカーC', value: 93, color: '#FF9800' },
  { name: 'ワーカーD', value: 68, color: '#E91E63' },
  { name: 'ワーカーE', value: 79, color: '#9C27B0' },
  { name: 'ワーカーF', value: 88, color: '#00BCD4' }
])

const maxValue = ref(100)

const getBarHeight = (value) => {
  return `${(value / maxValue.value) * 100}%`
}
</script>

<template>
  <div class="dashboard">
    <div class="header">
      <h1>📊 ワーカー作業量ダッシュボード</h1>
      <p class="subtitle">各ワーカーの作業実績を表示</p>
    </div>

    <div class="chart-container">
      <div class="chart">
        <div class="y-axis">
          <div class="y-label">100</div>
          <div class="y-label">75</div>
          <div class="y-label">50</div>
          <div class="y-label">25</div>
          <div class="y-label">0</div>
        </div>
        
        <div class="bars-container">
          <div 
            v-for="worker in workers" 
            :key="worker.name" 
            class="bar-wrapper"
          >
            <div class="bar-content">
              <div class="bar-value">{{ worker.value }}</div>
              <div 
                class="bar" 
                :style="{ 
                  height: getBarHeight(worker.value),
                  backgroundColor: worker.color 
                }"
              >
                <div class="bar-animation"></div>
              </div>
            </div>
            <div class="bar-label">{{ worker.name }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">{{ workers.length }}</div>
        <div class="stat-label">総ワーカー数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ Math.round(workers.reduce((sum, w) => sum + w.value, 0) / workers.length) }}</div>
        <div class="stat-label">平均作業量</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ Math.max(...workers.map(w => w.value)) }}</div>
        <div class="stat-label">最大作業量</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.chart-container {
  max-width: 1000px;
  margin: 0 auto 40px;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.chart {
  display: flex;
  align-items: flex-end;
  height: 400px;
  position: relative;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin-right: 20px;
  padding: 10px 0;
}

.y-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.bars-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  flex: 1;
  height: 100%;
  border-left: 2px solid #ddd;
  border-bottom: 2px solid #ddd;
  padding: 10px 20px 0;
  position: relative;
}

.bars-container::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 25%;
  width: 100%;
  height: 1px;
  background: #eee;
}

.bars-container::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 50%;
  width: 100%;
  height: 1px;
  background: #eee;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  max-width: 120px;
}

.bar-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  width: 100%;
  position: relative;
}

.bar-value {
  position: absolute;
  top: -30px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.bar {
  width: 60px;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: growUp 1s ease-out;
}

.bar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.bar-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes growUp {
  from {
    height: 0;
  }
  to {
    height: 100%;
  }
}

@keyframes shimmer {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(-100%);
  }
}

.bar-label {
  margin-top: 15px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #555;
  text-align: center;
}

.stats {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 1.8rem;
  }
  
  .chart-container {
    padding: 20px;
  }
  
  .chart {
    height: 300px;
  }
  
  .bar {
    width: 40px;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
