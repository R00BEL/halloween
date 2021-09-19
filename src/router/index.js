import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export const routesName = {
  SCREENSHOT_OF_RESULTS: "ScreenshotOfResults",
  BUTTON_LINKEDIN: "buttonLinkedin",
};

const routes = [
  {
    path: "/screenshot-of-results",
    name: routesName.SCREENSHOT_OF_RESULTS,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../сomponents/ScreenshotOfResults.vue"
      ),
  },
  {
    path: "/",
    name: routesName.BUTTON_LINKEDIN,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../сomponents/buttonLinkedin.vue"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
