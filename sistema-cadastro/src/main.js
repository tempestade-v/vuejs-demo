import Vue from "vue";
import "./css/style.css";
import App from "./App.vue";

/* plugins */
import VueMask from "v-mask";
import "./plugins/bootstrap-vue";
import "./plugins/axios";

Vue.use(VueMask);

/* filters */
Vue.filter("moneyBRL", (value) => {
  return `R$${value.toFixed(2)}`;
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
