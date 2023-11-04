<script setup lang="ts">
import { ref } from "vue";
import router from "./router";
import { useHistoryStore } from "./pinia/history";
import type { State } from "./types/State";
import { CycleType } from "./types/CycleType";
import { WindowType } from "./types/WindowType";
import ModernBar from "./components/ModernBar.vue";
import ModernButton from "./components/ModernButton.vue";
import ModernSearcher from "./components/ModernSearcher.vue";
import SongInfo from "./components/SongInfo.vue";
import Player from "./components/Player.vue";
import SvgIcon from "@jamescoyle/vue-icon";
import {
  mdiRepeatOff,
  mdiRepeat,
  mdiRepeatOnce,
  mdiShuffle,
  mdiCardText,
  mdiPlaylistMusic,
  mdiVolumeSource,
  mdiVolumeMute,
  mdiBug,
} from "@mdi/js";

const isNightMode = ref(false);

const songs = ref(useHistoryStore().getSongs());

const focusId = ref(songs.value[0]?.id || "");

const state = ref<State>({
  isPlaying: false,
  playedTime: 0,
  delta: 0,
  totalTime: 0,
  cycleType: CycleType.REPEAT_OFF,
  isMute: false,
});

/**
 * 更新歌曲信息。
 *
 * @param id 歌曲 ID
 */
function update(ids?: string[]) {
  if (ids)
    ids.forEach(async (id) => {
      if (!(await useHistoryStore().addSong(id))) return alert("解析失败！");
      focusId.value = id;
    });
  songs.value = useHistoryStore().getSongs();
}

function handleDownloadSource() {
  window.open("https://github.com/penyoofficial/pterosaur", "_blank");
}

function handleSubmit(e: KeyboardEvent) {
  if (e.code === "Enter") {
    const input = e.target as HTMLInputElement;
    const debugP = /^debug(::(.+?)?)?$/;
    const urlP = /^https?:\/\/music.163.com\/song\?id=(\d+?)&userid=\d+?/;

    if (debugP.test(input.value)) {
      const option = input.value.match(debugP)?.[2];
      router.push(`/debug${option ? "?option=" + option : ""}`);
    } else if (urlP.test(input.value)) {
      const id = input.value.match(urlP)?.[1] as string;
      update([id]);
    } else update(input.value.split(","));
    input.value = "";
  }
}

function handlePlayingOrder() {
  if (state.value.cycleType < Object.keys(CycleType).length / 2 - 1)
    state.value.cycleType++;
  else state.value.cycleType = 0;
}

function handleSwitchWindow() {
  let windowType = "/";
  switch (router.currentRoute.value.path) {
    case WindowType.LYRICS:
      windowType = WindowType.HISTORY;
      break;
    case WindowType.HISTORY:
      windowType = WindowType.LYRICS;
      break;
  }
  router.push(windowType);
}

function handleVolume() {
  state.value.isMute = !state.value.isMute;
}

if (!focusId.value)
  update(["1345485069", "2042620663", "1361188105", "551816010", "155883"]);
</script>
<template>
  <div class="fakeroot" :class="isNightMode ? 'dark' : 'light'">
    <div class="shield">应用不能在当前分辨率下运行。</div>
    <modern-bar position="top">
      <div class="in-bar-box left">
        <h1 id="logo">PTEROSAUR</h1>
        <modern-button
          content-type="text"
          size="small"
          @click="handleDownloadSource"
          >下载源代码</modern-button
        >
      </div>
      <div class="in-bar-box right">
        <modern-button
          :need-complex-fx="true"
          @click="isNightMode = !isNightMode"
          >{{ isNightMode ? "🔆" : "🌙" }}</modern-button
        >
        <modern-searcher @keypress="handleSubmit" />
      </div>
    </modern-bar>
    <div class="window">
      <router-view
        :data-group="songs"
        v-model:focusId="focusId"
        v-model:state="state"
        :update="update"
      ></router-view>
    </div>
    <modern-bar position="bottom">
      <div class="in-bar-box left">
        <song-info :data="songs.find((s) => s.id === focusId)" />
      </div>
      <div class="in-bar-box middle">
        <player
          :data-group="songs"
          v-model:focusId="focusId"
          v-model:state="state"
          :update="update"
        />
      </div>
      <div class="in-bar-box right">
        <modern-button @click="handlePlayingOrder"
          ><svg-icon
            v-if="state.cycleType === CycleType.REPEAT_OFF"
            type="mdi"
            :path="mdiRepeatOff" /><svg-icon
            v-else-if="state.cycleType === CycleType.REPEAT_ALL"
            type="mdi"
            :path="mdiRepeat" /><svg-icon
            v-else-if="state.cycleType === CycleType.REPEAT_ONE"
            type="mdi"
            :path="mdiRepeatOnce" /><svg-icon
            v-else-if="state.cycleType === CycleType.RANDOM"
            type="mdi"
            :path="mdiShuffle"
        /></modern-button>
        <modern-button @click="handleSwitchWindow"
          ><svg-icon
            v-if="$route.path === WindowType.LYRICS"
            type="mdi"
            :path="mdiCardText" /><svg-icon
            v-else-if="$route.path === WindowType.HISTORY"
            type="mdi"
            :path="mdiPlaylistMusic" /><svg-icon
            v-else-if="$route.path === WindowType.DEBUG"
            type="mdi"
            :path="mdiBug"
        /></modern-button>
        <modern-button @click="handleVolume"
          ><svg-icon
            v-if="!state.isMute"
            type="mdi"
            :path="mdiVolumeSource" /><svg-icon
            v-else-if="state.isMute"
            type="mdi"
            :path="mdiVolumeMute"
        /></modern-button>
      </div>
    </modern-bar>
  </div>
</template>
<style scoped>
div.shield {
  display: none;
}

div.window {
  position: fixed;
  top: 4.2rem;
  left: 0;
  width: 100vw;
  height: calc(100vh - 4.2rem - 4.8rem);
  background: var(--c-background-L2);
}

h1#logo {
  position: relative;
  margin-right: 1.8rem;
  color: var(--c-text-L1);
  font-family: Novecento;
  user-select: none;
}

h1#logo::before,
h1#logo::after {
  content: "";
  position: absolute;
  z-index: -1;
  background: var(--c-highlight);
}

h1#logo::before {
  right: -0.3rem;
  bottom: -0.05rem;
  width: 60%;
  height: 30%;
}

h1#logo::after {
  right: -0.25rem;
  top: 0.25rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.75rem;
}

.in-bar-box {
  display: flex;
  flex: 1;
  align-items: center;
}

.in-bar-box.left {
  justify-content: flex-start;

  * {
    margin-right: 1rem;
  }
}

.in-bar-box.middle {
  justify-content: center;
  flex: 0.85;

  * {
    margin: 0 0.5rem;
  }
}

.in-bar-box.right {
  justify-content: flex-end;

  * {
    margin-left: 1rem;
  }
}

@media screen and ((max-width: 800px) or (max-height: 600px)) {
  div.shield {
    position: fixed;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: var(--c-highlight);
    color: var(--c-background-L1);
  }
}
</style>
