import Vue from "vue";
import VueRouter from "vue-router";
import SalesForm from "@/views/SalesForm.vue";
import Employees from "@/views/Employees.vue";
import Home from "@/views/Home.vue";
import PendingSales from "@/views/PendingSales.vue";
import Shipments from "@/views/Shipments.vue";
import Refunds from "@/views/Refunds.vue";
import storeData from "@/storeData";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/pendingSales",
    name: "PendingSales",
    component: PendingSales,
  },
  {
    path: "/salesForm",
    name: "SalesForm",
    component: SalesForm,
  },
  {
    path: "/employees",
    name: "Employees",
    component: Employees,
  },
  {
    path: "/shipments",
    name: "Shipments",
    component: Shipments,
  },
  {
    path: "/refunds",
    name: "Refunds",
    component: Refunds,
  },
  /*
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" '../views/About.vue')
  }
  */
];

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach((to, from, next) => {
  if (to.path !== "/") {
    if (!storeData.storeId) {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    if (!storeData.storeId) {
      next();
    } else {
      next({ name: "PendingSales" });
    }
  }
});
export default router;
