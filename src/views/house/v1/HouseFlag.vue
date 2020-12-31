<template>
  <div class="house-flag">
    <span style="color: #0A87F8; border-color: #0A87F8;" v-if="record.bookInfo && record.bookInfo.bookId">定</span>
    <span style="color: #03C683; border-color: #03C683;" v-if="record.isContractBeSigned">签</span>
    <span style="color: #0A87F8; border-color: #0A87F8;" v-if="record.isSyncTenant">确</span>
    <span style="color: #FFA036; border-color: #FFA036;" v-if="record.isBillReceivable">收</span>
    <span style="color: #FB4246; border-color: #FB4246;" v-if="record.isBillOverdue">欠</span>
    <span style="color: #FB4246; border-color: #FB4246;" v-if="record.isTurnRent">转</span>
    <span style="color: #FB4246; border-color: #FB4246;" v-if="record.isBack">退</span>
  </div>
</template>

<script>
export default {
  props: {
    record: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="less" scoped>
.house-flag {
  position: absolute;
  right: 10px;
  bottom: 32px;

  span {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border: 1px solid red;
    border-radius: 50%;
    text-align: center;
    color: red;
    margin-left: -4px;
    background: #ffffff;
  }
}
</style>
