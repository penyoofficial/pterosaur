<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 内容类型。默认为图标型 */
    contentType?: "icon" | "text";
    /** 控件尺寸。默认为正常大小 */
    size?: "small" | "normal" | "big";
    /** 是否需要复杂交互动效。仅在图表型模式下生效 */
    needComplexFx?: boolean;
  }>(),
  {
    contentType: "icon",
    size: "normal",
  },
);
</script>
<template>
  <button :class="[contentType, size, needComplexFx ? 'complexfx' : '']">
    <slot></slot>
  </button>
</template>
<style scoped>
button {
  height: 2.4rem;
  border-radius: 1.2rem;
  border: 0;
  outline: 0;
  background: var(--c-background-L2);
  color: var(--c-text-L1);
  font-size: 1rem;
  line-height: 2.4rem;
  text-wrap: nowrap;
}

button:active {
  background: var(--c-background-L3);
  transition: none;
}

button.icon.complexfx:active {
  color: transparent;
  transform: rotate(360deg);
}

button.icon {
  width: 2.4rem;
}

button.text {
  padding: 0 1.2rem;
}

button.small {
  zoom: 0.8;
}

button.big {
  zoom: 1.2;
}
</style>
