<script setup lang="ts">
defineProps<{
  /** 预填内容 */
  placeholder?: string;
}>();
</script>
<template>
  <div>
    <input
      type="text"
      :placeholder="placeholder || '歌曲 ID 集合 / 歌曲链接...'"
    />
  </div>
</template>
<style scoped>
div {
  position: relative;
  width: 16rem;
  height: 2.4rem;
  padding: 0 1.2rem 0 3rem;
  border-radius: 1.2rem;
  background: var(--c-background-L2);
}

div::after {
  content: "🔍︎";
  position: absolute;
  left: 1.2rem;
  top: 0;
  width: 1rem;
  line-height: 2.4rem;
  color: var(--c-text-L1);
  text-align: center;
}

input {
  width: 100%;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--c-text-L1);
}

input::placeholder {
  color: var(--c-text-L2);
}
</style>
