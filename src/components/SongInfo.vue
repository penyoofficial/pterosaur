<script setup lang="ts">
import type { Song } from "@/types/Song";

defineProps<{
  data?: Song;
}>();
</script>
<template>
  <div v-if="data">
    <img class="cover" :src="data.cover" alt="" />
    <span>
      <p class="title">{{ data.title }}</p>
      <p class="artist">{{ data.artist }}</p>
    </span>
  </div>
</template>
<style scoped>
div {
  display: flex;
  align-items: center;
  color: var(--c-text-L1);

  .cover {
    height: 3.8rem;
    margin-right: 1rem;
    border-radius: 0.2rem;
  }

  .title,
  .artist {
    overflow: hidden;
    text-wrap: balance;
    text-overflow: ellipsis;
  }

  .title {
    margin-bottom: 0.05rem;
    font-size: 1.1rem;
  }

  .artist {
    font-size: 0.9rem;
  }
}
</style>
