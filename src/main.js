import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Table, ConfigProgrammatic } from "buefy";
import "buefy/dist/buefy.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import VueHtmlToPaper from "vue-html-to-paper";
import store from "./store/store.js";
import axios from "axios";
import firebaseAuth from "../firebase";

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

axios.interceptors.request.use((config) => {
  if (store.getters.loggedIn) {
    config.headers = { Authorization: `Bearer ${store.state.idToken}` };
  }

  return config;
});

const options = {
  name: "_blank",
  styles: [
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://unpkg.com/kidlat-css/css/kidlat.css",
  ],
};

Vue.component("faIcon", FontAwesomeIcon);

Vue.use(VueHtmlToPaper, options);
Vue.use(Table);

ConfigProgrammatic.setOptions({
  defaultIconPack: "fas",
  defaultIconComponent: "faIcon",
});

Vue.config.productionTip = false;
let app;

firebaseAuth.onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }

  if (user) {
    store.dispatch("getUserToken");
  } else {
    store.dispatch("logout");
  }
});
