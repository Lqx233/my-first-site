<template>
  <div class="page">
    <section class="card">
      <h2>我的预约</h2>
      <div class="room-list">
        <article v-for="order in orders" :key="order.id" class="card room-card">
          <div class="room-title">{{ order.room }}</div>
          <div class="room-meta">座位：{{ order.seat }} · {{ order.time }}</div>
          <span class="badge" :class="order.status === '进行中' ? 'open' : ''">
            {{ order.status }}
          </span>
          <div class="layout-toolbar">
            <button class="cta ghost">查看详情</button>
            <button class="cta ghost">取消预约</button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const orders = ref([
  {
    id: "O-001",
    room: "东校区自习空间",
    seat: "A3",
    time: "今日 14:00-18:00",
    status: "待开始",
  },
  {
    id: "O-002",
    room: "南门学习岛",
    seat: "B2",
    time: "昨日 09:00-12:00",
    status: "已完成",
  },
]);
</script>
