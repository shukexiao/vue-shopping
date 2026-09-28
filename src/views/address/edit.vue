<template>
  <div class="address-edit">
    <van-nav-bar
      :title="isEdit ? '编辑收货地址' : '新增收货地址'"
      left-arrow
      fixed
      @click-left="$router.go(-1)"
    />

    <van-cell-group>
      <van-field
        v-model="form.name"
        label="收货人"
        placeholder="请输入收货人姓名"
        maxlength="20"
      />
      <van-field
        v-model="form.phone"
        type="tel"
        label="手机号"
        placeholder="请输入手机号"
        maxlength="11"
      />
      <van-field
        readonly
        clickable
        label="所在地区"
        :value="regionText"
        placeholder="请选择省市区"
        @click="openPicker"
      />
      <van-field
        v-model="form.detail"
        label="详细地址"
        type="textarea"
        rows="2"
        autosize
        placeholder="街道、楼牌号等"
      />
    </van-cell-group>

    <div class="btn-box">
      <van-button
        type="danger"
        block
        round
        :loading="submitting"
        @click="save"
      >
        保存
      </van-button>
    </div>

    <van-popup v-model="showPicker" position="bottom" round>
      <van-picker
        v-if="showPicker"
        ref="picker"
        show-toolbar
        title="选择省市区"
        :columns="columns"
        @change="onPickerChange"
        @confirm="onPickerConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getAddressDetail, addAddress, editAddress, getRegionTree } from '@/api/address'

export default {
  name: 'AddressEdit',
  data () {
    return {
      form: {
        name: '',
        phone: '',
        detail: ''
      },
      regionValue: [], // 已选中的省市区 [{ value, label }]
      regionTree: {}, // 接口返回的省市区树
      showPicker: false,
      submitting: false
    }
  },
  computed: {
    isEdit () {
      return !!this.$route.query.addressId
    },
    // 展示用的省市区文本
    regionText () {
      return this.regionValue.map(item => item.label).join(' / ')
    },
    // picker 的三列数据，每列都带上默认选中项，编辑时打开就是原来的省市区
    columns () {
      const provinceList = this.getProvinceList()
      if (!provinceList.length) {
        return []
      }
      const province = this.getSelected(provinceList, 0) || provinceList[0]
      const cityList = this.getCityList(province.id)
      const city = this.getSelected(cityList, 1) || cityList[0]
      const regionList = city ? this.getRegionList(province.id, city.id) : []
      const region = this.getSelected(regionList, 2) || regionList[0]

      return [
        { values: this.toOptions(provinceList), defaultIndex: provinceList.indexOf(province) },
        { values: this.toOptions(cityList), defaultIndex: cityList.indexOf(city) },
        { values: this.toOptions(regionList), defaultIndex: regionList.indexOf(region) }
      ]
    }
  },
  async created () {
    if (this.isEdit) {
      await this.getDetail()
    }
    await this.getRegionTree()
  },
  methods: {
    // 编辑模式：回显地址详情
    async getDetail () {
      const { data: { detail } } = await getAddressDetail(this.$route.query.addressId)
      this.form.name = detail.name
      this.form.phone = detail.phone
      this.form.detail = detail.detail
      this.regionValue = [
        { value: detail.province_id, label: detail.region.province },
        { value: detail.city_id, label: detail.region.city },
        { value: detail.region_id, label: detail.region.region }
      ]
    },
    async getRegionTree () {
      const { data: { list } } = await getRegionTree()
      this.regionTree = list
    },
    getProvinceList () {
      return Object.values(this.regionTree)
    },
    getCityList (provinceId) {
      const province = this.getProvinceList().find(item => item.id === provinceId)
      return province ? Object.values(province.city || {}) : []
    },
    getRegionList (provinceId, cityId) {
      const city = this.getCityList(provinceId).find(item => item.id === cityId)
      return city ? Object.values(city.region || {}) : []
    },
    // 已选中项（回显用）
    getSelected (list, level) {
      const value = (this.regionValue[level] || {}).value
      return list.find(item => item.id === value)
    },
    toOptions (list) {
      return list.map(item => ({ text: item.name, value: item.id }))
    },
    // 打开选择器前保证省市区数据已就绪
    async openPicker () {
      if (!this.getProvinceList().length) {
        await this.getRegionTree()
      }
      this.showPicker = true
    },
    // 滚动某一列时，联动刷新它后面的列
    onPickerChange (picker, values, columnIndex) {
      const provinceId = values[0].value
      if (columnIndex === 0) {
        // 换了省份，市和区都要重置
        const cityList = this.toOptions(this.getCityList(provinceId))
        picker.setColumnValues(1, cityList)
        if (cityList[0]) {
          picker.setColumnValue(1, cityList[0].text)
        }
        this.setRegionColumn(picker, provinceId, cityList[0])
      } else if (columnIndex === 1) {
        this.setRegionColumn(picker, provinceId, values[1])
      }
    },
    setRegionColumn (picker, provinceId, city) {
      const regionList = city ? this.toOptions(this.getRegionList(provinceId, city.value)) : []
      picker.setColumnValues(2, regionList)
      if (regionList[0]) {
        picker.setColumnValue(2, regionList[0].text)
      }
    },
    onPickerConfirm (values) {
      this.regionValue = values.map(item => ({
        value: item.value,
        label: item.text
      }))
      this.showPicker = false
    },
    async save () {
      if (!this.form.name.trim()) {
        this.$toast('请输入收货人姓名')
        return
      }
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        this.$toast('请输入正确的手机号')
        return
      }
      if (this.regionValue.length !== 3) {
        this.$toast('请选择所在地区')
        return
      }
      if (!this.form.detail.trim()) {
        this.$toast('请输入详细地址')
        return
      }

      const form = {
        name: this.form.name,
        phone: this.form.phone,
        region: this.regionValue,
        detail: this.form.detail
      }
      this.submitting = true
      if (this.isEdit) {
        await editAddress(this.$route.query.addressId, form)
      } else {
        await addAddress(form)
      }
      this.submitting = false
      this.$toast('保存成功')
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.address-edit {
  min-height: 100vh;
  padding-top: 46px;
  background-color: #f7f7f7;
}

.btn-box {
  padding: 20px 16px;
}
</style>
