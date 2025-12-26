import { GameState } from '../types';

export class StorageService {
  private readonly STORAGE_KEY = 'cultivation-simulator-save';

  // 保存游戏状态
  public saveGame(state: GameState): void {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(this.STORAGE_KEY, serializedState);
      console.log('游戏状态已保存');
    } catch (error) {
      console.error('保存游戏状态失败:', error);
    }
  }

  // 加载游戏状态
  public loadGame(): GameState | null {
    try {
      const serializedState = localStorage.getItem(this.STORAGE_KEY);
      if (serializedState === null) {
        return null;
      }
      return JSON.parse(serializedState);
    } catch (error) {
      console.error('加载游戏状态失败:', error);
      return null;
    }
  }

  // 清除游戏状态
  public clearGame(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('游戏状态已清除');
    } catch (error) {
      console.error('清除游戏状态失败:', error);
    }
  }
}
