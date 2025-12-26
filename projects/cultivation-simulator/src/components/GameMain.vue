<template>
  <div class="game-main">
    <div class="game-header">
      <h1 class="game-title">修仙宗门模拟器</h1>
      <div class="game-controls">
        <button class="btn btn-primary" @click="handleNextTick">下一回合</button>
        <button class="btn btn-secondary" @click="handleStartGame">重新开始</button>
      </div>
    </div>

    <div class="game-content">
      <!-- 左侧面板：资源和掌门信息 -->
      <div class="left-panel">
        <!-- 资源显示 -->
        <div class="panel">
          <h2 class="panel-title">宗门资源</h2>
          <div class="resources">
            <div class="resource-item">
              <span class="resource-label">灵石:</span>
              <span class="resource-value">{{ gameState.resources.spiritStones }}</span>
            </div>
            <div class="resource-item">
              <span class="resource-label">气运:</span>
              <span class="resource-value">{{ gameState.resources.fate }}</span>
            </div>
          </div>
        </div>

        <!-- 掌门信息 -->
        <div class="panel">
          <h2 class="panel-title">掌门信息</h2>
          <div class="leader-info">
            <div class="leader-name">{{ gameState.leader.name }}</div>
            <div class="leader-realm">{{ gameState.leader.realm }}</div>
            <div class="xp-bar-container">
              <div class="xp-bar" :style="{ width: `${leaderProgress}%` }"></div>
              <div class="xp-text">{{ gameState.leader.xp }} / {{ gameState.leader.maxXp }} 修为</div>
            </div>
            <button class="btn btn-primary mt-2" @click="handleLeaderCultivate">开始修行</button>
          </div>
        </div>
      </div>

      <!-- 中间面板：弟子管理 -->
      <div class="center-panel">
        <div class="panel">
          <h2 class="panel-title">弟子管理</h2>
          <div class="disciples-list">
            <div 
              v-for="disciple in gameState.disciples" 
              :key="disciple.id"
              class="disciple-item"
            >
              <div class="disciple-header">
                <div class="disciple-name">{{ disciple.name }}</div>
                <div class="disciple-state">{{ getStateText(disciple.state) }}</div>
              </div>
              <div class="disciple-stats">
                <div class="stat-item">
                  <span class="stat-label">心情:</span>
                  <div class="mood-bar-container">
                    <div class="mood-bar" :style="{ width: `${disciple.mood}%` }"></div>
                    <span class="stat-value">{{ disciple.mood }}</span>
                  </div>
                </div>
                <div class="stat-item">
                  <span class="stat-label">资质:</span>
                  <span class="stat-value">{{ disciple.talent }}</span>
                </div>
              </div>
              <div class="disciple-actions">
                <button 
                  class="btn btn-small btn-secondary" 
                  @click="handleAssignWork(disciple.id)"
                  :disabled="disciple.state === 'WORKING' || disciple.state === 'DERANGED'"
                >
                  安排工作
                </button>
                <button 
                  class="btn btn-small btn-primary" 
                  @click="handleSendExplore(disciple.id)"
                  :disabled="disciple.state === 'EXPLORING' || disciple.state === 'DERANGED'"
                >
                  派遣历练
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板：邮件和日志 -->
      <div class="right-panel">
        <!-- 邮件系统 -->
        <div class="panel">
          <h2 class="panel-title">
            宗门邮件
            <span v-if="unreadMailCount > 0" class="mail-badge">{{ unreadMailCount }}</span>
          </h2>
          <div class="mailbox">
            <div 
              v-for="mail in gameState.mailbox" 
              :key="mail.id"
              class="mail-item" 
              :class="{ 'mail-unread': !mail.read }"
              @click="handleReadMail(mail.id)"
            >
              <div class="mail-header">
                <span class="mail-title">{{ mail.title }}</span>
                <span class="mail-time">{{ formatTime(mail.timestamp) }}</span>
              </div>
              <div v-if="selectedMailId === mail.id" class="mail-content">
                {{ mail.content }}
              </div>
            </div>
            <div v-if="gameState.mailbox.length === 0" class="empty-message">
              暂无邮件
            </div>
          </div>
        </div>

        <!-- 日志系统 -->
        <div class="panel">
          <h2 class="panel-title">宗门日志</h2>
          <div class="logs-container">
            <div 
              v-for="(log, index) in gameState.logs.slice().reverse()" 
              :key="index"
              class="log-item"
            >
              {{ log }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGame } from '../composables/useGame';

const { gameState, dispatch, leaderProgress, unreadMailCount } = useGame();
const selectedMailId = ref<number | null>(null);

// 处理下一回合
const handleNextTick = () => {
  dispatch({ type: 'NEXT_TICK' });
};

// 处理重新开始游戏
const handleStartGame = () => {
  if (confirm('确定要重新开始游戏吗？当前进度将丢失！')) {
    dispatch({ type: 'START_GAME' });
  }
};

// 处理掌门修行
const handleLeaderCultivate = () => {
  dispatch({ type: 'LEADER_CULTIVATE' });
};

// 处理分配弟子工作
const handleAssignWork = (discipleId: number) => {
  dispatch({ type: 'ASSIGN_DISCIPLE_WORK', discipleId });
};

// 处理派遣弟子历练
const handleSendExplore = (discipleId: number) => {
  dispatch({ type: 'SEND_DISCIPLE_EXPLORE', discipleId });
};

// 处理阅读邮件
const handleReadMail = (mailId: number) => {
  dispatch({ type: 'READ_MAIL', mailId });
  selectedMailId.value = selectedMailId.value === mailId ? null : mailId;
};

// 获取状态文本
const getStateText = (state: string): string => {
  const stateMap: Record<string, string> = {
    'IDLE': '空闲',
    'WORKING': '工作中',
    'DERANGED': '走火入魔',
    'EXPLORING': '历练中'
  };
  return stateMap[state] || state;
};

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
};
</script>

<style scoped>
.game-main {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.game-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.game-controls {
  display: flex;
  gap: 10px;
}

.game-content {
  display: grid;
  grid-template-columns: 300px 1fr 350px;
  gap: 20px;
}

.panel {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.panel-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #2196F3;
  color: white;
}

.btn-secondary:hover {
  background-color: #0b7dda;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
}

/* 资源样式 */
.resources {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resource-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.resource-label {
  font-weight: bold;
  color: #555;
}

.resource-value {
  font-weight: bold;
  color: #4CAF50;
}

/* 掌门信息样式 */
.leader-info {
  text-align: center;
}

.leader-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.leader-realm {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.xp-bar-container {
  position: relative;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
}

.xp-bar {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.5s ease;
}

.xp-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  line-height: 20px;
}

/* 弟子列表样式 */
.disciples-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.disciple-item {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 12px;
  border: 1px solid #eee;
}

.disciple-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.disciple-name {
  font-weight: bold;
  color: #333;
  font-size: 16px;
}

.disciple-state {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.disciple-state:nth-of-type(2) {
  background-color: #4CAF50;
  color: white;
}

.disciple-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-label {
  width: 40px;
  font-size: 14px;
  color: #555;
}

.stat-value {
  font-weight: bold;
  color: #333;
}

.mood-bar-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mood-bar {
  height: 8px;
  background-color: #4CAF50;
  border-radius: 4px;
  transition: width 0.3s ease;
  flex: 1;
}

.disciple-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 邮件系统样式 */
.mailbox {
  max-height: 300px;
  overflow-y: auto;
}

.mail-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.mail-item:hover {
  background-color: #f5f5f5;
}

.mail-unread {
  background-color: #e3f2fd;
  font-weight: bold;
}

.mail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.mail-title {
  font-weight: bold;
  color: #333;
}

.mail-time {
  font-size: 12px;
  color: #888;
}

.mail-content {
  font-size: 14px;
  color: #555;
  padding: 10px 0;
  border-top: 1px dashed #ddd;
  margin-top: 5px;
}

.mail-badge {
  background-color: #ff5722;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: bold;
}

.empty-message {
  text-align: center;
  color: #888;
  padding: 20px;
  font-style: italic;
}

/* 日志样式 */
.logs-container {
  max-height: 200px;
  overflow-y: auto;
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
}

.log-item {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.log-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .game-content {
    grid-template-columns: 1fr 1fr;
  }
  
  .right-panel {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .game-content {
    grid-template-columns: 1fr;
  }
  
  .game-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .game-controls {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
