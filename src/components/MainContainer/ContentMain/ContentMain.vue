<template>
  <div class="content-main">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentMain'
}
</script>

<style scoped lang="less">
.content-main {
  padding: 20px;
  // height: calc(100vh - 100px);
  // overflow: auto;

  .content {
    // min-height: calc(100vh - 220px);
    overflow: auto;
    padding: 20px;
    background-color: #ffffff;
  }

}
</style>
