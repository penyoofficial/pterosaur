import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Lyrics.vue"),
    },
    {
      path: "/history",
      component: () => import("@/views/HistoryList.vue"),
    },
    {
      path: "/debug",
      component: () => import("@/views/Debug.vue"),
    },
  ],
});

export default router;
