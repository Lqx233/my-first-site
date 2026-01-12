<template>
  <div class="page">
    <section class="card">
      <div class="layout-toolbar">
        <strong>预约选座</strong>
        <span class="room-meta">选择自习室后加载对应图纸</span>
      </div>
      <div class="stepper">
        <div :class="['step', step >= 1 ? 'active' : '']">1 选择自习室</div>
        <div :class="['step', step >= 2 ? 'active' : '']">2 选择座位</div>
      </div>
    </section>

    <section class="card">
      <h2>自习室列表</h2>
      <div class="room-list">
        <article v-for="room in rooms" :key="room.id" class="card room-card">
          <div class="room-title">{{ room.name }}</div>
          <div class="room-meta">{{ room.location }}</div>
          <span class="badge" :class="room.is_open ? 'open' : ''">
            {{ room.is_open ? "营业中" : "已打烊" }}
          </span>
          <button class="cta ghost" @click="selectRoom(room)">进入选座</button>
        </article>
      </div>
    </section>

    <section v-if="selectedRoom" class="card">
      <div class="layout-toolbar">
        <strong>{{ selectedRoom.name }} · 座位图</strong>
        <span class="room-meta">白色=空闲 灰色=已占 绿色=选中</span>
      </div>
      <svg class="layout-canvas" viewBox="0 0 1000 600">
        <rect width="1000" height="600" rx="16" fill="#f9fbfc" />
        <g v-for="seat in seatElements" :key="seat.id">
          <rect
            :x="seat.x"
            :y="seat.y"
            width="60"
            height="44"
            rx="10"
            :fill="seatFill(seat)"
            stroke="#94a3b8"
            @click="selectSeat(seat)"
          />
          <text
            :x="seat.x + 30"
            :y="seat.y + 24"
            text-anchor="middle"
            font-size="12"
            fill="#1f2937"
          >
            {{ seat.label }}
          </text>
        </g>
      </svg>
      <div class="layout-toolbar">
        <span class="room-meta">已选座位：{{ selectedSeatLabel || '未选择' }}</span>
        <button class="cta" :disabled="!selectedSeatLabel">确认预约</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type Seat = { id: string; x: number; y: number; type: string; label: string; status: string };

type Room = {
  id: string;
  name: string;
  location: string;
  is_open: boolean;
  layout_data: Seat[];
};

const rooms = ref<Room[]>([
  {
    id: "R-01",
    name: "东校区自习空间",
    location: "科技园路 88 号",
    is_open: true,
    layout_data: [
      { id: "S-01", x: 80, y: 80, type: "seat", label: "A1", status: "free" },
      { id: "S-02", x: 160, y: 80, type: "seat", label: "A2", status: "occupied" },
      { id: "S-03", x: 240, y: 80, type: "seat", label: "A3", status: "free" },
      { id: "S-04", x: 80, y: 160, type: "seat", label: "B1", status: "free" },
    ],
  },
  {
    id: "R-02",
    name: "南门学习岛",
    location: "学府街 12 号",
    is_open: true,
    layout_data: [
      { id: "S-11", x: 120, y: 120, type: "seat", label: "C1", status: "free" },
      { id: "S-12", x: 220, y: 120, type: "seat", label: "C2", status: "occupied" },
      { id: "S-13", x: 320, y: 120, type: "seat", label: "C3", status: "free" },
    ],
  },
]);

const selectedRoom = ref<Room | null>(null);
const selectedSeatId = ref<string | null>(null);

const seatElements = computed(() => selectedRoom.value?.layout_data || []);
const selectedSeatLabel = computed(() =>
  seatElements.value.find((seat) => seat.id === selectedSeatId.value)?.label
);

const step = computed(() => (selectedRoom.value ? 2 : 1));

const selectRoom = (room: Room) => {
  selectedRoom.value = room;
  selectedSeatId.value = null;
};

const selectSeat = (seat: Seat) => {
  if (seat.status !== "free") return;
  selectedSeatId.value = seat.id;
};

const seatFill = (seat: Seat) => {
  if (seat.status !== "free") return "#e5e7eb";
  if (seat.id === selectedSeatId.value) return "#10b981";
  return "#ffffff";
};
</script>
