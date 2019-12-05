import Vue from "vue";
import VueFirestore from 'vue-firestore';
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

Vue.use(VueFirestore);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
