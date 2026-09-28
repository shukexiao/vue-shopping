import { Toast } from 'vant'
import { changeCount, delSelect, getCartList } from '@/api/cart'

export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    // 提供一个设置cartList的mutation
    setCartList (state, newList) {
      state.cartList = newList
    },
    // 修改选中状态
    toggleCheck (state, goodsId) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    toggleAllCheck (state, flag) {
      // 同步设置小选框状态
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    // 修改购物车商品数量
    changeCount (state, { goodsId, goodsNum }) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },
  actions: {
    async getCartAction (Context) {
      const { data } = await getCartList()
      // 后台返回的数据中，不包含复选框的状态，全部维护为选中
      data.list.forEach(item => {
        item.isChecked = true
      })
      Context.commit('setCartList', data.list)
    },
    // 修改数量：先修改本地，再同步后台
    async changeCountAction (context, obj) {
      const { goodsNum, goodsId, goodsSkuId } = obj
      context.commit('changeCount', { goodsId, goodsNum })
      await changeCount(goodsNum, goodsId, goodsSkuId)
    },
    // 删除购物车商品
    async delSelect (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      await delSelect(cartIds)
      Toast('删除成功')

      // 重新获取最新的购物车数据
      context.dispatch('getCartAction')
    }
  },
  getters: {
    // 所有商品累加总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的所有商品
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的所有商品总数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的总价
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num * item.goods.goods_price_min
      }, 0).toFixed(2)
    },
    // 是否全选
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
