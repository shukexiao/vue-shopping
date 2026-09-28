<template>
  <div class="address-page">
    <van-nav-bar
      :title="isSelectMode ? '选择收货地址' : '收货地址'"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />

    <div class="address-list" v-if="addressList.length">
      <div
        class="address-item"
        v-for="item in addressList"
        :key="item.address_id"
        @click="handleSelect(item)"
      >
        <div class="info-top">
          <span class="name">{{ item.name }}</span>
          <span class="phone">{{ item.phone }}</span>
          <span class="default-tag" v-if="item.address_id === defaultId">默认</span>
        </div>
        <div class="info-address">{{ formatAddress(item) }}</div>

        <div class="info-op" v-if="!isSelectMode">
          <van-checkbox
            :value="item.address_id === defaultId"
            @click.native.stop="setDefault(item)"
          >
            设为默认
          </van-checkbox>
          <div class="op-btn-box">
            <span class="op-btn" @click.stop="goEdit(item)">编辑</span>
            <span class="op-btn" @click.stop="handleDelete(item)">删除</span>
          </div>
        </div>
      </div>
    </div>

    <van-empty v-else description="还没有收货地址" />

    <div class="footer">
      <van-button type="danger" block round @click="goAdd">新增收货地址</van-button>
    </div>
  </div>
</template>

<script>
import { getAddressList, getDefaultAddressId, delAddress, setDefaultAddress } from '@/api/address'
import { setSelectedAddressId } from '@/utils/storage'

export default {
  name: 'AddressIndex',
  data () {
    return {
      addressList: [], // 地址列表
      defaultId: 0 // 默认地址id
    }
  },
  computed: {
    // 从结算页跳过来时是选择地址模式（/address?select=1）
    isSelectMode () {
      return this.$route.query.select === '1'
    }
  },
  created () {
    this.getAddressList()
  },
  methods: {
    async getAddressList () {
      const { data: { list } } = await getAddressList()
      this.addressList = list
      const { data } = await getDefaultAddressId()
      this.defaultId = data.defaultId
    },
    // 拼接完整地址
    formatAddress (item) {
      const { province, city, region } = item.region
      return province + city + region + item.detail
    },
    // 选择模式：记录选中的地址并返回结算页
    handleSelect (item) {
      if (!this.isSelectMode) {
        return
      }
      setSelectedAddressId(item.address_id)
      this.$router.go(-1)
    },
    goAdd () {
      this.$router.push('/address/edit')
    },
    goEdit (item) {
      this.$router.push({
        path: '/address/edit',
        query: { addressId: item.address_id }
      })
    },
    async setDefault (item) {
      if (item.address_id === this.defaultId) {
        return
      }
      await setDefaultAddress(item.address_id)
      this.defaultId = item.address_id
      this.$toast('设置成功')
    },
    handleDelete (item) {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确定要删除该收货地址吗？'
      }).then(async () => {
        await delAddress(item.address_id)
        this.$toast('删除成功')
        this.getAddressList()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.address-page {
  min-height: 100vh;
  padding-top: 46px;
  padding-bottom: 80px;
  background-color: #f7f7f7;
}

.address-list {
  padding: 10px;
}

.address-item {
  padding: 12px;
  margin-bottom: 10px;
  font-size: 14px;
  background-color: #fff;
  border-radius: 8px;
  .info-top {
    display: flex;
    align-items: center;
    .name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }
    .phone {
      margin-left: 10px;
      color: #666;
    }
    .default-tag {
      margin-left: 10px;
      padding: 0 5px;
      font-size: 12px;
      line-height: 18px;
      color: #fa2209;
      border: 1px solid #fa2209;
      border-radius: 3px;
    }
  }
  .info-address {
    margin: 8px 0;
    line-height: 1.4;
    color: #666;
  }
  .info-op {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid #efefef;
    .op-btn-box {
      display: flex;
      .op-btn {
        margin-left: 20px;
        color: #666;
      }
    }
  }
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 10px 16px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>
