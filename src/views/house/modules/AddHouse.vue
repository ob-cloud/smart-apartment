<template>
  <div id="addHouse" class="add-house">
    <add-whole-house ref="addWholeHouse" @changeLoading="changeLoading" v-if="activeIndex === 1" :addressObj="addressObj"></add-whole-house>
    <!-- <add-share-house ref="addShareHouse" @changeLoading="changeLoading" v-if="activeIndex==2"></add-share-house> -->
    <!-- <add-centralized-house ref="addCentralizedHouse" @changeLoading="changeLoading" :source="source" v-if="activeIndex === 3" @changeStepNum="changeStepNum" @refreshinfoFun="refreshinfoFun"></add-centralized-house> -->
    <div class="activeIndex clearfix">
      <!-- <div class="f-fl normal cursor" :class="activeIndex === 2 ? 'click' : ''" @click="changeActiveIndex(2)">合租</div> -->
      <div class="f-fl normal cursor" :class="activeIndex === 1 ? 'click' : ''" @click="changeActiveIndex(1)">整租</div>
      <!-- <div class="f-fl normal cursor" :class="activeIndex === 3 ? 'click' : ''" @click="changeActiveIndex(3)">独栋</div> -->
    </div>
  </div>
</template>

<script>
import AddWholeHouse from './whole/AddWholeHouse'
// import AddShareHouse from '../share/AddShareHouse'
import AddCentralizedHouse from './centralized/AddCentralizedHouse'

export default {
  name: 'AddHouse',
  components: {
    AddWholeHouse,
    // AddShareHouse,
    AddCentralizedHouse
  },
  props: {
    houseTypeIndex: {
      type: Number,
      default: 0
    },
    source: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      activeIndex: 1,
      buildingProjectId: '',
      addressObj: {
        cityId: '',
        communityId: '',
        communityName: ''
      },
      confirmLoading: false
    }
  },
  created() {
    this.activeIndex = this.houseTypeIndex
  },
  methods: {
    changeLoading (val) {
      this.$emit('changeLoading', val)
    },
    refreshinfoFun () {
      this.$emit('refreshinfoFun', true)
    },
    changeActiveIndex (val) {
      this.activeIndex = val
      this.$emit('changeHouseTypeIndex', val)
    },
    saveWholeHouse () {
      this.$refs.addWholeHouse.saveWholeHouse().then(res => {
        this.confirmLoading = false
        setTimeout(() => {
          this.$emit('refreshPage')
        }, 500)
      }, () => {
        this.confirmLoading = false
      })
    },
    saveShareHouse () {
      this.confirmLoading = true
      this.$refs.addShareHouse.saveShareHouse().then(res => {
        // console.log(res)
        this.confirmLoading = false
        setTimeout(() => {
          this.$emit('refreshPage')
        }, 500)
      }, () => {
        this.confirmLoading = false
      })
    },
    saveCentralizedHouse () {
      this.$refs.addCentralizedHouse.goConfig()
      this.$emit('refreshPage')
    },
    handleOk () {
      this.$refs.addCentralizedHouse.handleOk()
    },
    goConfig (val) {
      const flag = this.$refs.addCentralizedHouse.goConfig()
      if (flag && val === 3) {
        this.$emit('refreshPage')
      }
    },
    changeStepNum (val) {
      this.$emit('changeStepNum', val)
    }
  }
}
</script>

<style scoped lang="less">
.add-house {
  position: relative;

  .activeIndex {
    position: absolute;
    left: 490px;
    top: -40px;

    .normal {
      width: 70px;
      height: 40px;
      color: #777777;
      font-size: 16px;
      text-align: center;
    }

    .click {
      color: #0A87F8;
      border-bottom: 1px solid #0A87F8;
    }
  }
}
</style>
