import Vue from "vue";
import VueRouter from "vue-router";
import SalesForm from "../components/SalesForm.vue";
import Employees from "../components/Employees.vue";
import Home from "@/views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
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

export default router;
