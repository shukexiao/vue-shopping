import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/views/layout/index.vue'
import LayoutHome from '@/views/layout/home.vue'
import LayoutCategory from '@/views/layout/category.vue'
import LayoutCart from '@/views/layout/cart.vue'
import LayoutUser from '@/views/layout/user.vue'

import store from '@/store'
// 路由懒加载
const Login = () => import('@/views/login/index.vue')
const searchList = () => import('@/views/search/list.vue')
const SearchIndex = () => import('@/views/search')
const PayIndex = () => import('@/views/pay')
const ProDetailIndex = () => import('@/views/prodetail')
const MyOrderIndex = () => import('@/views/myorder')
const AddressIndex = () => import('@/views/address')
const AddressEdit = () => import('@/views/address/edit')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: 'home', component: LayoutHome },
        { path: 'category', component: LayoutCategory },
        { path: 'cart', component: LayoutCart },
        { path: 'user', component: LayoutUser }
      ]
    },
    { path: '/search', component: SearchIndex },
    { path: '/searchlist', component: searchList },
    { path: '/prodetail/:id', component: ProDetailIndex },
    { path: '/pay', component: PayIndex },
    { path: '/myorder', component: MyOrderIndex },
    { path: '/address', component: AddressIndex },
    { path: '/address/edit', component: AddressEdit }
  ]
})
// 需要权限访问的页面
const authUrls = ['/pay', '/myorder', '/address', '/address/edit']
// 全局前置导航守卫
router.beforeEach((to, from, next) => {
  // 判断to.path是否包含在受限访问页面数组authUrls里
  if (!authUrls.includes(to.path)) {
    next()
    return
  }
  // 每次导航都从 store 读取最新的 token
  const token = store.getters.token
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
