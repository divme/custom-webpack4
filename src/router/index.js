import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export const constantRouterMap = [
  {
    path: '/',
    // component: () => import('@/views/home/index')
    component: () => import('@/views/jsx/index')
  }
];

export default new Router({
  mode: 'hash',
  routes: constantRouterMap
});
