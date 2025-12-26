import { ref, computed, onMounted } from 'vue';
import { GameEngine } from '../core/systems/GameEngine';
import { GameState, GameAction } from '../core/types';

export function useGame() {
  const gameEngine = new GameEngine();
  const gameState = ref<GameState>(gameEngine.getState());

  // 处理游戏动作
  const dispatch = (action: GameAction) => {
    gameEngine.dispatch(action);
    gameState.value = gameEngine.getState();
  };

  // 计算属性
  const leaderProgress = computed(() => {
    return (gameState.value.leader.xp / gameState.value.leader.maxXp) * 100;
  });

  const unreadMailCount = computed(() => {
    return gameState.value.mailbox.filter(mail => !mail.read).length;
  });

  // 初始化游戏
  onMounted(() => {
    // 可以在这里添加一些初始化逻辑
  });

  return {
    gameState,
    dispatch,
    leaderProgress,
    unreadMailCount
  };
}
