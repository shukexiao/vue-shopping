import { getInfo, setInfo } from '@/utils/storage'

// 用户模块
export default {
  namespaced: true,
  state () {
    return {
      userInfo: getInfo()
    }
  },
  mutations: {
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    setUserInfo ({ commit }, obj) {
      commit('setUserInfo', obj)
    },
    logout (context) {
      // 个人信息充值
      context.commit('setUserInfo', {})

      // 购物车信息充值，（跨模块调用mutation），cart/setCartList
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {
    getUserInfo (state) {
      return state.userInfo
    }
  }
}
