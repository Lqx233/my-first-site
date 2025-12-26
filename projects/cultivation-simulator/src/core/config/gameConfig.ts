// 游戏数值配置
export const GAME_CONFIG = {
  // 初始资源
  INITIAL_RESOURCES: {
    spiritStones: 1000,
    fate: 100
  },
  
  // 掌门初始状态
  INITIAL_LEADER: {
    name: '掌教真人',
    realm: '练气一层',
    xp: 0,
    maxXp: 100
  },
  
  // 初始弟子数量
  INITIAL_DISCIPLES_COUNT: 3,
  
  // 弟子工作产出
  DISCIPLE_WORK_OUTPUT: {
    spiritStones: 10,
    moodDecrease: 5
  },
  
  // 掌门修行消耗
  LEADER_CULTIVATE_COST: {
    fate: 20
  },
  
  // 掌门修行产出
  LEADER_CULTIVATE_GAIN: {
    xp: 30
  },
  
  // 心情阈值
  MOOD_THRESHOLDS: {
    DERANGED: 20 // 低于此值会走火入魔
  },
  
  // 历练相关
  EXPLORATION: {
    DURATION: 5, // 历练持续时间（tick数）
    MOOD_INCREASE: 15, // 历练增加心情
    SPIRIT_STONES_REWARD: [50, 200], // 历练获得灵石范围
    STORY_COOLDOWN: 10 // 生成故事的冷却时间（tick数）
  }
};

// 境界列表
export const REALMS = [
  '练气一层',
  '练气二层',
  '练气三层',
  '筑基一层',
  '筑基二层',
  '筑基三层',
  '金丹一层',
  '金丹二层',
  '金丹三层',
  '元婴一层',
  '元婴二层',
  '元婴三层',
  '化神一层',
  '化神二层',
  '化神三层'
];
