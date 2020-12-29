<template>
  <div style="padding: 0 0px 20px 0px;" :style="source===3?'height: calc(100vh - 150px);':'height: calc(100vh - 150px);'" :class="stepsNum===3?'':'overFlowStyle'">
    <title-steps :steps="stepsNum" :buildingProjectId="buildingProjectId" @changeStepsNum="changeStepsNum"></title-steps>
    <content-step-one v-if="stepsNum === 1" ref="contentStepOne" :typeFlag="1" :buildingProjectId="buildingProjectId" @initBuildingProjectId="initBuildingProjectId" @refreshinfoFun="refreshinfoFun" @changeLoading="changeLoading"></content-step-one>
    <!-- <content-step-two v-else-if="stepsNum === 2" ref="contentStepTwo" :buildingProjectId="buildingProjectId" @refreshinfoFun="refreshinfoFun" @changeLoading="changeLoading"></content-step-two> -->
    <!-- <content-step-Three v-else-if="stepsNum === 3" ref="contentStepThree" :buildingProjectId="buildingProjectId" @refreshinfoFun="refreshinfoFun" @changeLoading="changeLoading"></content-step-Three> -->
  </div>
</template>
<script>
import TitleSteps from './TitleSteps'
import contentStepOne from './contentStepOne'
// import contentStepTwo from './contentStepTwo'
// import contentStepThree from './contentStepThree'
export default {
  name: 'AddCentralizedDialog',
  components: {
    TitleSteps,
    contentStepOne
    // contentStepTwo,
    // contentStepThree
  },
  props: {
    source: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      stepsNum: 1,
      loading: false,
      visible: true,
      buildingProjectId: ''
    }
  },
  mounted () {},
  created () {
    this.buildingProjectId = ''
  },
  methods: {
    changeLoading (val) {
      this.$emit('changeLoading', val)
    },
    refreshinfoFun () {
      this.$emit('refreshinfoFun', true)
    },
    onCancel () {
      this.$emit('cancel-dig')
    },
    initBuildingProjectId (value, fromPos) {
      this.buildingProjectId = value
      if (this.buildingProjectId && fromPos === 'config') {
        this.stepsNum++
        this.$emit('changeStepNum', this.stepsNum)
      }
    },
    handleOk () {
      let flag = true // 同意跳转
      if (this.stepsNum === 1) {
        if (this.buildingProjectId === '') {
          // 新增或者修改
          flag = this.$refs.contentStepOne.houseCentralizedAdd('ok')
        } else {
          flag = this.$refs.contentStepOne.houseCentralizedEdit()
        }
      } else if (this.stepsNum === 2) {
        flag = this.$refs.contentStepTwo.configRooms(true)
      } else if (this.stepsNum === 3) {
        flag = this.$refs.contentStepThree.projectExtendInfoAdd()
      }
      return flag
    },
    goConfig () {
      let flag = true // 同意跳转
      if (this.stepsNum === 1) {
        if (this.buildingProjectId === '') {
          // 新增或者修改
          flag = this.$refs.contentStepOne.houseCentralizedAdd('config')
        } else {
          flag = this.$refs.contentStepOne.houseCentralizedEdit()
          if (flag) {
            this.stepsNum++
            this.$emit('changeStepNum', this.stepsNum)
          }
        }
      } else if (this.stepsNum === 2) {
        flag = this.$refs.contentStepTwo.configRooms(false)
        if (flag) {
          this.stepsNum++
          this.$emit('changeStepNum', this.stepsNum)
        }
      }
      return flag
    },
    changeStepsNum (value) {
      this.stepsNum = value
      this.$emit('changeStepNum', this.stepsNum)
    }
  }
}
</script>

<style scoped lang="less">
.add_centralized_modal_css {
  /deep/ .ant-modal-body {
    overflow-x: hidden;
    overflow-y: auto;
    padding: 20px 0;
    height: calc(100vh - 150px);
  }
}

.overFlowStyle {
  overflow: auto;
}

.add_title_css {
  color: #0a87f8;
}

.config_lbl_css {
  margin-right: 10px;
  color: #0a87f8;
  font-size: 16px;
  cursor: pointer;
}

.save_btn_css {
  width: 120px;
  height: 40px;
  line-height: 40px;
}
</style>
