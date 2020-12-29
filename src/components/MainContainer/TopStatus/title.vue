<template>
  <div v-if="needMarkFlag" class="status">
    <p :class="{ active: currentActiveIndex === index }" v-for="(item,index) in statusData" :key="index" @click="changeStatus(item,index)">
      <span :class="{leftLine: item.line}">{{ item.title }}</span>
    </p>
  </div>
  <div v-else class="status">
    <p :class="{ active: currentActiveIndex === index }" v-for="(item,index) in statusData" :key="index" @click="changeStatus(item,index)">
      <span :class="{leftLine: item.line}">{{ item.title }}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    statusData: {
      type: Array
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
    needMarkFlag: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      currentActiveIndex: 0,
    }
  },
  created () {
    this.currentActiveIndex = this.activeIndex
  },
  methods: {
    changeStatus(status, index) {
      this.$emit('changeStatus', status);
      this.currentActiveIndex = index;
    },
  },
  watch: {
    activeIndex () {
      this.currentActiveIndex = this.activeIndex;
    },
  },
}
</script>

<style scoped lang="less">
.status {
  display: flex;

  .active {
    color: #0A87F8;
    border-bottom: 2px solid #0A87F8;
  }

  &>p {
    box-sizing: border-box;
    margin-right: 20px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;

    .leftLine {
      border-left: 1px dashed #dddddd;
      padding-left: 20px;
    }
  }
}
</style>
