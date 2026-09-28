// 约定一个通用的键名
const INFO_KEY = 'hm_shopping_info'
const HISTORY_KEY = 'hm_history_key'

// 获取用户信息
export const getInfo = () => {
  const info = localStorage.getItem(INFO_KEY)
  return info ? JSON.parse(info) : { token: '', userId: '' }
}
// 设置用户信息
export const setInfo = (info) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(info))
}
// 删除用户信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 获取搜索历史
export const getHistoryList = () => {
  const result = localStorage.getItem(HISTORY_KEY)
  return result ? JSON.parse(result) : []
}
// 设置搜索历史
export const setHistoryList = (arr) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}

// 结算页选中的收货地址id
const ADDRESS_KEY = 'hm_selected_address'
export const getSelectedAddressId = () => {
  const id = localStorage.getItem(ADDRESS_KEY)
  return id ? Number(id) : 0
}
export const setSelectedAddressId = (id) => {
  localStorage.setItem(ADDRESS_KEY, id)
}
