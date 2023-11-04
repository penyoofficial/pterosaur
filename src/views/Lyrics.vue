<script setup lang="ts">
import { ref, watch } from "vue";
import type { Song } from "@/types/Song";
import type { State } from "@/types/State";

const props = defineProps<{
  dataGroup: Song[];
  focusId: string;
  state: State;
}>();

const song = ref<Song>();

watch(
  props,
  (np) => {
    song.value = np.dataGroup.find((s) => s.id === np.focusId) as Song;
  },
  { deep: true, immediate: true },
);

/**
 * 优化字符串。
 *
 * @param str 待优化的字符串
 */
function utilize(str: string) {
  let flag = new Map<string, string>();
  str.split("\n").forEach((s) => {
    const ts = s.match(/\[.+?\]/g);
    const c = s.replace(/\[.+?\]/g, "");
    if (ts && c) flag.set(String(ts).slice(1, -1).split("]")[0], c);
  });
  return flag;
}

/**
 * 检查该时间戳是否为最新时间戳。
 *
 * @param ts 时间戳。形如 `mm:SS.sss` 或 `mm:SS`
 */
function isOn(ts: string) {
  function getTsValue(ts: string) {
    const pattern = /(\d{2}):(\d{2})(.(\d{3}))?/;
    const tsInfo = ts.match(pattern) as string[];
    const tsValue =
      (Number(tsInfo[1]) || 0) * 60 +
      (Number(tsInfo[2]) || 0) +
      (Number(tsInfo[4]) || 0) / 1000;
    return tsValue;
  }

  let latestTs = 0;
  if (song.value)
    utilize(song.value.lyrics).forEach((c, l) => {
      if (getTsValue(l) < props.state.playedTime)
        return (latestTs = getTsValue(l));
    });
  if (getTsValue(ts) === latestTs) return true;
  return false;
}

const rollable = ref(true);

watch(props, roll, { deep: true });

/**
 * 滚动歌词到合适位置。
 */
function roll() {
  function getDelta() {
    let count = 0;
    document.querySelectorAll(".line").forEach((l, i) => {
      if (l.className === "line focus") count = i;
    });
    return count;
  }

  if (rollable.value)
    (document.querySelector(".dynamic-shell") as HTMLElement).scrollTo({
      top: getDelta() * 21 + 14,
      behavior: "smooth",
    });
}

function handlePreventRoll() {
  rollable.value = false;
}

function handleAllowRoll() {
  rollable.value = true;
}
</script>
<template>
  <div
    v-if="song"
    class="dynamic-shell"
    @mouseenter="handlePreventRoll"
    @mouseleave="handleAllowRoll"
  >
    <div class="static-shell">
      <p
        v-for="s in utilize(song.lyrics)"
        :ts="s[0]"
        class="line"
        :class="isOn(s[0]) ? 'focus' : ''"
      >
        {{ s[1] }}
      </p>
    </div>
  </div>
</template>
<style scoped>
.dynamic-shell {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .static-shell {
    position: relative;
    padding: calc(50vh - 4.2rem) 0 calc(50vh - 4.8rem);
    color: var(--c-text-L2);
    text-align: center;
  }
}

p {
  transition: font-size 0.5s;
}

p.focus {
  margin: 0.2rem 0;
  color: var(--c-highlight);
  font-size: 1.25rem;
}
</style>
