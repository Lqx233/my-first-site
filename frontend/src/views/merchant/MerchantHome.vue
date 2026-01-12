<template>
  <div class="page">
    <section class="card">
      <header class="banner">
        <h1>商家仪表盘</h1>
        <p class="room-meta">今日订单 128 · 在座 42 · 空闲 68</p>
      </header>
      <section class="cta-grid">
        <button class="cta" @click="go('/merchant/rooms')">图纸与房间管理</button>
        <button class="cta ghost" @click="go('/merchant/rooms')">进入图纸编辑器</button>
      </section>
    </section>

    <section class="card">
      <h2>今日概览</h2>
      <div class="room-list">
        <article class="card room-card">
          <div class="room-title">待处理上架</div>
          <div class="room-meta">2 个房间待发布</div>
        </article>
        <article class="card room-card">
          <div class="room-title">异常订单</div>
          <div class="room-meta">1 笔待处理</div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const go = (path: string) => router.push(path);
</script>
