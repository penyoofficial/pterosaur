<script setup lang="ts">
import { useHistoryStore } from "@/pinia/history";
import type { Song } from "@/types/Song";
import type { State } from "@/types/State";
import SongInfo from "@/components/SongInfo.vue";

const props = defineProps<{
  dataGroup: Song[];
  focusId: string;
  state: State;
  update: Function;
}>();

const emits = defineEmits(["update:focusId", "update:state"]);

async function handleChangeSong(nid: string) {
  if (nid === props.focusId) return;

  emits("update:focusId", nid);
  const state = props.state;
  state.isPlaying = true;
  emits("update:state", state);
}

function handleDeleteSong(id: string) {
  if (id === props.focusId) return alert("该歌曲正在播放，不可删除！");
  useHistoryStore().removeSong(id);
  props.update();
}
</script>
<template>
  <div class="list">
    <p class="info-block" v-for="(s, i) in dataGroup">
      <span class="index">{{ i + 1 }}</span>
      <song-info class="info" :data="s" @click="handleChangeSong(s.id)" />
      <span class="delete" @click="handleDeleteSong(s.id)">删除</span>
    </p>
  </div>
</template>
<style scoped>
.list {
  height: calc(100vh - 4.2rem - 4.8rem - 2.4rem * 2);
  padding: 2.4rem;
  overflow-y: auto;

  .info-block {
    display: flex;
    align-items: center;
    padding: 1rem 3rem 1rem 2rem;
    background: var(--c-background-L1);
    border-radius: 1.2rem;
    transition: all 0.5s;

    .index {
      width: 2rem;
      margin-right: 2rem;
      color: var(--c-text-L1);
      text-align: center;
    }

    .info {
      flex: 999;
    }

    .delete {
      color: var(--c-highlight);
      text-align: right;
      opacity: 0;
      transition: opacity 0.5s;
    }
  }

  .info-block:nth-child(2n) {
    background: var(--c-background-L2);
  }

  .info-block:hover {
    transform: scale(1.03);

    .delete {
      opacity: 1;
    }
  }
}
</style>
