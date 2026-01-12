import { createRouter, createWebHistory } from "vue-router";
import ClientHome from "../views/client/ClientHome.vue";
import ClientBooking from "../views/client/ClientBooking.vue";
import ClientWallet from "../views/client/ClientWallet.vue";
import ClientOrders from "../views/client/ClientOrders.vue";
import MerchantHome from "../views/merchant/MerchantHome.vue";
import MerchantRooms from "../views/merchant/MerchantRooms.vue";

const routes = [
  { path: "/", redirect: "/client/home" },
  { path: "/client/home", component: ClientHome },
  { path: "/client/booking", component: ClientBooking },
  { path: "/client/wallet", component: ClientWallet },
  { path: "/client/orders", component: ClientOrders },
  { path: "/merchant/home", component: MerchantHome },
  { path: "/merchant/rooms", component: MerchantRooms },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
