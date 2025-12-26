// GameState
export interface GameState {
  tickCount: number;
  resources: { spiritStones: number; fate: number };
  leader: { name: string; realm: string; xp: number; maxXp: number };
  disciples: Disciple[];
  mailbox: Mail[]; // 异步消息系统
  logs: string[];
}

// Disciple
export interface Disciple {
  id: number;
  name: string;
  state: 'IDLE' | 'WORKING' | 'DERANGED' | 'EXPLORING'; // 包含走火入魔和历练
  mood: number; // 心情，过低会走火入魔
  talent: number; // 资质
}

// Mail
export interface Mail {
  id: number;
  title: string;
  content: string;
  timestamp: number;
  read: boolean;
}

// GameAction
export type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'NEXT_TICK' }
  | { type: 'LEADER_CULTIVATE' }
  | { type: 'ASSIGN_DISCIPLE_WORK'; discipleId: number }
  | { type: 'SEND_DISCIPLE_EXPLORE'; discipleId: number }
  | { type: 'READ_MAIL'; mailId: number };

// GameMode
export type GameMode = 'CULTIVATE' | 'MANAGE';
