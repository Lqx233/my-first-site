import { GameState, GameAction, Disciple, Mail } from '../types';
import { GAME_CONFIG, REALMS } from '../config/gameConfig';
import { StoryTellerService } from '../services/StoryTellerService';
import { StorageService } from '../services/StorageService';

export class GameEngine {
  private state: GameState;
  private storyTeller: StoryTellerService;
  private storage: StorageService;
  private lastStoryTick: number = 0;

  constructor() {
    this.storyTeller = new StoryTellerService();
    this.storage = new StorageService();
    this.state = this.initializeGameState();
  }

  // 初始化游戏状态
  private initializeGameState(): GameState {
    // 尝试从本地存储加载游戏状态
    const savedState = this.storage.loadGame();
    if (savedState) {
      return savedState;
    }

    // 创建初始弟子
    const initialDisciples: Disciple[] = [];
    const discipleNames = ['弟子甲', '弟子乙', '弟子丙'];
    
    for (let i = 0; i < GAME_CONFIG.INITIAL_DISCIPLES_COUNT; i++) {
      initialDisciples.push({
        id: i + 1,
        name: discipleNames[i],
        state: 'IDLE',
        mood: 80,
        talent: Math.floor(Math.random() * 50) + 50 // 50-100 随机资质
      });
    }

    // 返回初始游戏状态
    return {
      tickCount: 0,
      resources: { ...GAME_CONFIG.INITIAL_RESOURCES },
      leader: { ...GAME_CONFIG.INITIAL_LEADER },
      disciples: initialDisciples,
      mailbox: [],
      logs: ['宗门建立，开始修仙之旅！']
    };
  }

  // 获取当前游戏状态
  public getState(): GameState {
    return { ...this.state };
  }

  // 处理游戏动作
  public dispatch(action: GameAction): void {
    switch (action.type) {
      case 'START_GAME':
        this.state = this.initializeGameState();
        break;
      case 'NEXT_TICK':
        this.nextTick();
        break;
      case 'LEADER_CULTIVATE':
        this.leaderCultivate();
        break;
      case 'ASSIGN_DISCIPLE_WORK':
        this.assignDiscipleWork(action.discipleId);
        break;
      case 'SEND_DISCIPLE_EXPLORE':
        this.sendDiscipleExplore(action.discipleId);
        break;
      case 'READ_MAIL':
        this.readMail(action.mailId);
        break;
    }
    
    // 保存游戏状态
    this.storage.saveGame(this.state);
  }

  // 下一回合
  private nextTick(): void {
    this.state.tickCount++;
    this.state.logs.push(`第 ${this.state.tickCount} 回合开始`);

    // 处理弟子状态
    this.processDisciples();
    
    // 生成随机故事
    this.generateRandomStory();
    
    // 检查资源平衡
    this.checkResourceBalance();
  }

  // 处理弟子状态
  private processDisciples(): void {
    this.state.disciples.forEach(disciple => {
      switch (disciple.state) {
        case 'WORKING':
          // 工作产出灵石
          this.state.resources.spiritStones += GAME_CONFIG.DISCIPLE_WORK_OUTPUT.spiritStones;
          // 工作降低心情
          disciple.mood = Math.max(0, disciple.mood - GAME_CONFIG.DISCIPLE_WORK_OUTPUT.moodDecrease);
          break;
        case 'EXPLORING':
          // 历练结束后返回
          // 这里简化处理，实际应该有持续时间跟踪
          disciple.state = 'IDLE';
          disciple.mood = Math.min(100, disciple.mood + GAME_CONFIG.EXPLORATION.MOOD_INCREASE);
          // 获得历练奖励
          const reward = Math.floor(Math.random() * (GAME_CONFIG.EXPLORATION.SPIRIT_STONES_REWARD[1] - GAME_CONFIG.EXPLORATION.SPIRIT_STONES_REWARD[0] + 1)) + GAME_CONFIG.EXPLORATION.SPIRIT_STONES_REWARD[0];
          this.state.resources.spiritStones += reward;
          this.state.logs.push(`${disciple.name} 历练归来，获得 ${reward} 灵石！`);
          break;
      }

      // 检查心情是否过低导致走火入魔
      if (disciple.mood < GAME_CONFIG.MOOD_THRESHOLDS.DERANGED && disciple.state !== 'DERANGED') {
        disciple.state = 'DERANGED';
        this.state.logs.push(`${disciple.name} 心情低落，走火入魔了！`);
      }
    });
  }

  // 掌门修行
  private leaderCultivate(): void {
    // 检查是否有足够的气运
    if (this.state.resources.fate < GAME_CONFIG.LEADER_CULTIVATE_COST.fate) {
      this.state.logs.push('气运不足，无法修行！');
      return;
    }

    // 消耗气运
    this.state.resources.fate -= GAME_CONFIG.LEADER_CULTIVATE_COST.fate;
    
    // 增加修为
    this.state.leader.xp += GAME_CONFIG.LEADER_CULTIVATE_GAIN.xp;
    
    this.state.logs.push(`${this.state.leader.name} 消耗 ${GAME_CONFIG.LEADER_CULTIVATE_COST.fate} 气运修行，获得 ${GAME_CONFIG.LEADER_CULTIVATE_GAIN.xp} 修为！`);

    // 检查是否突破境界
    this.checkRealmBreakthrough();
  }

  // 检查境界突破
  private checkRealmBreakthrough(): void {
    if (this.state.leader.xp >= this.state.leader.maxXp) {
      // 突破境界
      const currentRealmIndex = REALMS.indexOf(this.state.leader.realm);
      if (currentRealmIndex < REALMS.length - 1) {
        this.state.leader.realm = REALMS[currentRealmIndex + 1];
        this.state.leader.xp = 0;
        this.state.leader.maxXp = Math.floor(this.state.leader.maxXp * 1.5); // 下一境界需要更多修为
        this.state.logs.push(`${this.state.leader.name} 突破到 ${this.state.leader.realm}！`);
      } else {
        // 已达到最高境界
        this.state.leader.xp = this.state.leader.maxXp;
        this.state.logs.push(`${this.state.leader.name} 已达到最高境界！`);
      }
    }
  }

  // 分配弟子工作
  private assignDiscipleWork(discipleId: number): void {
    const disciple = this.state.disciples.find(d => d.id === discipleId);
    if (disciple) {
      disciple.state = 'WORKING';
      this.state.logs.push(`${disciple.name} 开始工作`);
    }
  }

  // 派遣弟子历练
  private sendDiscipleExplore(discipleId: number): void {
    const disciple = this.state.disciples.find(d => d.id === discipleId);
    if (disciple) {
      disciple.state = 'EXPLORING';
      this.state.logs.push(`${disciple.name} 开始历练`);
      
      // 生成历练故事
      this.generateExploreStory(disciple.name);
    }
  }

  // 生成随机故事
  private generateRandomStory(): void {
    if (this.state.tickCount - this.lastStoryTick >= GAME_CONFIG.EXPLORATION.STORY_COOLDOWN) {
      this.lastStoryTick = this.state.tickCount;
      this.storyTeller.generateStory().then(story => {
        this.addMail('宗门动态', story);
      });
    }
  }

  // 生成历练故事
  private generateExploreStory(discipleName: string): void {
    this.storyTeller.generateExploreStory(discipleName).then(story => {
      this.addMail(`${discipleName} 的历练经历`, story);
    });
  }

  // 添加邮件
  private addMail(title: string, content: string): void {
    const mail: Mail = {
      id: Date.now(),
      title,
      content,
      timestamp: Date.now(),
      read: false
    };
    this.state.mailbox.push(mail);
  }

  // 阅读邮件
  private readMail(mailId: number): void {
    const mail = this.state.mailbox.find(m => m.id === mailId);
    if (mail) {
      mail.read = true;
    }
  }

  // 检查资源平衡
  private checkResourceBalance(): void {
    // 简单的资源平衡逻辑：弟子工作产出灵石，灵石可以转化为气运
    // 这里简化处理，实际可以根据需要扩展
    if (this.state.resources.spiritStones > 500) {
      // 灵石过多，可以转化为气运
      const convertAmount = Math.min(this.state.resources.spiritStones - 500, 100);
      this.state.resources.spiritStones -= convertAmount;
      this.state.resources.fate += Math.floor(convertAmount / 10);
      this.state.logs.push(`将 ${convertAmount} 灵石转化为 ${Math.floor(convertAmount / 10)} 气运`);
    }
  }
}
