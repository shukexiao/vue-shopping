<template>
  <!-- 商品数量加减按钮组件 -->
<div class="count-box">
  <button @click="handleSub" class="minus">-</button>
  <input :value="value" @change="handleChange" class="inp" type="text" name="" id="">
  <button @click="handleAdd" class="add">+</button>
</div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handleSub () {
      if (this.value <= 1) return
      this.$emit('input', this.value - 1)
    },
    handleAdd () {
      this.$emit('input', this.value + 1)
    },
    handleChange (e) {
      const num = +e.target.value // 转数字处理，如果输入的不是数字num会显示NaN
      if (isNaN(num) || num < 1) {
        e.target.value = this.value
        return
      }
      this.$emit('input', num)
    }
  }
}
</script>

<style lang="less" scoped>
.count-box{
  width: 110px;
  display: flex;
  .add,.minus{
    width: 30px;
    height: 30px;
    background-color: #efefef;
    outline: none;
    border: none;
  }
  .inp{
    width: 40px;
    height: 30px;
    background-color: #efefef;
    outline: none;
    border: none;
    margin: 0 5px;
    text-align: center;
  }
}
</style>
