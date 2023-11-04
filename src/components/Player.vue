<script setup lang="ts">
import { ref, watch } from "vue";
import type { Song } from "@/types/Song";
import type { State } from "@/types/State";
import { CycleType } from "@/types/CycleType";
import ModernButton from "./ModernButton.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiPlay, mdiPause, mdiSkipPrevious, mdiSkipNext } from "@mdi/js";

const props = defineProps<{
  dataGroup: Song[];
  focusId: string;
  state: State;
}>();

const emits = defineEmits(["update:focusId", "update:state"]);

const localState = ref<State>({
  isPlaying: false,
  playedTime: 0,
  delta: 0,
  totalTime: 0,
  cycleType: CycleType.REPEAT_OFF,
  isMute: false,
});

const song = ref<Song>();

watch(
  localState,
  (nls) => {
    const player = document.querySelector("audio") as HTMLAudioElement;
    if (!player) return;

    emits("update:state", nls);
    if (nls.isPlaying) player.play();
    else player.pause();
    if (nls.delta) player.currentTime += nls.delta;
    nls.delta = 0;
  },
  { deep: true },
);

watch(
  props,
  (np) => {
    localState.value = props.state;
    song.value = np.dataGroup.find((s) => s.id === np.focusId);
    if (song.value)
      document.title = `${song.value.title} - ${song.value.artist} - Pterosaur：Web 音乐播放器`;
  },
  { deep: true, immediate: true },
);

/**
 * 优化字符串。
 *
 * @param str 待优化的字符串
 */
function utilize(str: number) {
  const s = Math.floor(str);
  const m = Math.floor(s / 60);
  return `${m}:${(s - m * 60 + "").padStart(2, "0")}`;
}

function handlePlayingOrder() {
  const ct = localState.value.cycleType;
  switch (ct) {
    case CycleType.REPEAT_OFF:
      localState.value.isPlaying = false;
      break;
    case CycleType.REPEAT_ALL:
      handleGoAhaed();
      break;
    case CycleType.REPEAT_ONE:
      // do nothing
      break;
    case CycleType.RANDOM:
      let times = Math.floor(Math.random() * props.dataGroup.length);
      handleGoAhaed(times);
      break;
  }
}

function handlePlayOrPause() {
  localState.value.isPlaying = !localState.value.isPlaying;
}

function handleChangePlayedTime(e: WheelEvent) {
  e.preventDefault();
  localState.value.delta += e.deltaY / 100;
}

function handleGoAhaed(times?: number) {
  const len = props.dataGroup.length;

  if (!times) times = 1;
  times %= len;

  let index = 0;
  for (let i = 0; i < len; i++)
    if (props.dataGroup[i].id === props.focusId) index = i;
  index += times + len;
  index %= len;

  const id = props.dataGroup[index].id;
  emits("update:focusId", id);
  localState.value.isPlaying = true;
}
</script>
<template>
  <div v-if="song" class="controlor" @wheel="handleChangePlayedTime">
    <audio
      :src="song.media"
      :muted="localState.isMute"
      @ended="handlePlayingOrder"
      @timeupdate="
        (e) =>
          (localState.playedTime = (e.target as HTMLAudioElement).currentTime)
      "
      @durationchange="
        (e) => (localState.totalTime = (e.target as HTMLAudioElement).duration)
      "
    ></audio>
    <div class="switchs">
      <modern-button size="small" @click="handleGoAhaed(-1)">
        <svg-icon type="mdi" :path="mdiSkipPrevious" />
      </modern-button>
      <modern-button id="play" @click="handlePlayOrPause">
        <svg-icon v-if="localState.isPlaying" type="mdi" :path="mdiPause" />
        <svg-icon v-else type="mdi" :path="mdiPlay" />
      </modern-button>
      <modern-button size="small" @click="handleGoAhaed(1)">
        <svg-icon type="mdi" :path="mdiSkipNext"
      /></modern-button>
    </div>
    <div class="progress">
      <p class="played-time">{{ utilize(localState.playedTime) }}</p>
      <div
        class="progress-bar"
        :style="`--progress: ${
          (localState.playedTime / localState.totalTime) * 100
        }%;`"
      ></div>
      <p class="total-time">{{ utilize(localState.totalTime) }}</p>
    </div>
  </div>
</template>
<style scoped>
.controlor {
  position: relative;
  width: 100%;
  height: 100%;

  .switchs {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.75rem;

    #play {
      margin: 0 1.2rem;
    }
  }

  .progress {
    display: flex;
    align-items: center;
    justify-self: center;
    margin-top: 0.15rem;

    .progress-bar {
      width: calc(100% - 4rem);
      height: 0.25rem;
      margin: 0 0.5rem;
      background: var(--c-background-L2);
    }

    .progress-bar::before {
      content: "";
      display: block;
      width: var(--progress);
      height: 100%;
      background: var(--c-highlight);
    }

    .played-time,
    .total-time {
      color: var(--c-text-L2);
      font-size: 0.75rem;
    }

    .played-time {
      left: 0;
    }

    .total-time {
      right: 0;
    }
  }
}
</style>
