import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export const routesName = {
  SCREENSHOT_OF_RESULTS: "ScreenshotOfResults",
  AUTHORIZED_LINKEDIN: "AuthorizedLinkedin",
};

const routes = [
  {
    path: "/",
    name: routesName.AUTHORIZED_LINKEDIN,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../сomponents/AuthorizedLinkedin.vue"
      ),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
