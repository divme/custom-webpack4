import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN'; // lang i18n

import App from './App.vue';
import router from './router';

Vue.use(ElementUI, {locale});
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});
// if(module && module.hot) {
//   module.hot.accept()
// }
