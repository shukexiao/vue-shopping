import request from '@/utils/request'

export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId, // 商品id
    goodsNum, // 商品数量
    goodsSkuId // 商品规格id
  })
}

// 获取购物车列表
export const getCartList = () => {
  return request.get('/cart/list')
}

// 更新购物车商品数量
export const changeCount = (goodsNum, goodsId, goodsSkuId) => {
  return request.post('/cart/update', {
    goodsNum,
    goodsId,
    goodsSkuId
  })
}

// 删除购物车商品
export const delSelect = (cartIds) => {
  return request.post('/cart/clear', {
    cartIds
  })
}
