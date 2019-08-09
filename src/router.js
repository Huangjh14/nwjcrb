import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import problemList from './views/problemList.vue'
import problemDetail from './views/problemDetail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      alias: '/',
      // meta: {
      //   title: '2019年7月3日第三方测试日报'
      // }
    },
    {
      path: '/problemList:dateStr/:type',
      name: 'problemList',
      component: problemList,
      // meta: {
      //   title: '2019年7月3日问题列表',
      // }
    },
    {
      path: '/problemDetail:dateStr/:bugId/:area/:createTime',
      name: 'problemDetail',
      component: problemDetail,
      // meta: {
      //   title: '问题详情',
      // }
    }
  ]
})
