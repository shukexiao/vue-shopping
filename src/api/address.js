import request from '@/utils/request'

// 获取地址列表
export const getAddressList = () => {
  return request.get('/address/list')
}

// 获取地址详情
export const getAddressDetail = (addressId) => {
  return request.get('/address/detail', {
    params: {
      addressId
    }
  })
}

// 新增地址 form: { name, phone, region: [{ value, label }], detail }
export const addAddress = (form) => {
  return request.post('/address/add', { form })
}

// 编辑地址
export const editAddress = (addressId, form) => {
  return request.post('/address/edit', { addressId, form })
}

// 删除地址
export const delAddress = (addressId) => {
  return request.post('/address/remove', { addressId })
}

// 设置默认地址
export const setDefaultAddress = (addressId) => {
  return request.post('/address/setDefault', { addressId })
}

// 获取默认地址id
export const getDefaultAddressId = () => {
  return request.get('/address/defaultId')
}

// 获取省市区数据
export const getRegionTree = () => {
  return request.get('/region/tree')
}
