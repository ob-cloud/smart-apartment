<template>
  <ul class="house-list">
    <div v-show="!houseDiagram.list.length">
      <a-empty style="margin-top:100px;" />
      <div style="margin-top: 18px;">
        <div class="goAddStyle cursor">
          去添加<a-icon style="margin-left: 4px;" type="arrow-right"></a-icon>
        </div>
      </div>
    </div>

    <li v-for="(itemFirst,index) in houseDiagram.list" :key="index">
      <div class="list-top f-clearfix">
        <div class="f-fl f-clearfix house-info">
          <p class="f-fl">
            <a-icon type="location" class="position-icon"></a-icon>
            <span style="color: #111;font-size: 16px;">{{ itemFirst.communityName }}</span>
            <span style="color: #666666">
              （{{ itemFirst.cityName }}-{{ itemFirst.areaName }}{{ itemFirst.townName ? '-' + itemFirst.townName : '' }}）
            </span>
          </p>
        </div>
        <div class="f-fr">
          共 <span class="f-ftc-blue">{{ itemFirst.roomNum }}</span> 间，出租率：<span class="f-ftc-blue">{{ itemFirst.rentRate }}</span>
        </div>
      </div>

      <div v-for="(item, idx) in itemFirst.buildingUnitList" :key="idx">
        <div class="address">{{ item.buildingNo }} 栋 {{ item.unit ? item.unit + '单元' : '' }}</div>
        <ul class="house-child-list f-clearfix">
          <template v-for="(child, i) in item.houseRoomList">
            <li :style="borderLeftColor(child.status)" class="f-fl house-status" :key="i">
              <div class="house-info">
                <p class="overHidde">{{ child.fullRoomName }}</p>
                <p v-if="!child.renterContract.renterContractId">{{ child.orientationName }}-{{ child.houseArea }}㎡-￥{{ child.actualPrice/100 }}元/月</p>
                <p v-if="child.renterContract.renterContractId" style="max-width: 140px;" class="overHidde">￥{{ child.renterContract.renterContractPrice/100 }}元/月 ({{ child.renterContract.renterName }})</p>
                <p v-if="child.status === 1 || child.status === 2">
                  <!-- <icon-font v-if="child.vacantDays >= 30" class="house-status-icon" style="color: #FB4246" type="iconyumengtubiao_kongzhi" /> -->
                  空置
                  <span style="color: #FB4246">{{ child.vacantDays ? child.vacantDays+' 天':'' }}</span>
                </p>
                <p v-if="child.status === 3">
                  <!-- 已租 -->
                  <span style="color: #0A87F8" v-if="!child.renterContract.renterContractId">待录租客合同…</span>
                  <span v-if="child.renterContract.renterContractId && child.isContractBeSigned === 1 && child.renterContract.renterEndDate">
                    <!--租客待签字-->
                    <span style="color: #FB4246" v-if="child.renterContract.renterFewDaysLaterIn && child.renterContract.renterFewDaysLaterIn < 31">剩{{ child.renterContract.renterFewDaysLaterIn }}天搬入</span>
                    <span style="color: #FB4246" v-else-if="$moment(new Date().getTime()) < child.renterContract.renterEndDate && child.renterContract.renterRemainingDays && child.renterContract.renterRemainingDays <= child.renterContract.expectDay">剩{{ child.renterContract.renterRemainingDays }}天搬出</span>
                    <span style="color: #FB4246" v-else-if="$moment(new Date().getTime()) > child.renterContract.renterEndDate">已到期</span>
                    <span v-else>到期日：{{ $moment(child.renterContract.renterEndDate).format('YYYY.MM.DD') }}</span>
                  </span>
                  <span v-if="child.renterContract.renterContractId && child.isContractBeSigned === 0">
                    <span v-if="child.renterContract.renterContractId && child.renterContract.contractStatus === 2">到期日：{{ $moment(child.renterContract.renterEndDate).format('YYYY.MM.DD') }}</span>
                    <span style="color: #FB4246" v-if="child.renterContract.renterContractId && child.renterContract.contractStatus === 3 && child.renterContract.renterFewDaysLaterIn > 0">剩{{ child.renterContract.renterFewDaysLaterIn }}天搬入</span>
                    <span style="color: #FB4246" v-if="child.renterContract.renterContractId && child.renterContract.contractStatus === 4 && child.renterContract.renterRemainingDays > 0">剩{{ child.renterContract.renterRemainingDays }}天搬出</span>
                    <span style="color: #FB4246" v-if="child.renterContract.renterContractId && child.renterContract.contractStatus === 5">已到期</span>
                  </span>
                </p>
                <p v-if="child.status === 4">
                  配置中
                </p>
                <p v-if="child.status === 5 || child.status === 6">
                  已锁房
                </p>
                <p v-if="child.status === 8">
                  已关闭
                </p>
              </div>
              <!-- 工单标识 -->
              <workorder-flag :record="child"></workorder-flag>
              <!-- 房态标识 -->
              <house-flag :record="child"></house-flag>
              <!-- 设备标识 -->
              <device-flag :record="child"></device-flag>
            </li>
          </template>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import WorkorderFlag from './WorkorderFlag'
import HouseFlag from './HouseFlag'
import DeviceFlag from './DeviceFlag'

export default {
  components: { HouseFlag, DeviceFlag, WorkorderFlag },
  data () {
    return {
      houseDiagram: {
        list: [{
          communityName: '金逸小区', // 小区名称
          cityName: '广州',
          areaName: '黄埔',
          townName: '',
          roomNum: 200,
          rentRate: '20%',
          buildingUnitList: [{
            buildingNo: 1, // 楼栋
            unit: 2, // 单元
            vacantDays: 20, // 空闲时间
            houseRoomList: [{
              status: 1, // 房间状态
              fullRoomName: '1001', // 层 + 房号
              orientationName: '南', // 朝向
              houseArea: 86, // 面积
              actualPrice: 20000, // 实际价格
              vacantDays: 10, // 空闲时间

              // 租赁合同
              renterContractId: '',
              renterContract: { // 租赁合同
                renterContractPrice: 1300, // 租金
                renterEndDate: '', // 租期
                renterFewDaysLaterIn: 20, // 剩多少天搬入
                renterRemainingDays: 360, // 剩余时间
                contractStatus: 2, // 合同状态
                renterName: 'skz' // 租客
              },
              isContractBeSigned: 1, // 是否签约

              // 工作流
              isRepairUndone: 1, // 维修中
              isCleanUndone: 1, // 清洁中
              isDistributionUndone: 1, // 配货中

              // 房子标识
              bookInfo: { // 预订信息
                bookId: ''
              },
              isBillReceivable: 0, // 费用已收
              isBillOverdue: 0, // 欠费
              isBack: 0, // 退租
              isTurnRent: 0, // 转租

              doorLock: {
                onlineStatus: 1, // 在线状态
                power: 80 // 电量
              },
              electricMeter: {
                valveStatus: 1 // 电表状态
              },
              waterMeter: {
                valveStatus: 1 // 水表状态
              }
            }, {
              status: 3, // 房间状态
              fullRoomName: '2001', // 层 + 房号
              orientationName: '南', // 朝向
              houseArea: 86, // 面积
              actualPrice: 20000, // 实际价格
              vacantDays: 10, // 空闲时间

              // 租赁合同
              renterContractId: '',
              renterContract: { // 租赁合同
                renterContractPrice: 1300, // 租金
                renterEndDate: '', // 租期
                renterFewDaysLaterIn: 20, // 剩多少天搬入
                renterRemainingDays: 360, // 剩余时间
                contractStatus: 2, // 合同状态
                renterName: 'skz' // 租客
              },
              isContractBeSigned: 0, // 是否签约

              // 工作流
              isRepairUndone: 1, // 维修中
              isCleanUndone: 1, // 清洁中
              isDistributionUndone: 1, // 配货中

              // 房子标识
              bookInfo: { // 预订信息
                bookId: ''
              },
              isBillReceivable: 0, // 费用已收
              isBillOverdue: 0, // 欠费
              isBack: 0, // 退租
              isTurnRent: 0, // 转租

              doorLock: {
                onlineStatus: 1, // 在线状态
                power: 80 // 电量
              },
              electricMeter: {
                valveStatus: 1 // 电表状态
              },
              waterMeter: {
                valveStatus: 1 // 水表状态
              }
            }]
          }, {
            buildingNo: 1, // 楼栋
            unit: 3, // 单元
            vacantDays: 20, // 空闲时间
            houseRoomList: [{
              status: 2, // 房间状态
              fullRoomName: '2001', // 层 + 房号
              orientationName: '南', // 朝向
              houseArea: 86, // 面积
              actualPrice: 20000, // 实际价格
              vacantDays: 10, // 空闲时间

              // 租赁合同
              renterContractId: '',
              renterContract: { // 租赁合同
                renterContractPrice: 1300, // 租金
                renterEndDate: '', // 租期
                renterFewDaysLaterIn: 20, // 剩多少天搬入
                renterRemainingDays: 360, // 剩余时间
                contractStatus: 2, // 合同状态
                renterName: 'skz' // 租客
              },
              isContractBeSigned: 1, // 是否签约

              // 工作流
              isRepairUndone: 1, // 维修中
              isCleanUndone: 1, // 清洁中
              isDistributionUndone: 1, // 配货中

              // 房子标识
              bookInfo: { // 预订信息
                bookId: ''
              },
              isBillReceivable: 0, // 费用已收
              isBillOverdue: 0, // 欠费
              isBack: 0, // 退租
              isTurnRent: 0, // 转租

              doorLock: {
                onlineStatus: 1, // 在线状态
                power: 80 // 电量
              },
              electricMeter: {
                valveStatus: 1 // 电表状态
              },
              waterMeter: {
                valveStatus: 1 // 水表状态
              }
            }]
          }]
        }],
        total: 0
      }
    }
  },
  methods: {
    borderLeftColor (status) {
      const colorMap = { 1: '#FB4246', 2: '#FB4246', 3: '#03C683', 4: '#FFAF6D', 5: '#666666', 6: '#666666', 7: '#666666', 8: '#666666' }
      return { borderLeftColor: colorMap[status] || '#666666' }
    }
  }
}
</script>

<style lang="less" scoped>
.house-list {
  min-height: calc(100% - 24px);
  position: relative;

  /deep/ .ant-spin {
    position: absolute;
    top: 20px;
    left: calc(50%);
    z-index: 99;
  }

  .goAddStyle {
    margin: 0 auto;
    width: 230px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    border-radius: 4px;
    // border: 1px solid #0A87F8;
    color: #0A87F8;
  }

  li {
    margin-bottom: 20px;

    &:not(:last-child) {
      border-bottom: 1px solid #eeeeee;
    }
  }

  .list-top {
    .house-info {
      .position-icon {
        margin-right: 4px;
        /*vertical-align: middle;*/
        color: #111;
      }

      p {
        padding-right: 10px;
        margin-right: 10px;
        border-right: 1px dashed #DDDDDD;
      }

      p:last-child {
        border-right: none;
        cursor: pointer;
      }
    }

    .f-ftc-blue {
      height: 14px;
      line-height: 14px;
      cursor: pointer;

      .position-icon {
        margin-right: 4px;
        vertical-align: middle;
      }
    }

  }

  .address {
    margin: 10px 0;
    width: 100%;
    background-color: rgba(250, 251, 252, 1);
    border-radius: 4px;
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
  }

  .house-child-list {

    &>li {
      position: relative;
      margin-right: 10px;
      padding: 10px;
      width: 198px;
      height: 90px;
      font-size: 12px;
      color: #777;
      border: 1px solid #ddd;
      border-radius: 5px;
      cursor: pointer;

      &.house-status {
        border-left-width: 2px;

        .house-status-icon {
          margin-right: 4px;
          font-size: 14px;
        }
      }

      p {
        height: 24px;
        line-height: 24px;
      }

      p:first-child {
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>
