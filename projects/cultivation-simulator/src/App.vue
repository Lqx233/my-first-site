<template>
  <div class="app">
    <GameMain />
  </div>
</template>

<script setup lang="ts">
import GameMain from './components/GameMain.vue';
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
  color: #333;
}

.app {
  min-height: 100vh;
  padding: 20px;
}
</style>
