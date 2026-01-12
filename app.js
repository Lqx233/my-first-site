const state = {
  mode: "user",
  gridEnabled: true,
  layout: { width: 1000, height: 600, grid: 40 },
  seats: [
    {
      id: "S-01",
      name: "靠窗 01",
      x: 80,
      y: 90,
      w: 70,
      h: 50,
      status: "available",
      price: 6,
      tags: ["靠窗", "安静"],
    },
    {
      id: "S-02",
      name: "靠窗 02",
      x: 180,
      y: 90,
      w: 70,
      h: 50,
      status: "reserved",
      price: 6,
      tags: ["靠窗", "插座"],
    },
    {
      id: "S-03",
      name: "安静区 03",
      x: 280,
      y: 90,
      w: 70,
      h: 50,
      status: "available",
      price: 5,
      tags: ["安静"],
    },
    {
      id: "S-04",
      name: "插座位 04",
      x: 380,
      y: 90,
      w: 70,
      h: 50,
      status: "in_use",
      price: 5,
      tags: ["插座"],
    },
    {
      id: "S-05",
      name: "角落位",
      x: 80,
      y: 190,
      w: 70,
      h: 50,
      status: "available",
      price: 7,
      tags: ["角落", "插座"],
    },
    {
      id: "S-06",
      name: "安静区 06",
      x: 180,
      y: 190,
      w: 70,
      h: 50,
      status: "maintenance",
      price: 5,
      tags: ["安静"],
    },
    {
      id: "S-07",
      name: "插座位 07",
      x: 280,
      y: 190,
      w: 70,
      h: 50,
      status: "available",
      price: 5,
      tags: ["插座"],
    },
  ],
  reservations: [
    {
      seatId: "S-07",
      start: new Date(Date.now() + 60 * 60 * 1000),
      end: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
  ],
  selectedSeatId: null,
  selectedLayoutId: null,
  activeSession: null,
  orders: [],
  draftVersion: 3,
  publishedVersion: 2,
  wallet: {
    balanceCents: 5000,
    frozenCents: 0,
  },
  layoutItems: [
    { id: "W-01", type: "wall", x: 40, y: 40, w: 920, h: 12 },
    { id: "W-02", type: "wall", x: 40, y: 40, w: 12, h: 520 },
    { id: "W-03", type: "wall", x: 948, y: 40, w: 12, h: 520 },
    { id: "W-04", type: "wall", x: 40, y: 548, w: 920, h: 12 },
    { id: "W-05", type: "wall", x: 520, y: 40, w: 12, h: 180 },
    { id: "D-01", type: "door", x: 480, y: 548, w: 60, h: 12 },
    { id: "WN-01", type: "window", x: 40, y: 280, w: 12, h: 80 },
    { id: "A-01", type: "aisle", x: 140, y: 140, w: 260, h: 40 },
  ],
};

const dom = {
  modeButtons: document.querySelectorAll(".mode-btn"),
  panels: document.querySelectorAll(".panel"),
  userMap: document.getElementById("user-map"),
  merchantMap: document.getElementById("merchant-map"),
  resetView: document.getElementById("reset-view"),
  statusFilters: document.getElementById("status-filters"),
  tagFilters: document.getElementById("tag-filters"),
  clearFilters: document.getElementById("clear-filters"),
  bookingForm: document.getElementById("booking-form"),
  priceEstimate: document.getElementById("price-estimate"),
  userSeatDetail: document.getElementById("user-seat-detail"),
  sessionCard: document.getElementById("session-card"),
  timerValue: document.getElementById("timer-value"),
  timerMeta: document.getElementById("timer-meta"),
  sessionLog: document.getElementById("session-log"),
  startSession: document.getElementById("start-session"),
  extendSession: document.getElementById("extend-session"),
  endSession: document.getElementById("end-session"),
  addSeat: document.getElementById("add-seat"),
  addWall: document.getElementById("add-wall"),
  addDoor: document.getElementById("add-door"),
  addWindow: document.getElementById("add-window"),
  addAisle: document.getElementById("add-aisle"),
  saveDraft: document.getElementById("save-draft"),
  publishLayout: document.getElementById("publish-layout"),
  deleteItem: document.getElementById("delete-item"),
  toggleGrid: document.getElementById("toggle-grid"),
  seatForm: document.getElementById("seat-form"),
  wallForm: document.getElementById("wall-form"),
  merchantSeatDetail: document.getElementById("merchant-seat-detail"),
  editorLog: document.getElementById("editor-log"),
  versionPill: document.getElementById("version-pill"),
  toast: document.getElementById("toast"),
  viewOrder: document.getElementById("view-order"),
  modalBackdrop: document.getElementById("modal-backdrop"),
  orderModal: document.getElementById("order-modal"),
  closeModal: document.getElementById("close-modal"),
  orderDetail: document.getElementById("order-detail"),
  cancelOrder: document.getElementById("cancel-order"),
  confirmOrder: document.getElementById("confirm-order"),
  purchaseButtons: document.querySelectorAll(".purchase-btn"),
  privacyConsent: document.getElementById("privacy-consent"),
  loginClient: document.getElementById("login-client"),
  loginMerchant: document.getElementById("login-merchant"),
  authBackdrop: document.getElementById("auth-backdrop"),
  authModal: document.getElementById("auth-modal"),
  closeAuth: document.getElementById("close-auth"),
  authTitle: document.getElementById("auth-title"),
  authGateway: document.getElementById("auth-gateway"),
  authGatewayStatus: document.getElementById("auth-gateway-status"),
  authGatewayBtn: document.getElementById("auth-gateway-btn"),
  authFallbackBtn: document.getElementById("auth-fallback-btn"),
  authSms: document.getElementById("auth-sms"),
  authPhone: document.getElementById("auth-phone"),
  authCode: document.getElementById("auth-code"),
  authSendCode: document.getElementById("auth-send-code"),
  authSlider: document.getElementById("auth-slider"),
  authInviteWrap: document.getElementById("auth-invite-wrap"),
  authInvite: document.getElementById("auth-invite"),
  authVerifyBtn: document.getElementById("auth-verify-btn"),
  authCountry: document.getElementById("auth-country"),
  authInternationalNote: document.getElementById("auth-international-note"),
  intlSmsToggle: document.getElementById("intl-sms-toggle"),
};

let timerId = null;
let addSeatMode = false;
let addWallMode = false;
let addDoorMode = false;
let addWindowMode = false;
let addAisleMode = false;
let dragState = null;
let lastOrderId = null;
const filters = {
  status: new Set(),
  tags: new Set(),
};
const authState = {
  clientType: "CLIENT_APP",
  gatewayAvailable: false,
  smsCooldown: 0,
  smsTimerId: null,
  countryCode: "+86",
  localOnly: true,
};
const authErrors = {
  GATEWAY_UNAVAILABLE: "当前环境不支持网关取号",
  GATEWAY_FAIL: "网关取号失败，请改用短信验证",
  INVALID_PHONE: "手机号格式不正确",
  SMS_LIMIT: "短信发送过于频繁，请稍后再试",
  INVALID_CODE: "验证码错误",
  MERCHANT_PENDING: "商家资料审核中",
};

const formatTime = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDuration = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value) => String(value).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const showToast = (message) => {
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  setTimeout(() => dom.toast.classList.remove("show"), 2200);
};

const toggleModal = (show) => {
  dom.orderModal.classList.toggle("show", show);
  dom.modalBackdrop.classList.toggle("show", show);
};

const toggleAuthModal = (show) => {
  dom.authModal.classList.toggle("show", show);
  dom.authBackdrop.classList.toggle("show", show);
};

const ensurePrivacyAccepted = () => {
  if (!dom.privacyConsent.checked) {
    showToast("请先阅读并同意隐私协议");
    return false;
  }
  return true;
};

const detectGateway = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return connection && connection.type === "cellular";
};

const updateAuthView = () => {
  dom.authTitle.textContent =
    authState.clientType === "MERCHANT_APP" ? "商家端登录" : "用户端登录";
  dom.authInviteWrap.style.display =
    authState.clientType === "MERCHANT_APP" ? "grid" : "none";
  dom.authGatewayStatus.textContent = authState.gatewayAvailable
    ? "检测到蜂窝网络，可一键登录"
    : "当前环境不支持网关取号";
  dom.authGateway.style.display = authState.gatewayAvailable ? "grid" : "none";
  dom.authSms.style.display = authState.gatewayAvailable ? "none" : "grid";
  dom.authSlider.checked = false;
  dom.authCode.value = "";
  dom.authPhone.value = "";
  dom.authInvite.value = "";
  dom.authInternationalNote.style.display =
    authState.countryCode === "+86" ? "none" : "block";
  dom.authCountry
    .querySelectorAll("option")
    .forEach((opt) => {
      if (authState.localOnly && opt.value !== "+86") {
        opt.disabled = true;
        opt.hidden = true;
      } else {
        opt.disabled = false;
        opt.hidden = false;
      }
    });
};

const syncGatewayAvailability = () => {
  authState.countryCode = dom.authCountry.value || "+86";
  authState.gatewayAvailable = detectGateway() && authState.countryCode === "+86";
  updateAuthView();
};

const openAuthModal = (clientType) => {
  authState.clientType = clientType;
  authState.gatewayAvailable = detectGateway();
  authState.countryCode = dom.authCountry.value || "+86";
  if (authState.countryCode !== "+86") {
    authState.gatewayAvailable = false;
  }
  updateAuthView();
  toggleAuthModal(true);
};

const startSmsCooldown = () => {
  authState.smsCooldown = 60;
  dom.authSendCode.disabled = true;
  dom.authSendCode.textContent = `已发送 (${authState.smsCooldown}s)`;
  if (authState.smsTimerId) clearInterval(authState.smsTimerId);
  authState.smsTimerId = setInterval(() => {
    authState.smsCooldown -= 1;
    if (authState.smsCooldown <= 0) {
      clearInterval(authState.smsTimerId);
      dom.authSendCode.disabled = false;
      dom.authSendCode.textContent = "发送验证码";
      return;
    }
    dom.authSendCode.textContent = `已发送 (${authState.smsCooldown}s)`;
  }, 1000);
};

const handleAuthError = (code) => {
  const message = authErrors[code] || "登录失败，请稍后重试";
  showToast(message);
};

const apiRequest = (name, payload) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name === "gateway-login") {
        if (!authState.gatewayAvailable) {
          reject({ code: "GATEWAY_UNAVAILABLE" });
          return;
        }
        if (Math.random() < 0.2) {
          reject({ code: "GATEWAY_FAIL" });
          return;
        }
        resolve({ userId: "U-1001", roles: ["ROLE_CLIENT"] });
        return;
      }
      if (name === "sms-send") {
        if (!payload.countryCode || !payload.localNumber) {
          reject({ code: "INVALID_PHONE" });
          return;
        }
        if (payload.countryCode === "+86" && !/^1\\d{10}$/.test(payload.localNumber)) {
          reject({ code: "INVALID_PHONE" });
          return;
        }
        if (authState.smsCooldown > 0) {
          reject({ code: "SMS_LIMIT" });
          return;
        }
        resolve({ success: true });
        return;
      }
      if (name === "sms-verify") {
        if (payload.code !== "123456") {
          reject({ code: "INVALID_CODE" });
          return;
        }
        if (payload.clientType === "MERCHANT_APP" && !payload.invite) {
          reject({ code: "MERCHANT_PENDING" });
          return;
        }
        resolve({ userId: "U-1002", roles: ["ROLE_CLIENT", "ROLE_MERCHANT"] });
        return;
      }
      resolve({});
    }, 400);
  });

const getSeatById = (id) => state.seats.find((seat) => seat.id === id);
const getLayoutItemById = (id) =>
  state.layoutItems.find((item) => item.id === id);
const getOrderById = (id) => state.orders.find((order) => order.id === id);

const layoutLabel = (type) => {
  const map = { wall: "墙体", door: "门", window: "窗", aisle: "通道" };
  return map[type] || "布局";
};

const statusLabel = (status) => {
  const map = {
    available: "空闲",
    reserved: "已预约",
    in_use: "使用中",
    maintenance: "维护中",
  };
  return map[status] || status;
};

const orderStatusLabel = (status) => {
  const map = {
    RESERVED: "已预约",
    IN_USE: "使用中",
    COMPLETED: "已完成",
    COMPLETED_EARLY: "提前结束",
    CANCELLED: "已取消",
  };
  return map[status] || status;
};

const toCents = (amount) => Math.round(Number(amount || 0) * 100);

const calcChargeCents = (minutes, pricePerHourCents) => {
  const usedMinutes = Math.max(0, minutes);
  return Math.floor((usedMinutes * pricePerHourCents) / 60);
};

const setActiveMode = (mode) => {
  state.mode = mode;
  dom.modeButtons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.mode === mode);
  });
  dom.panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === mode);
  });
};

const buildGridPattern = () => {
  const gridSize = state.layout.grid;
  return `
    <defs>
      <pattern id="grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
        <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="#dfe6e9" stroke-width="1"/>
      </pattern>
    </defs>`;
};

const seatClass = (seat) => {
  if (seat.status === "available") return "seat available";
  if (seat.status === "reserved") return "seat reserved";
  if (seat.status === "in_use") return "seat in-use";
  return "seat maintenance";
};

const isSeatVisible = (seat) => {
  const statusOk =
    filters.status.size === 0 || filters.status.has(seat.status);
  const tagOk =
    filters.tags.size === 0 || seat.tags.some((tag) => filters.tags.has(tag));
  return statusOk && tagOk;
};

const renderSeatMap = (target, interactive = false) => {
  const seatNodes = state.seats
    .filter(isSeatVisible)
    .map(
      (seat) => `
    <g class="${seatClass(seat)}" data-seat="${seat.id}">
      <rect x="${seat.x}" y="${seat.y}" width="${seat.w}" height="${seat.h}" rx="10" ry="10"></rect>
      <text x="${seat.x + seat.w / 2}" y="${seat.y + seat.h / 2}" text-anchor="middle" dominant-baseline="central">${seat.id}</text>
    </g>`
    )
    .join("");

  const grid = state.gridEnabled ? 'fill="url(#grid)"' : "";

  target.innerHTML = `
    ${buildGridPattern()}
    <rect width="${state.layout.width}" height="${state.layout.height}" ${grid} rx="16" ry="16"></rect>
    ${renderLayoutNodes(false, false)}
    ${seatNodes}
  `;

  if (interactive) {
    target.querySelectorAll("g[data-seat]").forEach((node) => {
      node.addEventListener("click", () => {
        const seatId = node.dataset.seat;
        selectSeat(seatId);
      });
    });
  }
};

const renderLayoutNodes = (interactive = false, showLabels = false) => {
  return state.layoutItems
    .map(
      (item) => `
    <g class="layout-item ${item.type} ${interactive && state.selectedLayoutId === item.id ? "selected" : ""}" data-layout="${item.id}">
      <rect class="draggable" x="${item.x}" y="${item.y}" width="${item.w}" height="${item.h}" rx="4" ry="4"></rect>
      ${showLabels ? `<text x="${item.x + item.w / 2}" y="${item.y + item.h / 2}" text-anchor="middle" dominant-baseline="central">${item.id}</text>` : ""}
    </g>`
    )
    .join("");
};

const renderEditorMap = () => {
  const seatNodes = state.seats.map(
    (seat) => `
    <g class="${seatClass(seat)} ${state.selectedSeatId === seat.id ? "selected" : ""}" data-seat="${seat.id}">
      <rect class="draggable" x="${seat.x}" y="${seat.y}" width="${seat.w}" height="${seat.h}" rx="10" ry="10"></rect>
      <text x="${seat.x + seat.w / 2}" y="${seat.y + seat.h / 2}" text-anchor="middle" dominant-baseline="central">${seat.id}</text>
    </g>`
  );
  const grid = state.gridEnabled ? 'fill="url(#grid)"' : "";
  dom.merchantMap.innerHTML = `
    ${buildGridPattern()}
    <rect width="${state.layout.width}" height="${state.layout.height}" ${grid} rx="16" ry="16"></rect>
    ${renderLayoutNodes(true, true)}
    ${seatNodes.join("")}
    ${renderResizeHandles()}
  `;
};

const renderResizeHandles = () => {
  const target =
    state.selectedSeatId
      ? getSeatById(state.selectedSeatId)
      : state.selectedLayoutId
      ? getLayoutItemById(state.selectedLayoutId)
      : null;
  if (!target) return "";
  const { x, y, w, h } = target;
  const size = 10;
  return `
    <rect class="handle nw" data-handle="nw" x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" rx="2" ry="2"></rect>
    <rect class="handle ne" data-handle="ne" x="${x + w - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" rx="2" ry="2"></rect>
    <rect class="handle sw" data-handle="sw" x="${x - size / 2}" y="${y + h - size / 2}" width="${size}" height="${size}" rx="2" ry="2"></rect>
    <rect class="handle se" data-handle="se" x="${x + w - size / 2}" y="${y + h - size / 2}" width="${size}" height="${size}" rx="2" ry="2"></rect>
  `;
};

const renderUserSeatDetail = () => {
  const seat = getSeatById(state.selectedSeatId);
  if (!seat) {
    dom.userSeatDetail.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"></div>
        未选择座位
      </div>`;
    dom.priceEstimate.textContent = "¥0";
    return;
  }
  dom.userSeatDetail.innerHTML = `
    <h4>${seat.name}</h4>
    <div class="seat-meta">座位 ${seat.id} · ${statusLabel(seat.status)}</div>
    <div class="seat-meta">价格 ¥${seat.price}/小时</div>
    <div class="seat-tags">
      ${seat.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>
  `;
  updateEstimate();
};

const updateEstimate = () => {
  const seat = getSeatById(state.selectedSeatId);
  if (!seat) return;
  const duration = Number(dom.bookingForm.duration.value || 0);
  dom.priceEstimate.textContent = `¥${duration * seat.price}`;
};

const setSessionStatus = (active) => {
  const statusPill = dom.sessionCard.querySelector(".status-pill");
  if (active) {
    statusPill.textContent = "进行中";
    statusPill.style.background = "rgba(0, 184, 148, 0.12)";
    statusPill.style.color = "var(--primary-dark)";
  } else {
    statusPill.textContent = "未开始";
    statusPill.style.background = "rgba(9, 132, 227, 0.12)";
    statusPill.style.color = "var(--accent)";
  }
};

const startTimer = () => {
  if (!state.activeSession) return;
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    const now = new Date();
    const elapsed = now - state.activeSession.start;
    const remaining = state.activeSession.end - now;
    dom.timerValue.textContent = formatDuration(elapsed);
    dom.timerMeta.textContent =
      remaining > 0
        ? `预计结束 ${formatTime(state.activeSession.end)}`
        : "已超时，请及时结束";
  }, 1000);
};

const stopTimer = () => {
  if (timerId) clearInterval(timerId);
  timerId = null;
};

const logSession = (message) => {
  const time = formatTime(new Date());
  const item = document.createElement("div");
  item.textContent = `${time} · ${message}`;
  dom.sessionLog.prepend(item);
};

const logEditor = (message) => {
  const time = formatTime(new Date());
  const item = document.createElement("div");
  item.textContent = `${time} · ${message}`;
  dom.editorLog.prepend(item);
};

const createReservation = (seat, start, end) => {
  if (seat.status !== "available") {
    showToast("座位不可用");
    return false;
  }
  const conflict = state.reservations.some(
    (item) => item.seatId === seat.id && !(end <= item.start || start >= item.end)
  );
  if (conflict) {
    showToast("该时段已被预约");
    return false;
  }
  const orderId = `O-${Date.now()}`;
  const pricePerHourCents = toCents(seat.price);
  state.orders.push({
    id: orderId,
    seatId: seat.id,
    status: "RESERVED",
    reservedStartTime: start,
    startTime: null,
    expectedEndTime: end,
    actualEndTime: null,
    pricePerHourCents,
    holdCents: 0,
    totalFeeCents: 0,
  });
  state.reservations.push({ seatId: seat.id, start, end, orderId });
  seat.status = "reserved";
  lastOrderId = orderId;
  renderAll();
  logSession(`已预约 ${seat.id} ${formatTime(start)}-${formatTime(end)}`);
  return true;
};

const beginSession = () => {
  const seat = getSeatById(state.selectedSeatId);
  if (!seat) {
    showToast("请先选择座位");
    return;
  }
  if (seat.status !== "reserved" && seat.status !== "available") {
    showToast("该座位无法开始计时");
    return;
  }
  const now = new Date();
  let order =
    lastOrderId ? getOrderById(lastOrderId) : null;
  if (!order || order.seatId !== seat.id) {
    const expectedEnd = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const orderId = `O-${Date.now()}`;
    order = {
      id: orderId,
      seatId: seat.id,
      status: "RESERVED",
      reservedStartTime: now,
      startTime: null,
      expectedEndTime: expectedEnd,
      actualEndTime: null,
      pricePerHourCents: toCents(seat.price),
      holdCents: 0,
      totalFeeCents: 0,
    };
    state.orders.push(order);
    lastOrderId = orderId;
    state.reservations.push({
      seatId: seat.id,
      start: now,
      end: expectedEnd,
      orderId,
    });
  }
  order.startTime = now;
  order.status = "IN_USE";
  const expectedMinutes = Math.max(
    0,
    Math.floor((order.expectedEndTime - order.startTime) / 60000)
  );
  const holdCents = calcChargeCents(expectedMinutes, order.pricePerHourCents);
  if (order.holdCents === 0 && holdCents > 0) {
    order.holdCents = holdCents;
    state.wallet.balanceCents -= holdCents;
    state.wallet.frozenCents += holdCents;
  }
  state.activeSession = {
    orderId: order.id,
    seatId: seat.id,
    start: now,
    end: order.expectedEndTime,
  };
  seat.status = "in_use";
  renderAll();
  setSessionStatus(true);
  startTimer();
  logSession(`已开始使用 ${seat.id}`);
};

const endSession = () => {
  if (!state.activeSession) {
    showToast("暂无进行中订单");
    return;
  }
  const order = getOrderById(state.activeSession.orderId);
  const seat = getSeatById(state.activeSession.seatId);
  const actualEnd = new Date();
  const spent = actualEnd - state.activeSession.start;
  const minutesUsed = Math.floor(spent / 60000);
  const totalFeeCents = calcChargeCents(
    minutesUsed,
    order?.pricePerHourCents || 0
  );
  if (order) {
    order.actualEndTime = actualEnd;
    order.totalFeeCents = totalFeeCents;
    order.status =
      actualEnd < order.expectedEndTime ? "COMPLETED_EARLY" : "COMPLETED";
    const settleCents = totalFeeCents - order.holdCents;
    if (settleCents > 0) {
      state.wallet.balanceCents -= settleCents;
    } else if (settleCents < 0) {
      state.wallet.balanceCents += Math.abs(settleCents);
    }
    state.wallet.frozenCents -= order.holdCents;
  }
  if (seat) seat.status = "available";
  logSession(`已结束，使用时长 ${formatDuration(spent)}`);
  state.activeSession = null;
  setSessionStatus(false);
  dom.timerValue.textContent = "00:00:00";
  dom.timerMeta.textContent = "暂无进行中订单";
  stopTimer();
  renderAll();
};

const extendSession = () => {
  if (!state.activeSession) {
    showToast("暂无进行中订单");
    return;
  }
  const seat = getSeatById(state.activeSession.seatId);
  const order = getOrderById(state.activeSession.orderId);
  const extra = 60 * 60 * 1000;
  const proposedEnd = new Date(state.activeSession.end.getTime() + extra);
  const conflict = state.reservations.some(
    (item) =>
      item.seatId === seat.id &&
      item.orderId !== state.activeSession.orderId &&
      !(proposedEnd <= item.start || state.activeSession.end >= item.end)
  );
  if (conflict) {
    showToast("无法延长，后续已被预约");
    logSession("延长失败：存在冲突预约");
    return;
  }
  const extraMinutes = Math.floor(extra / 60000);
  if (order) {
    const extraHold = calcChargeCents(extraMinutes, order.pricePerHourCents);
    order.holdCents += extraHold;
    order.expectedEndTime = proposedEnd;
    state.wallet.balanceCents -= extraHold;
    state.wallet.frozenCents += extraHold;
  }
  state.activeSession.end = proposedEnd;
  const reservation = state.reservations.find(
    (item) => item.orderId === state.activeSession.orderId
  );
  if (reservation) {
    reservation.end = proposedEnd;
  }
  logSession("已延长 1 小时");
  startTimer();
};

const selectSeat = (seatId) => {
  state.selectedSeatId = seatId;
  state.selectedLayoutId = null;
  renderUserSeatDetail();
  updateSeatForm();
  renderEditorMap();
};

const selectLayoutItem = (itemId) => {
  state.selectedLayoutId = itemId;
  state.selectedSeatId = null;
  updateLayoutForm();
  renderEditorMap();
};

const updateSeatForm = () => {
  const seat = getSeatById(state.selectedSeatId);
  dom.seatForm.classList.toggle("is-hidden", !seat);
  dom.wallForm.classList.toggle("is-hidden", true);
  if (!seat) {
    dom.merchantSeatDetail.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"></div>
        未选择组件
      </div>`;
    return;
  }
  dom.merchantSeatDetail.innerHTML = `
    <h4>${seat.name}</h4>
    <div class="seat-meta">座位 ${seat.id}</div>
    <div class="seat-meta">状态：${statusLabel(seat.status)}</div>
  `;
  dom.seatForm.id.value = seat.id;
  dom.seatForm.name.value = seat.name;
  dom.seatForm.status.value = seat.status;
  dom.seatForm.price.value = seat.price;
  dom.seatForm.tags.value = seat.tags.join(", ");
};

const updateLayoutForm = () => {
  const item = getLayoutItemById(state.selectedLayoutId);
  dom.wallForm.classList.toggle("is-hidden", !item);
  dom.seatForm.classList.toggle("is-hidden", true);
  if (!item) {
    dom.merchantSeatDetail.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon"></div>
        未选择组件
      </div>`;
    return;
  }
  dom.merchantSeatDetail.innerHTML = `
    <h4>${layoutLabel(item.type)}</h4>
    <div class="seat-meta">编号 ${item.id}</div>
    <div class="seat-meta">尺寸 ${Math.round(item.w)} × ${Math.round(item.h)}</div>
  `;
  dom.wallForm.id.value = item.id;
  dom.wallForm.width.value = Math.round(item.w);
  dom.wallForm.height.value = Math.round(item.h);
};

const renderAll = () => {
  renderSeatMap(dom.userMap, true);
  renderEditorMap();
  renderUserSeatDetail();
};

const createChip = (label, value, group) => {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip";
  chip.textContent = label;
  chip.addEventListener("click", () => {
    const bucket = filters[group];
    if (bucket.has(value)) {
      bucket.delete(value);
      chip.classList.remove("is-active");
    } else {
      bucket.add(value);
      chip.classList.add("is-active");
    }
    renderAll();
  });
  return chip;
};

const renderFilters = () => {
  const statusItems = [
    { label: "空闲", value: "available" },
    { label: "已预约", value: "reserved" },
    { label: "使用中", value: "in_use" },
    { label: "维护中", value: "maintenance" },
  ];
  dom.statusFilters.innerHTML = "";
  statusItems.forEach((item) => {
    dom.statusFilters.appendChild(
      createChip(item.label, item.value, "status")
    );
  });

  const tagSet = new Set();
  state.seats.forEach((seat) => seat.tags.forEach((tag) => tagSet.add(tag)));
  dom.tagFilters.innerHTML = "";
  Array.from(tagSet).forEach((tag) => {
    dom.tagFilters.appendChild(createChip(tag, tag, "tags"));
  });
};

const addSeat = (x, y) => {
  const nextId = `S-${String(state.seats.length + 1).padStart(2, "0")}`;
  state.seats.push({
    id: nextId,
    name: `新座位 ${nextId}`,
    x: Math.max(0, Math.min(state.layout.width - 70, x - 35)),
    y: Math.max(0, Math.min(state.layout.height - 50, y - 25)),
    w: 70,
    h: 50,
    status: "available",
    price: 5,
    tags: ["新增"],
  });
  logEditor(`新增座位 ${nextId}`);
  renderAll();
};

const addLayoutItem = (type, x, y) => {
  const prefixMap = { wall: "W", door: "D", window: "WN", aisle: "A" };
  const count =
    state.layoutItems.filter((item) => item.type === type).length + 1;
  const prefix = prefixMap[type] || "L";
  const nextId = `${prefix}-${String(count).padStart(2, "0")}`;
  const sizeMap = {
    wall: { w: 120, h: 16 },
    door: { w: 60, h: 12 },
    window: { w: 16, h: 80 },
    aisle: { w: 180, h: 40 },
  };
  const size = sizeMap[type] || { w: 80, h: 30 };
  state.layoutItems.push({
    id: nextId,
    type,
    x: Math.max(0, Math.min(state.layout.width - size.w, x - size.w / 2)),
    y: Math.max(0, Math.min(state.layout.height - size.h, y - size.h / 2)),
    w: size.w,
    h: size.h,
  });
  logEditor(`新增${layoutLabel(type)} ${nextId}`);
  renderAll();
};

const setAddMode = (mode) => {
  addSeatMode = mode === "seat";
  addWallMode = mode === "wall";
  addDoorMode = mode === "door";
  addWindowMode = mode === "window";
  addAisleMode = mode === "aisle";
  dom.addSeat.classList.toggle("is-active", addSeatMode);
  dom.addWall.classList.toggle("is-active", addWallMode);
  dom.addDoor.classList.toggle("is-active", addDoorMode);
  dom.addWindow.classList.toggle("is-active", addWindowMode);
  dom.addAisle.classList.toggle("is-active", addAisleMode);
};

const getSvgPoint = (event) => {
  const rect = dom.merchantMap.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * state.layout.width,
    y: ((event.clientY - rect.top) / rect.height) * state.layout.height,
  };
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const beginDrag = (target, mode, handle) => {
  dragState = {
    target,
    mode,
    handle,
    startX: target.x,
    startY: target.y,
    startW: target.w,
    startH: target.h,
    origin: null,
  };
};

const wireEvents = () => {
  dom.modeButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveMode(button.dataset.mode));
  });

  dom.intlSmsToggle.addEventListener("change", () => {
    authState.localOnly = !dom.intlSmsToggle.checked;
    if (authState.localOnly && dom.authCountry.value !== "+86") {
      dom.authCountry.value = "+86";
    }
    syncGatewayAvailability();
  });

  dom.authCountry.addEventListener("change", () => {
    if (authState.localOnly && dom.authCountry.value !== "+86") {
      dom.authCountry.value = "+86";
      showToast("当前仅支持 +86 号码");
    }
    syncGatewayAvailability();
  });

  dom.merchantMap.addEventListener("mousedown", (event) => {
    const handle = event.target.closest("[data-handle]");
    const seatNode = event.target.closest("[data-seat]");
    const layoutNode = event.target.closest("[data-layout]");
    if (handle) {
      event.preventDefault();
      const target =
        state.selectedSeatId
          ? getSeatById(state.selectedSeatId)
          : getLayoutItemById(state.selectedLayoutId);
      if (!target) return;
      beginDrag(target, "resize", handle.dataset.handle);
      dragState.origin = getSvgPoint(event);
      return;
    }
    if (seatNode) {
      const seatId = seatNode.dataset.seat;
      selectSeat(seatId);
      beginDrag(getSeatById(seatId), "move");
      dragState.origin = getSvgPoint(event);
    } else if (layoutNode) {
      const layoutId = layoutNode.dataset.layout;
      selectLayoutItem(layoutId);
      beginDrag(getLayoutItemById(layoutId), "move");
      dragState.origin = getSvgPoint(event);
    }
  });

  window.addEventListener("mousemove", (event) => {
    if (!dragState) return;
    const point = getSvgPoint(event);
    const dx = point.x - dragState.origin.x;
    const dy = point.y - dragState.origin.y;
    const minSize = 20;
    if (dragState.mode === "move") {
      dragState.target.x = clamp(
        dragState.startX + dx,
        0,
        state.layout.width - dragState.target.w
      );
      dragState.target.y = clamp(
        dragState.startY + dy,
        0,
        state.layout.height - dragState.target.h
      );
    } else if (dragState.mode === "resize") {
      let x = dragState.startX;
      let y = dragState.startY;
      let w = dragState.startW;
      let h = dragState.startH;
      const handle = dragState.handle;
      if (handle.includes("e")) {
        w = clamp(
          dragState.startW + dx,
          minSize,
          state.layout.width - dragState.startX
        );
      }
      if (handle.includes("s")) {
        h = clamp(
          dragState.startH + dy,
          minSize,
          state.layout.height - dragState.startY
        );
      }
      if (handle.includes("w")) {
        const newX = clamp(
          dragState.startX + dx,
          0,
          dragState.startX + dragState.startW - minSize
        );
        w = dragState.startW + (dragState.startX - newX);
        x = newX;
      }
      if (handle.includes("n")) {
        const newY = clamp(
          dragState.startY + dy,
          0,
          dragState.startY + dragState.startH - minSize
        );
        h = dragState.startH + (dragState.startY - newY);
        y = newY;
      }
      dragState.target.x = x;
      dragState.target.y = y;
      dragState.target.w = w;
      dragState.target.h = h;
    }
    updateSeatForm();
    updateLayoutForm();
    renderEditorMap();
  });

  window.addEventListener("mouseup", () => {
    if (dragState) {
      dragState = null;
    }
  });

  dom.resetView.addEventListener("click", () => showToast("已重置视图"));
  dom.clearFilters.addEventListener("click", () => {
    filters.status.clear();
    filters.tags.clear();
    renderFilters();
    renderAll();
    showToast("已清除筛选");
  });

  dom.bookingForm.addEventListener("input", updateEstimate);
  dom.bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const seat = getSeatById(state.selectedSeatId);
    if (!seat) {
      showToast("请先选择座位");
      return;
    }
    const date = dom.bookingForm.date.value;
    const startTime = dom.bookingForm.start.value;
    const duration = Number(dom.bookingForm.duration.value || 0);
    if (!date || !startTime || duration <= 0) {
      showToast("请完善预约信息");
      return;
    }
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    if (createReservation(seat, start, end)) {
      showToast("预约成功");
      renderOrderDetail();
      toggleModal(true);
    }
  });

  dom.viewOrder.addEventListener("click", () => {
    renderOrderDetail();
    toggleModal(true);
  });

  dom.closeModal.addEventListener("click", () => toggleModal(false));
  dom.modalBackdrop.addEventListener("click", () => toggleModal(false));

  dom.cancelOrder.addEventListener("click", () => {
    const order = lastOrderId ? getOrderById(lastOrderId) : null;
    if (!order) {
      showToast("暂无可取消订单");
      return;
    }
    const seat = getSeatById(order.seatId);
    if (seat) seat.status = "available";
    state.reservations = state.reservations.filter(
      (item) => item.orderId !== order.id
    );
    if (order.holdCents > 0) {
      state.wallet.balanceCents += order.holdCents;
      state.wallet.frozenCents -= order.holdCents;
    }
    order.status = "CANCELLED";
    lastOrderId = null;
    renderAll();
    toggleModal(false);
    showToast("已取消订单");
  });

  dom.confirmOrder.addEventListener("click", () => {
    if (!lastOrderId) {
      showToast("暂无可支付订单");
      return;
    }
    showToast("支付成功");
    toggleModal(false);
  });

  dom.purchaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.dataset.card;
      showToast(`已选择${card}，前往支付`);
    });
  });

  dom.loginClient.addEventListener("click", () => {
    if (!ensurePrivacyAccepted()) return;
    openAuthModal("CLIENT_APP");
  });
  dom.loginMerchant.addEventListener("click", () => {
    if (!ensurePrivacyAccepted()) return;
    openAuthModal("MERCHANT_APP");
  });
  dom.closeAuth.addEventListener("click", () => toggleAuthModal(false));
  dom.authBackdrop.addEventListener("click", () => toggleAuthModal(false));

  dom.authGatewayBtn.addEventListener("click", () => {
    if (!ensurePrivacyAccepted()) return;
    apiRequest("gateway-login", { clientType: authState.clientType })
      .then(() => {
        showToast("一键登录成功");
        toggleAuthModal(false);
      })
      .catch((error) => {
        handleAuthError(error.code);
        authState.gatewayAvailable = false;
        updateAuthView();
      });
  });

  dom.authFallbackBtn.addEventListener("click", () => {
    if (!ensurePrivacyAccepted()) return;
    authState.gatewayAvailable = false;
    updateAuthView();
  });

  dom.authSendCode.addEventListener("click", () => {
    if (!ensurePrivacyAccepted()) return;
    const localNumber = dom.authPhone.value.trim();
    const countryCode = dom.authCountry.value;
    if (!localNumber) {
      showToast("请输入手机号");
      return;
    }
    if (!dom.authSlider.checked) {
      showToast("请先完成滑动验证");
      return;
    }
    apiRequest("sms-send", { countryCode, localNumber })
      .then(() => {
        startSmsCooldown();
        showToast("验证码已发送");
      })
      .catch((error) => handleAuthError(error.code));
  });

  dom.authVerifyBtn.addEventListener("click", () => {
    if (!ensurePrivacyAccepted()) return;
    const localNumber = dom.authPhone.value.trim();
    const countryCode = dom.authCountry.value;
    const code = dom.authCode.value.trim();
    if (!localNumber || !code) {
      showToast("请输入手机号和验证码");
      return;
    }
    if (!dom.authSlider.checked) {
      showToast("请先完成滑动验证");
      return;
    }
    apiRequest("sms-verify", {
      countryCode,
      localNumber,
      code,
      clientType: authState.clientType,
      invite: dom.authInvite.value.trim(),
    })
      .then(() => {
        if (authState.clientType === "MERCHANT_APP") {
          showToast("商家端登录成功");
        } else {
          showToast("用户登录成功");
        }
        toggleAuthModal(false);
      })
      .catch((error) => handleAuthError(error.code));
  });

  dom.startSession.addEventListener("click", beginSession);
  dom.endSession.addEventListener("click", endSession);
  dom.extendSession.addEventListener("click", extendSession);

  dom.addSeat.addEventListener("click", () => {
    const next = !addSeatMode;
    setAddMode(next ? "seat" : null);
    showToast(next ? "点击画布新增座位" : "已退出新增模式");
  });

  dom.addWall.addEventListener("click", () => {
    const next = !addWallMode;
    setAddMode(next ? "wall" : null);
    showToast(next ? "点击画布新增墙体" : "已退出新增模式");
  });

  dom.addDoor.addEventListener("click", () => {
    const next = !addDoorMode;
    setAddMode(next ? "door" : null);
    showToast(next ? "点击画布新增门" : "已退出新增模式");
  });

  dom.addWindow.addEventListener("click", () => {
    const next = !addWindowMode;
    setAddMode(next ? "window" : null);
    showToast(next ? "点击画布新增窗" : "已退出新增模式");
  });

  dom.addAisle.addEventListener("click", () => {
    const next = !addAisleMode;
    setAddMode(next ? "aisle" : null);
    showToast(next ? "点击画布新增通道" : "已退出新增模式");
  });

  dom.merchantMap.addEventListener("click", (event) => {
    if (event.target.closest("[data-seat], [data-layout], [data-handle]")) {
      return;
    }
    const rect = dom.merchantMap.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * state.layout.width;
    const y = ((event.clientY - rect.top) / rect.height) * state.layout.height;
    if (addSeatMode) addSeat(x, y);
    if (addWallMode) addLayoutItem("wall", x, y);
    if (addDoorMode) addLayoutItem("door", x, y);
    if (addWindowMode) addLayoutItem("window", x, y);
    if (addAisleMode) addLayoutItem("aisle", x, y);
  });

  dom.saveDraft.addEventListener("click", () => {
    state.draftVersion += 1;
    dom.versionPill.textContent = `草稿 v${state.draftVersion}`;
    logEditor("草稿已保存");
    showToast("草稿已保存");
  });

  dom.publishLayout.addEventListener("click", () => {
    state.publishedVersion = state.draftVersion;
    dom.versionPill.textContent = `已发布 v${state.publishedVersion}`;
    logEditor("图纸已发布");
    showToast("图纸已发布");
  });

  dom.toggleGrid.addEventListener("click", () => {
    state.gridEnabled = !state.gridEnabled;
    renderAll();
  });

  dom.seatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const seat = getSeatById(state.selectedSeatId);
    if (!seat) {
      showToast("请先选择座位");
      return;
    }
    const nextId = dom.seatForm.id.value.trim() || seat.id;
    const previousId = seat.id;
    seat.id = nextId;
    seat.name = dom.seatForm.name.value.trim() || seat.name;
    seat.status = dom.seatForm.status.value;
    seat.price = Number(dom.seatForm.price.value || seat.price);
    seat.tags = dom.seatForm.tags.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (previousId !== nextId) {
      state.reservations.forEach((item) => {
        if (item.seatId === previousId) item.seatId = nextId;
      });
      if (state.activeSession?.seatId === previousId) {
        state.activeSession.seatId = nextId;
      }
      state.selectedSeatId = nextId;
    }
    logEditor(`已更新 ${seat.id}`);
    renderAll();
  });

  dom.deleteItem.addEventListener("click", () => {
    if (state.selectedSeatId) {
      const seatId = state.selectedSeatId;
      state.seats = state.seats.filter((seat) => seat.id !== seatId);
      state.reservations = state.reservations.filter(
        (item) => item.seatId !== seatId
      );
      if (state.activeSession?.seatId === seatId) {
        state.activeSession = null;
        setSessionStatus(false);
      }
      state.selectedSeatId = null;
      logEditor(`已删除座位 ${seatId}`);
      renderAll();
      return;
    }
    if (state.selectedLayoutId) {
      const itemId = state.selectedLayoutId;
      const item = getLayoutItemById(itemId);
      const label = item ? layoutLabel(item.type) : "布局";
      state.layoutItems = state.layoutItems.filter((item) => item.id !== itemId);
      state.selectedLayoutId = null;
      logEditor(`已删除${label} ${itemId}`);
      renderAll();
      return;
    }
    showToast("请先选择需要删除的组件");
  });

  dom.wallForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const item = getLayoutItemById(state.selectedLayoutId);
    if (!item) {
      showToast("请先选择布局组件");
      return;
    }
    const nextId = dom.wallForm.id.value.trim() || item.id;
    const previousId = item.id;
    item.id = nextId;
    item.w = Math.max(20, Number(dom.wallForm.width.value || item.w));
    item.h = Math.max(20, Number(dom.wallForm.height.value || item.h));
    if (previousId !== nextId) {
      state.selectedLayoutId = nextId;
    }
    logEditor(`已更新 ${item.id}`);
    renderAll();
  });
};

const renderOrderDetail = () => {
  const order = lastOrderId ? getOrderById(lastOrderId) : null;
  if (!order) {
    dom.orderDetail.innerHTML =
      '<div class="modal-row"><span>暂无订单</span><strong>--</strong></div>';
    return;
  }
  const expectedBase = order.startTime || order.reservedStartTime || order.expectedEndTime;
  const expectedMinutes = Math.max(
    0,
    Math.floor((order.expectedEndTime - expectedBase) / 60000)
  );
  const actualMinutes = order.actualEndTime && order.startTime
    ? Math.floor((order.actualEndTime - order.startTime) / 60000)
    : null;
  const totalFee = (order.totalFeeCents / 100).toFixed(2);
  const hold = (order.holdCents / 100).toFixed(2);
  const balance = (state.wallet.balanceCents / 100).toFixed(2);
  dom.orderDetail.innerHTML = `
    <div class="modal-row"><span>订单状态</span><strong>${orderStatusLabel(order.status)}</strong></div>
    <div class="modal-row"><span>座位</span><strong>${order.seatId}</strong></div>
    <div class="modal-row"><span>开始时间</span><strong>${order.startTime ? formatTime(order.startTime) : "--"}</strong></div>
    <div class="modal-row"><span>预计结束</span><strong>${formatTime(order.expectedEndTime)}</strong></div>
    <div class="modal-row"><span>实际结束</span><strong>${order.actualEndTime ? formatTime(order.actualEndTime) : "--"}</strong></div>
    <div class="modal-row"><span>预计时长</span><strong>${expectedMinutes} 分钟</strong></div>
    <div class="modal-row"><span>实际时长</span><strong>${actualMinutes === null ? "--" : `${actualMinutes} 分钟`}</strong></div>
    <div class="modal-row"><span>冻结金额</span><strong>¥${hold}</strong></div>
    <div class="modal-row"><span>实结金额</span><strong>¥${totalFee}</strong></div>
    <div class="modal-row"><span>钱包余额</span><strong>¥${balance}</strong></div>
  `;
};

const initFormDefaults = () => {
  const today = new Date();
  dom.bookingForm.date.value = today.toISOString().slice(0, 10);
  dom.bookingForm.start.value = formatTime(today);
  updateEstimate();
  setSessionStatus(false);
  dom.versionPill.textContent = `草稿 v${state.draftVersion}`;
  dom.seatForm.classList.add("is-hidden");
  dom.wallForm.classList.add("is-hidden");
  state.selectedSeatId = null;
  state.selectedLayoutId = null;
  dom.intlSmsToggle.checked = false;
  authState.localOnly = true;
  dom.authCountry.value = "+86";
};

const addSeatStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    .seat rect { stroke: #0f1720; stroke-width: 1; fill: #e9f1ef; }
    .seat text { font-size: 12px; fill: #0f1720; font-weight: 600; }
    .seat.available rect { fill: rgba(0, 184, 148, 0.18); stroke: #00b894; }
    .seat.reserved rect { fill: rgba(9, 132, 227, 0.18); stroke: #0984e3; }
    .seat.in-use rect { fill: #0984e3; stroke: #065a9f; }
    .seat.in-use text { fill: #ffffff; }
    .seat.maintenance rect { fill: #b2bec3; stroke: #7f8c8d; }
  `;
  document.head.appendChild(style);
};

initFormDefaults();
addSeatStyles();
renderFilters();
renderAll();
wireEvents();
