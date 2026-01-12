<template>
  <div class="page">
    <section class="card">
      <div class="layout-toolbar">
        <strong>房间列表</strong>
        <div class="layout-toolbar">
          <button class="cta" @click="createRoom">新建房间</button>
          <button class="cta ghost" @click="openPrototype">进入原型页面</button>
        </div>
      </div>
      <div class="room-list">
        <article v-for="room in rooms" :key="room.id" class="card room-card">
          <div class="room-title">{{ room.name }}</div>
          <div class="room-meta">状态：{{ room.is_published ? "已上架" : "未上架" }}</div>
          <div class="preview">
            <svg viewBox="0 0 200 120">
              <rect width="200" height="120" rx="10" fill="#f8fafb" />
              <rect
                v-for="el in room.layout_data"
                :key="el.id"
                :x="el.x / 6"
                :y="el.y / 6"
                :width="el.type === 'seat' ? 16 : 12"
                :height="el.type === 'seat' ? 12 : 10"
                rx="3"
                fill="#e2e8f0"
              />
            </svg>
          </div>
          <div class="layout-toolbar">
            <button class="cta ghost" @click="editRoom(room)">编辑图纸</button>
            <button class="cta ghost" @click="togglePublish(room)">
              {{ room.is_published ? "下架" : "上架" }}
            </button>
            <button class="cta ghost" @click="removeRoom(room)">删除</button>
          </div>
        </article>
      </div>
    </section>

    <section v-if="editingRoom" class="card">
      <div class="layout-toolbar">
        <strong>图纸编辑器：{{ editingRoom.name }}</strong>
        <div class="layout-toolbar">
          <button @click="addElement('seat')">添加座位</button>
          <button @click="addElement('door')">添加门</button>
          <button @click="addElement('window')">添加窗</button>
          <button @click="saveLayout">保存布局</button>
        </div>
      </div>
      <div class="grid-wrapper">
        <svg
          class="layout-canvas"
          viewBox="0 0 1000 600"
          @mousemove="onDrag"
          @mouseup="endDrag"
          @mouseleave="endDrag"
        >
          <rect width="1000" height="600" rx="16" fill="#f9fbfc" />
          <g v-for="el in elements" :key="el.id">
            <rect
              :x="el.x"
              :y="el.y"
              :width="el.type === 'seat' ? 70 : 60"
              :height="el.type === 'seat' ? 50 : 40"
              rx="10"
              :fill="el.type === 'seat' ? '#ffffff' : '#e5f3ff'"
              stroke="#94a3b8"
              @mousedown="startDrag(el, $event)"
            />
            <text
              :x="el.x + 30"
              :y="el.y + 28"
              text-anchor="middle"
              font-size="12"
              fill="#1f2937"
            >
              {{ el.label }}
            </text>
          </g>
        </svg>
      </div>
      <div class="room-meta">保存会生成 layout_data JSON 存储到数据库。</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

type LayoutElement = {
  id: string;
  x: number;
  y: number;
  type: "seat" | "door" | "window";
  label: string;
};

type Room = {
  id: string;
  name: string;
  is_published: boolean;
  layout_data: LayoutElement[];
};

const rooms = reactive<Room[]>([
  {
    id: "R-01",
    name: "东校区自习空间",
    is_published: true,
    layout_data: [
      { id: "S-01", x: 80, y: 80, type: "seat", label: "A1" },
      { id: "S-02", x: 180, y: 80, type: "seat", label: "A2" },
      { id: "D-01", x: 420, y: 120, type: "door", label: "门" },
    ],
  },
  {
    id: "R-02",
    name: "南门学习岛",
    is_published: false,
    layout_data: [
      { id: "S-11", x: 120, y: 120, type: "seat", label: "B1" },
      { id: "S-12", x: 220, y: 120, type: "seat", label: "B2" },
      { id: "W-01", x: 360, y: 160, type: "window", label: "窗" },
    ],
  },
]);

const editingRoom = ref<Room | null>(null);
const elements = ref<LayoutElement[]>([]);

const drag = reactive({
  active: false,
  id: "",
  startX: 0,
  startY: 0,
  originX: 0,
  originY: 0,
});

const createRoom = () => {
  const id = `R-${String(rooms.length + 1).padStart(2, "0")}`;
  rooms.push({ id, name: `新房间 ${id}`, is_published: false, layout_data: [] });
};

const editRoom = (room: Room) => {
  editingRoom.value = room;
  elements.value = room.layout_data.map((el) => ({ ...el }));
};

const togglePublish = (room: Room) => {
  room.is_published = !room.is_published;
};

const removeRoom = (room: Room) => {
  const index = rooms.findIndex((r) => r.id === room.id);
  if (index >= 0) rooms.splice(index, 1);
  if (editingRoom.value?.id === room.id) editingRoom.value = null;
};

const addElement = (type: LayoutElement["type"]) => {
  const id = `${type}-${Date.now()}`;
  const label = type === "seat" ? `S-${elements.value.length + 1}` : type === "door" ? "门" : "窗";
  elements.value.push({ id, x: 120, y: 120, type, label });
};

const startDrag = (el: LayoutElement, event: MouseEvent) => {
  drag.active = true;
  drag.id = el.id;
  drag.startX = event.clientX;
  drag.startY = event.clientY;
  drag.originX = el.x;
  drag.originY = el.y;
};

const onDrag = (event: MouseEvent) => {
  if (!drag.active) return;
  const el = elements.value.find((item) => item.id === drag.id);
  if (!el) return;
  const dx = event.clientX - drag.startX;
  const dy = event.clientY - drag.startY;
  el.x = Math.max(0, drag.originX + dx);
  el.y = Math.max(0, drag.originY + dy);
};

const endDrag = () => {
  drag.active = false;
};

const saveLayout = () => {
  if (!editingRoom.value) return;
  editingRoom.value.layout_data = elements.value.map((el) => ({ ...el }));
};

const openPrototype = () => {
  window.open("/index.html", "_blank");
};
</script>
