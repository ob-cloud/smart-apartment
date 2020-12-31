<template>
  <div class="steps_title_css">
    <div class="title_row">
      <div class="cursor" @click="goStep(1)">
        <span class="stepIcon cursor" :class="{ stepsNum: steps >= 1 }">
          <label>1</label>
        </span>
      </div>
      <div class="cursor" @click="goStep(2)">
        <span class="stepIcon cursor" :class="{ stepsNum: steps >= 2 }">
          <label>2</label>
        </span>
      </div>
      <div class="cursor" @click="goStep(3)">
        <span class="stepIcon cursor" :class="{ stepsNum: steps >= 3 }">
          <label>3</label>
        </span>
      </div>
    </div>
    <div class="step_mian_css">
      <div class="step_item_1 cursor" :class="{ stepsNum: steps >= 1 }" @click="goStep(1)">
        基本信息
      </div>
      <div class="step_item_2 cursor" :class="{ stepsNum: steps >= 2 }" @click="goStep(2)">
        配置房间
      </div>
      <div class="step_item_3 cursor" :class="{ stepsNum: steps >= 3 }" @click="goStep(3)">
        推广描述
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddCentralizedTitle',
  props: {
    steps: {
      type: Number,
      default: 1
    },
    buildingProjectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    goStep(value) {
      if (value === 2 || value === 3) {
        if (this.buildingProjectId === '') {
          this.$message.error('请先保存基本信息')
          return
        }
      }
      this.$emit('changeStepsNum', value)
    }
  }
}
</script>
<style lang='less' scoped>
.steps_title_css {
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  width: 70%;
  padding: 15px 0 15px;
  height: 86px;

  .title_row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 0 8px;

    &>div {
      width: calc(50% - 3em);
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .stepIcon {
      border: 1px solid #bbb;
      border-radius: 100%;
      width: 24px;
      height: 24px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;

      &>label {
        background: #bbb;
        width: 20px;
        height: 20px;
        border-radius: 100%;
        color: #fff;
        text-align: center;
        line-height: 19px;
        font-size: 14px;
      }
    }

    .stepsNum {
      color: #0a87f8 !important;
      border: 1px solid #0a87f8  !important;

      &>label {
        background: #0a87f8 !important;
      }
    }
  }

  .step_mian_css {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    overflow: hidden;

    &>div {
      position: relative;
      overflow: hidden;
      flex-grow: 1;
      text-align: center;
      font-size: 14px;
      color: #bbb;
    }

    .step_item_1 {
      &::after {
        width: calc(50% - 3em);
        right: 0;
        height: 0;
        position: absolute;
        top: 50%;
        border-top: 1px solid #bbb;
        content: "";
      }
    }

    .step_item_2 {
      &::before {
        width: calc(50% - 3em);
        left: 0;
        height: 0;
        position: absolute;
        top: 50%;
        border-top: 1px solid #bbb;
        content: "";
      }

      &::after {
        width: calc(50% - 3em);
        right: 0;
        height: 0;
        position: absolute;
        top: 50%;
        border-top: 1px solid #bbb;
        content: "";
      }
    }

    .step_item_3 {
      &::before {
        width: calc(50% - 3em);
        left: 0;
        height: 0;
        position: absolute;
        top: 50%;
        border-top: 1px solid #bbb;
        content: "";
      }
    }

    .stepsNum {
      color: #0a87f8 !important;

      &::before,
      &::after {
        border-top: 1px solid #0a87f8  !important;
      }
    }
  }
}
</style>
