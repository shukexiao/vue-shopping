<template>
  <div>
    <!-- 二级路由出口：二级组件展示位置 -->
    <!-- 插槽 -->
    <router-view />
    <!-- 底部导航栏 -->
    <!-- active-color激发时的颜色 inactive-color未激发时的颜色 -->
    <!-- route属性：点击导航栏切换路由,属于vant组件库的属性 配合to使用 -->
    <van-tabbar route active-color="#ee0a24" inactive-color="#000">
      <van-tabbar-item icon="wap-home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/category">分类页</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o" to="/cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="contact-o" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style>

</style>
