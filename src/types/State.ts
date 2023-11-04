import type { CycleType } from "./CycleType";

/** 播放机状态 */
export interface State {
  isPlaying: boolean;
  playedTime: number;
  delta: number;
  totalTime: number;
  cycleType: CycleType;
  isMute: boolean;
}
