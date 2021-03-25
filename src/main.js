import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {Table, ConfigProgrammatic} from "buefy";
import "buefy/dist/buefy.css";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import VueHtmlToPaper from 'vue-html-to-paper';


const options = {
  name: '_blank',
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}

Vue.component("faIcon", FontAwesomeIcon);

Vue.use(VueHtmlToPaper, options);
Vue.use(Table);

ConfigProgrammatic.setOptions({
  defaultIconPack: "fas",
  defaultIconComponent: "faIcon",
});

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
