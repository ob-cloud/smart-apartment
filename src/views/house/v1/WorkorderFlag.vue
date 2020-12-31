<template>
  <div class="workorder-flag">
    <a-popover trigger="hover" placement="top" v-if="record.isRepairUndone === 1">
      <template slot="content">维修中</template>
      <span class="repair">
        <!-- <icon-font type="icon-yumengtubiao_weixiu" /> -->
        <a-icon type="tool" />
      </span>
    </a-popover>
    <a-popover trigger="hover" placement="top" v-if="record.isCleanUndone === 1">
      <template slot="content">保洁中</template>
      <span class="clean">
        <!-- <icon-font type="icon-yumengtubiao_baojie" /> -->
        <a-icon type="tool" />
      </span>
    </a-popover>
    <a-popover trigger="hover" placement="top" v-if="record.isDistributionUndone === 1">
      <template slot="content">
        配货中
      </template>
      <span class="distribution">
        <!-- <icon-font type="iconpeihuo-mianxing" /> -->
        <a-icon type="tool" />
      </span>
    </a-popover>
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
.workorder-flag {
  position: absolute;
  right: 10px;
  top: 11px;

  /deep/ .ant-popover-inner-content {
    width: 60px;
    padding: 6px 8px;
  }

  span {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    border-radius: 2px;
    text-align: center;
    margin-left: 5px;
  }

  .repair {
    background: rgba(10, 135, 248, 0.1);
    color: #0A87F8;
  }

  .clean {
    background: rgba(3, 198, 131, 0.1);
    color: #03C683;
  }

  .distribution {
    background: rgba(255, 160, 54, 0.1);
    color: #FFA036;
  }
}
</style>
