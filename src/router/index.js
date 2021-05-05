import Vue from "vue";
import VueRouter from "vue-router";
import SalesForm from "@/views/SalesForm.vue";
import Employees from "@/views/Employees.vue";
import Home from "@/views/Home.vue";
import PendingSales from "@/views/PendingSales.vue";
import Shipments from "@/views/Shipments.vue";
import Refunds from "@/views/Refunds.vue";
import storeData from "@/storeData";
import CreateShipment from "@/views/CreateShipment";
import ReceiveShipment from "@/views/ReceiveShipment";
import StoreInventory from "@/views/StoreInventory";
import Login from "@/views/Login.vue";
import store from "@/store/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
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
    path: "/refunds",
    name: "Refunds",
    component: Refunds,
  },
  {
    path: "/storeInventory",
    name: "Store Inventory",
    component: StoreInventory,
  },
  {
    path: "/shipments",
    component: Shipments,
    children: [
      {
        path: "CreateShipments",
        name: "Create Shipments",
        component: CreateShipment,
      },
      {
        path: "ReceiveShipments",
        name: "Receive Shipments",
        component: ReceiveShipment,
      },
    ],
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
  if (!store.getters.loggedIn) {
    if (to.name === "Login") {
      next();
    } else {
      next({ name: "Login" });
    }
  } else {
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
  }
});
export default router;
