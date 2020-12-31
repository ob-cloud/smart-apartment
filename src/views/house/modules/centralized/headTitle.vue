<template>
  <div class="head_title_css">
    <span class="title_info">{{ title }}</span>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'HeadTitle',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {}
}
</script>
<style lang='less' scoped>
.head_title_css {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 0 0 15px;

  &>.title_info {
    font-size: 16px;
    color:#ddd;
    font-weight: 500;
  }
}
</style>
