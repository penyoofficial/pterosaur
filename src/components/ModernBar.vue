<script setup lang="ts">
defineProps<{
  /** 位置。可选配置在页面顶部或底部 */
  position?: "top" | "bottom";
}>();
</script>
<template>
  <div :class="position">
    <slot></slot>
  </div>
</template>
<style scoped>
div {
  display: flex;
  z-index: 900;
  width: calc(100vw - 2.4rem * 2);
  height: 4.2rem;
  padding: 0 2.4rem;
  background: var(--c-background-L1);
}

.top {
  position: fixed;
  top: 0;
  border-bottom: 0.02rem var(--c-border) solid;
}

.bottom {
  position: fixed;
  bottom: 0;
  height: 4.8rem;
  border-top: 0.02rem var(--c-border) solid;
}
</style>
