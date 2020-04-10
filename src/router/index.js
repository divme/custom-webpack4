import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/home/index'),
    children: [
      {
        path: '/testform',
        component: () => import('@/views/testForm')
      },
      {
        path: '/drag',
        component: () => import('@/views/drag')
      }
    ]
  }
];

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
