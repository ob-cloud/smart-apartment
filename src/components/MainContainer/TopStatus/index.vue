<template>
  <div class="status">
    <p
      :class="{ active: currentActiveIndex === index ,specilLine: item.line,borderActive:currentActiveIndex === index&&showSpecilLine}"
      v-for="(item,index) in statusData"
      :key="index"
      @click="changeStatus(item,index)">
      <span :class="{leftLine: item.line}">{{ item.title }}</span>
      <span v-if="item.status || item.status === 0" :style="{ color: item.color }">({{ item.status }})</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'TopStatus',
  props: {
    statusData: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    },
    showSpecilLine: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentActiveIndex: 0
    }
  },
  created () {
    this.currentActiveIndex = this.activeIndex
  },
  methods: {
    changeCurrentActiveIndex (val) {
      this.currentActiveIndex = val
    },
    changeStatus (status, index) {
      this.$emit('changeStatus', status)
      this.currentActiveIndex = index
    }
  }
}
</script>

<style scoped lang="less">
.status {
  display: flex;

  .active {
    color: #0A87F8;
  }

  .borderActive {
    border-bottom: 2px solid #0A87F8;
  }

  &>p {
    box-sizing: border-box;
    margin-right: 20px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;

    .leftLine {
      position: relative;
    }

    .leftLine::before {
      content: "";
      position: absolute;
      top: 2px;
      left: -20px;
      height: 14px;
      width: 1px;
      border-left: 1px dashed #dddddd;
    }
  }

  .specilLine {
    margin-left: 20px;
  }

}
</style>
