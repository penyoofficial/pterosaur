<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";

const defaultOutput = ref("");
const needThrowError = ref(false);
const scale = ref("钢琴模式");

const { option } = router.currentRoute.value.query as { option: string };

const debugP1 = /wave\((\d+)([Hh][Zz])?\)/;
const debugP2 = /piano(\(\))?/;
if (debugP1.test(option)) {
  const hz = Number(option.match(debugP1)?.[1] + "");
  getWave(hz).start();
  defaultOutput.value = `Now we should have been at the sine wave of ${hz}Hz.`;
} else if (debugP2.test(option)) {
} else {
  defaultOutput.value = "Something goes wrong...";
  needThrowError.value = true;
}

/**
 * 产生指定频率的正弦波对象。
 *
 * 当需要播放的时候，需要手动调用其 `start()` 方法；需要暂停的时候，需要手动调用其 `stop()` 方法。
 *
 * @param frequency 频率
 */
function getWave(frequency: number) {
  const audioContext = new window.AudioContext();
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.connect(audioContext.destination);
  return oscillator;
}

/**
 * 计算指定音名所对应的频率。
 *
 * @param name 音名。如 *C3*（中央 C）
 */
function getFrequency(name: string) {
  /** 基准频率。在标准的对数频率表中，A4（第四个八度的 A 音）被定义为 440 赫兹。 */
  const standard = 440;

  if (!/^[CDEFGAB]\d$/.test(name)) return 0;

  const halftoneBook = new Map([
    ["C", 3],
    ["D", 5],
    ["E", 7],
    ["F", 8],
    ["G", 10],
    ["A", 12],
    ["B", 14],
  ]);
  const halftone =
    Number(halftoneBook.get(name[0])) + (Number(name[1]) - 4) * 12;
  const f = standard * Math.pow(2, halftone / 12);

  return f;
}

const scaleBook = ref(new Map<string, OscillatorNode>());
const codeBook = ref(
  new Map([
    ["KeyA", "E2"],
    ["KeyS", "F2"],
    ["KeyD", "G2"],
    ["KeyF", "A2"],
    ["KeyG", "B2"],
    ["KeyH", "C3"],
    ["KeyJ", "D3"],
    ["KeyK", "E3"],
    ["KeyL", "F3"],
    ["Semicolon", "G3"],
    ["Quote", "A3"],
  ]),
);

function handleBeep(e: KeyboardEvent) {
  const code = codeBook.value.get(e.code) as string;

  if (scaleBook.value.get(code)) return;
  scaleBook.value.set(code, getWave(getFrequency(code)));

  if (code) scaleBook.value.get(code)?.start();
  scale.value = code;
}

function handleMute(e: KeyboardEvent) {
  const code = codeBook.value.get(e.code) as string;

  if (code) scaleBook.value.get(code)?.stop();
  scaleBook.value.delete(code);
}
</script>
<template>
  <div
    v-if="defaultOutput"
    class="default"
    :class="needThrowError ? 'error' : ''"
  >
    {{ defaultOutput }}
  </div>
  <div
    v-else
    class="specified"
    tabindex="0"
    @keydown="handleBeep"
    @keyup="handleMute"
  >
    {{ scale }}
  </div>
</template>
<style scoped>
.default {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--c-text-L1);
}

.default.error {
  color: #f00;
}

.specified {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .key-group {
    display: flex;
    align-items: center;
    margin-right: 1rem;

    .key {
      margin-right: 1rem;
    }
  }
}
</style>
