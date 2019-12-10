import Vue from "vue";
import VueFirestore from 'vue-firestore';
import App from "./App.vue";
import router from "./router";

import {auth} from './firebase';

Vue.config.productionTip = false;

Vue.use(VueFirestore);

let app = '';

auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount("#app");
  }
});
