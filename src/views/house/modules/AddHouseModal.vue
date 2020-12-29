<template>
  <a-modal
    centered
    destroyOnClose
    cancelText="取消"
    okText="保存并关闭"
    :maskClosable="false"
    width="1200px"
    :visible="visible"
    class="ownModalBorder slim"
    title="录入房源"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading">

    <add-house
      ref="addHouse"
      @changeLoading="changeLoading"
      :houseTypeIndex="houseTypeIndex"
      :source="source"
      :addressObj="addressObj"
      @changeHouseTypeIndex="changeHouseTypeIndex"
      @changeStepNum="changeStepNum"
      @refreshPage="refreshPage"></add-house>

    <template slot="footer" v-if="this.houseTypeIndex === 3">
      <label class="config_lbl_css" @click="goConfig" v-if="stepsNum === 2">
        保存并去完善推广信息
      </label>
      <a-button class="save_btn_css" key="submit" :loading="saveLoading_02" type="primary" @click="handleOk">
        保存{{ stepsNum === 1 ? '并去配置房间' : '' }}
      </a-button>
    </template>

    <template slot="footer" v-if="this.houseTypeIndex === 1 || this.houseTypeIndex === 2">
      <a-button class="cancelFont" @click="visible = false;">取消</a-button>
      <a-button class="saveFont" type="primary" key="submit" :loading="saveLoading_01" @click="saveHouse">保存并关闭
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import AddHouse from '../components/AddHouse'
export default {
  components: { AddHouse },
  data () {
    return {
      visible: false,
      houseTypeIndex: 3,
      stepsNum: 1,
      addressObj: {
        cityId: '',
        communityId: '',
        communityName: ''
      },
      source: 1,
      confirmLoading: false,
      saveLoading_01: false,
      saveLoading_02: false
    }
  },
  methods: {
    show (record) {
      this.visible = true
    },
    changeLoading (val) {
      if (this.houseTypeIndex === 3) {
        this.saveLoading_02 = val
      } else if (this.houseTypeIndex === 1 || this.houseTypeIndex === 2) {
        this.saveLoading_01 = val
      }
    },
    changeHouseTypeIndex (val) {
      this.houseTypeIndex = val
    },
    changeStepNum (val) {
      this.stepsNum = val
    },
    refreshPage () {
      this.visible = false
      // this.getStatusCount()
      // if (this.isListMode) {
      //   this.getHouseList()
      // } else {
      //   this.getHouseDiagram()
      // }
    },
    handleOk () {},
    handleCancel () {
      this.visible = false
    },
    saveHouse () {}
  }
}
</script>

<style lang="less" scoped>
.slim /deep/ .ant-modal-body {
  padding: 0;
}

.config_lbl_css {
  margin-right: 10px;
  color: #0a87f8;
  font-size: 16px;
  cursor: pointer;
}

.save_btn_css {
  width: 160px;
  height: 40px;
  line-height: 40px;
}

.cancelFont {
  color: #666666;
  width: 120px;
  height: 40px;
}

.saveFont {
  width: 120px;
  height: 40px;
  color: #FFFFFF;
  background-color: #0A87F8;
}
</style>
