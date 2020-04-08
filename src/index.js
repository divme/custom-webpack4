// import '@babel/polyfill'
import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'

import '@/omoComponents' // 组件

Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
