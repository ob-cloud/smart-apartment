<template>
  <div class="device-flag">
    <a-popover trigger="hover" placement="top" v-if="record.doorLock&&record.doorLock.onlineStatus === 1">
      <template slot="content">
        {{ record.doorLock.power === 101 ? '电量： -': (20 > record.doorLock.power ? '电量低于20%' : '电量：' + record.doorLock.power +'%') }}
      </template>
      <span class="lock" :class="record.doorLock.power < 20 ? 'lockLowPower' : 'lockNormal'">
        <!-- <icon-font type="iconmensuo1" /></span> -->
        <a-icon type="tool" />
      </span>
    </a-popover>
    <a-popover trigger="hover" placement="top" v-if="record.doorLock && record.doorLock.onlineStatus === 2">
      <template slot="content">
        已离线
      </template>
      <span class="lockOffline">
        <!-- <icon-font type="iconmensuo1" /> -->
        <a-icon type="tool" />
      </span>
    </a-popover>
    <a-popover trigger="hover" placement="top" v-if="record.electricMeter && record.electricMeter.valveStatus === -1">
      <template slot="content">
        异常
      </template>
      <span class="lockOffline">
        <!-- <icon-font type="icondianbiao" /> -->
        <a-icon type="tool" />
      </span>
    </a-popover>
    <a-popover trigger="hover" placement="top" v-if="record.electricMeter && record.electricMeter.valveStatus === 2">
      <template slot="content">
        已断电
      </template>
      <span class="lockLowPower">
        <!-- <icon-font type="icondianbiao" /> -->
        <a-icon type="tool" />
      </span>
    </a-popover>
    <a-popover trigger="hover" placement="top" v-if="record.electricMeter && (record.electricMeter.valveStatus === 1 || record.electricMeter.valveStatus === 0)">
      <template slot="content">
        供电中
      </template>
      <span class="electricNormal">
        <!-- <icon-font type="icondianbiao" /> -->
        <a-icon type="tool" />
      </span>
    </a-popover>
    <a-popover trigger="hover" placement="top" v-if="record.waterMeter && record.waterMeter.valveStatus === -1">
      <template slot="content">
        未知
      </template>
      <span class="lockLowPower">
        <!-- <icon-font type="iconshuibiao" /> -->
        <a-icon type="tool" />
      </span>
    </a-popover>
    <a-popover trigger="hover" placement="top" v-if="record.waterMeter && (record.waterMeter.valveStatus === 1 || record.waterMeter.valveStatus === 0)">
      <template slot="content">
        供水中
      </template>
      <span class="waterNormal">
        <!-- <icon-font type="iconshuibiao" /> -->
        <a-icon type="tool" />
      </span>
    </a-popover>
    <a-popover trigger="hover" placement="top" v-if="record.waterMeter && record.waterMeter.valveStatus === 2">
      <template slot="content">
        已断水
      </template>
      <span class="lockLowPower">
        <!-- <icon-font type="iconshuibiao" /> -->
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
.device-flag {
  position: absolute;
  right: 10px;
  bottom: 7px;

  span {
    display: inline-block;
    height: 18px;
    line-height: 18px;
    border-radius: 2px;
    text-align: center;
    margin-left: 5px;
  }

  .lockOffline {
    color: #BBBBBB;
  }

  .lockNormal {
    color: #0A87F8;
  }

  .lockLowPower {
    color: #FB4246;
  }

  .electricNormal {
    color: #FFA036;
  }

  .waterNormal {
    color: #03C683;
  }

  /deep/ .ant-popover-inner-content {
    width: 96px;
    padding: 6px 0;
    text-align: center;
  }

  svg {
    width: 14px;
    height: 14px;
  }
}
</style>
