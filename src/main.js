import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import view from './assets/js/view'
import echarts from 'echarts'
import axios from 'axios'
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = axios
Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//   /* 路由发生变化修改页面title */
//   if (to.meta.title) {
//     document.title = to.meta.title
//   }
//   next()
// })

new Vue({
  view,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
