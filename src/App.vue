<script setup lang="ts">
import { ref } from "vue";

/** 平台 */
type Platform = "ncm" | "qqm" | "kwm";

/** 平台译名 */
const platformTranslation = ref(
  new Map<Platform, string>([
    ["ncm", "网易云音乐"],
    ["qqm", "QQ音乐"],
    ["kwm", "酷我音乐"],
  ]),
);

/** 接口库 */
const apis = new Map<Platform, Function>([
  [
    "ncm",
    async (id: string) => {
      const j = await (
        await fetch(`https://api.paugram.com/netease/?id=${id}`)
      ).json();
      return {
        title: j.title,
        artist: j.artist,
        lyrics: j.lyric,
        mediaLink: j.link,
        coverLink: j.cover,
      };
    },
  ],
  [
    "kwm",
    async (id: string) => {
      const j = await (
        await fetch(
          `https://antiserver.kuwo.cn/anti.s?type=convert_url3&format=mp3&rid=${id}`,
        )
      ).json();
      return {
        title: "未知标题",
        artist: "未知艺术家",
        lyrics: "无法获取到歌词。",
        mediaLink: j.url,
        coverLink: "",
      };
    },
  ],
]);

/** 当前配置 */
const localOptions = ref<{
  platform: Platform;
  id: string;
  idExplict: string;
  isPlaying: boolean;
}>({
  platform: "ncm",
  id: "",
  idExplict: "",
  isPlaying: false,
});

/** 当前数据 */
const localData = ref({
  title: "",
  artist: "",
  lyrics: "",
  mediaLink: "",
  coverLink: "",
});

/** 当前状态 */
const localState = ref({
  playedTime: 0,
  totalTime: 0,
});

/**
 * 确定解析模块。
 *
 * @param platform 解析模块
 */
function changePlatform(platform: Platform) {
  if (!apis.get(platform)) return alert("该模块暂不可用。");

  localOptions.value.platform = platform;
  document.querySelectorAll(".mode").forEach((e) => {
    e.classList.remove("chosen");
    if (e.id == platform) e.classList.add("chosen");
  });
}

/**
 * 更新歌曲信息。
 *
 * @param id 歌曲识别符。若未提供则从输入框中获取
 */
async function update(id?: string) {
  if (!id) id = localOptions.value.idExplict;

  const j: typeof localData.value = await (
    apis.get(localOptions.value.platform) as Function
  )(id);

  if (!j.title) return alert("解析失败！");
  localOptions.value.idExplict = "";

  document.title = `${j.title} - ${j.artist} - Pterosaur 网页音乐播放器`;
  localOptions.value.id = id;
  localData.value = JSON.parse(JSON.stringify(j));
}

/**
 * 播放/暂停。
 */
function play() {
  const player = document.querySelector("audio") as HTMLAudioElement;
  const signal = document.querySelector(".play") as HTMLButtonElement;

  if (player.paused) {
    player.play();
    signal.innerText = "| |";
  } else {
    player.pause();
    signal.innerText = "▶";
  }
}

/**
 * 优化字符串。
 *
 * @param str 待优化的字符串
 * @param type 字符串类型
 */
function utilize(
  params: { str: string; type: "lyrics" } | { str: number; type: "time" },
) {
  switch (params.type) {
    case "lyrics":
      return params.str.replace(/\[.+?\]/g, "<br>");
    case "time":
      const s = Math.floor(params.str);
      const m = Math.floor(s / 60);
      return `${m}:${(s - m * 60 + "").padStart(2, "0")}`;
  }
}

/**
 * 改变播放时间。
 *
 * @param e 滚轮事件
 */
function changePlayedTime(e: WheelEvent) {
  e.preventDefault();

  const Δ = e.deltaY / 100;
  const player = document.querySelector("audio") as HTMLAudioElement;
  player.currentTime += Δ;
}

update("1345485069");
</script>

<template>
  <audio
    loop
    :src="localData.mediaLink"
    @timeupdate="
      (e) =>
        (localState.playedTime = (e.target as HTMLAudioElement).currentTime)
    "
    @durationchange="
      (e) => (localState.totalTime = (e.target as HTMLAudioElement).duration)
    "
  ></audio>
  <div class="bar top-bar">
    <div class="main-logo">Pterosaur</div>
    <ul class="modes">
      <li v-for="p in platformTranslation">
        <a
          class="mode"
          :class="p[0] == localOptions.platform ? 'chosen' : ''"
          :id="p[0]"
          @click="changePlatform(p[0])"
          >{{ p[1] }}</a
        >
      </li>
    </ul>
    <div class="id-supplier">
      <input
        type="text"
        class="id-giver"
        placeholder="在此输入歌曲ID..."
        v-model="localOptions.idExplict"
      />
      <button class="id-go" @click="update()">解析</button>
    </div>
  </div>
  <div class="main-box">
    <img class="cover" :src="localData.coverLink" alt="" />
    <p
      class="lyrics"
      v-html="utilize({ str: localData.lyrics, type: 'lyrics' })"
    ></p>
  </div>
  <div class="bar bottom-bar">
    <div class="bottom-locator1">
      <button class="play" @click="play">▶</button>
    </div>
    <div
      class="progress-bar"
      :style="`--progress: ${
        (localState.playedTime / localState.totalTime) * 100
      }%;`"
      @wheel="changePlayedTime"
    >
      {{ utilize({ str: localState.playedTime, type: "time" }) }}
      /
      {{ utilize({ str: localState.totalTime, type: "time" }) }}
    </div>
    <div class="bottom-locator2">
      <p class="song-title">{{ localData.title }}</p>
      <p class="song-author">{{ localData.artist }}</p>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  font-family: Novecento, 思源黑体;
}

body {
  background-color: #dddddd;
  margin: 50px 0px 0px 0px;
  width: 100%;
  height: 100%;
}

.bar {
  position: fixed;
  z-index: 999;
  left: 0px;
  width: 100%;
  background-color: #ffffff;
  z-index: 5;
  box-shadow: 0px 0px 5px grey;
}

.main-box {
  position: relative;
  text-align: center;
}

.cover {
  position: fixed;
  z-index: -1;
  top: calc(60px);
  left: 50%;
  height: calc(100% - 60px - 80px);
  transform: translateX(-50%);
  filter: blur(5px) brightness(50%);
}

.lyrics {
  top: 0px;
  margin: 100px 0 120px;
  color: #dddddd;
}

.top-bar {
  top: 0px;
  height: 60px;
}

.top-bar li {
  float: left;
  list-style: none;
}

.main-logo {
  float: left;
  font-weight: bold;
  font-size: 28px;
  line-height: 60px;
  margin: 0px 40px;
}

.mode {
  float: left;
  font-size: 16px;
  line-height: 60px;
  padding: 0px 10px;
  background-color: #fff;
  color: #dddddd;
}

.mode:hover {
  filter: brightness(95%);
}

.chosen {
  color: black;
  line-height: 50px;
  border-bottom: 5px solid white;
}

.chosen#ncm {
  border-top: 5px solid #c20c0c;
}

.chosen#qqm {
  border-top: 5px solid #31c27c;
}

.chosen#kwm {
  border-top: 5px solid #ffe443;
}

.id-supplier {
  float: right;

  * {
    height: 30px;
    position: relative;
    margin: 15px 40px 0 0;
    border: 0;
    border-radius: 15px;
  }

  .id-giver {
    right: -106px;
    width: 270px;
    line-height: 30px;
    font-size: 18px;
    text-indent: 1em;
    background-color: #dddddd;
  }

  .id-go {
    top: -2.7px;
    padding: 0 20px;
  }
}

.dev-go:active {
  background: darkgray;
}

.bottom-bar {
  bottom: 0px;
  height: 80px;
}

.bottom-locator1 {
  padding: 16px 40px;
  float: left;
}

.play {
  width: 200px;
  height: 48px;
  border-radius: 15px;
  background: gray;
  font-weight: bold;
  font-size: 24px;
  color: #ffffff;
  line-height: 48px;
  border: none;
  padding: 0px;
}

.play:active {
  background: darkgray;
}

.progress-bar {
  position: absolute;
  width: 100%;
  height: 2px;
  background: #aaa;
  text-align: center;
  line-height: 80px;
  color: #aaa;
}

.progress-bar::before {
  content: "";
  position: absolute;
  display: block;
  width: var(--progress);
  height: 100%;
  background: #444;
}

.bottom-locator2 {
  float: right;
  padding: 12px 40px;
  text-align: right;
  font-weight: bolder;
}

.song-title {
  font-size: 28px;
  line-height: 32px;
}

.song-author {
  font-size: 20px;
  line-height: 24px;
}

.cir {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: gray;
  color: #ffffff;
  border: none;
}

.cir:active {
  background: darkgray;
}

@media screen and (max-width: 800px) {
  .main-logo {
    margin-right: 0;
  }

  .modes {
    display: none;
  }

  .play {
    width: 100px;
  }
}
</style>
