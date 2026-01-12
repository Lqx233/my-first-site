<template>
  <div class="page">
    <section class="card">
      <header class="banner">
        <h1>今日推荐自习室</h1>
        <p class="room-meta">精选安静座位 · 靠窗插座</p>
      </header>
      <section class="cta-grid">
        <button class="cta" @click="go('/client/booking')">预约选座</button>
        <button class="cta ghost" @click="go('/client/wallet')">我的钱包</button>
        <button class="cta ghost" @click="go('/client/orders')">我的预约</button>
      </section>
    </section>

    <section class="card">
      <h2>热门自习室</h2>
      <div class="room-list">
        <article v-for="room in rooms" :key="room.id" class="card room-card">
          <div class="room-title">{{ room.name }}</div>
          <div class="room-meta">{{ room.location }}</div>
          <span class="badge" :class="room.is_open ? 'open' : ''">
            {{ room.is_open ? "营业中" : "已打烊" }}
          </span>
          <button class="cta ghost" @click="go('/client/booking')">立即预约</button>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const go = (path: string) => router.push(path);

const rooms = ref([
  { id: "R-01", name: "东校区自习空间", location: "科技园路 88 号", is_open: true },
  { id: "R-02", name: "南门学习岛", location: "学府街 12 号", is_open: false },
]);
</script>
