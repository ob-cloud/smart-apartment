<template>
  <a-table :customRow="openDetail" :loading="tableLoading" size="middle" rowKey="houseId" :columns="columns" :dataSource="tableData.list" :pagination="ipagination" bordered>
    <div slot="status" slot-scope="status">
      <div style="display: flex; align-items: center">
        <p :style="backgroundColor(status)" style="width: 6px;height: 6px; border-radius: 50%; margin-right: 6px"></p>
        <p v-if="status === 1 || status === 2">空置</p>
        <p v-if="status === 3">已租</p>
        <p v-if="status === 4">配置中</p>
        <p v-if="status === 5 || status === 6">已锁房</p>
        <p v-if="status === 8">关闭</p>
      </div>
    </div>

    <div slot="houseAddress" slot-scope="text,record">
      <div class="clearfix">
        <a-popover>
          <template slot="content">
            <p style="padding: 8px 18px;">
              <span class="houseAlias" v-if="record.houseAlias">{{ record.houseAlias }}</span>{{ record.fullAddress }}
            </p>
          </template>
          <p class="overHidde f-fl" style="max-width: 270px" type="primary">
            <span class="houseAlias" v-if="record.houseAlias">{{ record.houseAlias }}</span>{{ record.fullAddress }}
          </p>
        </a-popover>
        <div class="house-table-list f-fr">
          <workorder-flag :record="record"></workorder-flag>
          <device-flag :record="record"></device-flag>
        </div>

        <!-- 预订信息 -->
        <div slot="bookInfo" slot-scope="text,record">
          <div class="f-clearfix" style="padding: 0 9px">
            <div v-if="record.status === 1 || record.status === 2 || record.status === 4 || record.status === 5 || record.status === 6">
              <div class="f-fl house-flag" style="margin-right: 5px" v-if="record.bookInfo && record.bookInfo.bookId">
                <span style="color: #0A87F8;border-color: #0A87F8">定</span>
              </div>
              <div class="f-fl" style="margin-right: 5px" v-if="record.bookInfo && record.bookInfo.bookId">
                <span style="color: #000000">{{ record.bookInfo.bookName }}</span>
                <span style="color: #777777;font-size: 12px">
                  (定金:<span style="color: #000;">{{ Math.round(record.bookInfo.bookPrice / 100).toFixed(2) }}</span>元)
                </span>
              </div>
              <span v-else>-</span>
            </div>
            <div class="f-fl house-flag" style="margin-right: 5px" v-if="record.status === 3">
              <house-flag :record="record"></house-flag>
            </div>
            <div class="f-fl">
              <span style="color: #0A87F8" v-if="record.status === 3 && !record.renterContract.renterContractId && !record.bookInfo.bookId">待录租客合同…</span>
            </div>
            <div class="f-fl">
              <span style="color: #000000" v-if="record.renterContract.renterContractId">{{ record.renterContract.renterName }}</span>
              <span style="color: #777777;font-size: 12px" v-if="record.renterContract.renterContractId">
                (承租价:<span style="color: #000;">{{ record.actualPrice/100 }}</span>元/月)</span>
            </div>
            <div class="f-fr">
              <span style="color: #777777;font-size: 12px" v-if="record.renterContract.renterContractId && (record.renterContract.contractStatus === 1 || record.renterContract.contractStatus === 2) && record.renterContract.renterEndDate">
                到期日:<span style="color: #000;">{{ $moment(record.renterContract.renterEndDate).format('YYYY.MM.DD') }}</span>
              </span>
              <span style="color: #FB4246;font-size: 12px" v-if="record.renterContract.renterContractId && record.renterContract.contractStatus === 3 && record.renterContract.renterFewDaysLaterIn > 0">
                剩{{ record.renterContract.renterFewDaysLaterIn }}天搬入
              </span>
              <span style="color: #FB4246;font-size: 12px" v-if="record.renterContract.renterContractId && record.renterContract.contractStatus === 4 && record.renterContract.renterRemainingDays > 0">
                剩{{ record.renterContract.renterRemainingDays }}天搬出
              </span>
              <span style="color: #FB4246;font-size: 12px" v-if="record.renterContract.renterContractId && record.renterContract.contractStatus === 5">已到期</span>
            </div>
            <span v-if="record.status === 8">-</span>
          </div>
        </div>

        <!-- 出租价格 -->
        <div slot="actualPrice" slot-scope="text,record">
          <span v-if="!record.renterContract.renterContractId">{{ record.actualPrice/100 }}</span>
          <span v-if="record.renterContract.renterContractId">{{ record.renterContract.renterContractPrice/100 }}</span>
        </div>

        <!-- 户型 -->
        <div slot="houseType" slot-scope="text,record">
          <span>{{ record.room }}室{{ record.livingRoom }}厅{{ record.kitchen }}厨{{ record.toilet }}卫</span>
        </div>
        <!-- 面积 -->
        <div slot="houseArea" slot-scope="text,record">
          <span>{{ record.houseArea }}㎡</span>
        </div>
        <!-- 朝向 -->
        <div slot="orientationName" slot-scope="text,record">
          <span>{{ record.orientationName }}</span>
        </div>
        <!-- 楼层 -->
        <div slot="houseFloor" slot-scope="text, record">
          <span>{{ record.currentFloor }}-{{ record.totalFloor }}</span>
        </div>
        <!-- 负责人 -->
        <div slot="maintainer" slot-scope="text, record">
          <span>{{ record.maintainerName }}-{{ record.maintainerPhone }}</span>
        </div>
      </div>
    </div>
  </a-table>
</template>

<script>
import WorkorderFlag from './WorkorderFlag'
import HouseFlag from './HouseFlag'
import DeviceFlag from './DeviceFlag'

import { ProListMixin } from '@/utils/mixins/ProListMixin'
export default {
  mixins: [ ProListMixin ],
  components: { HouseFlag, DeviceFlag, WorkorderFlag },
  data () {
    return {
      tableLoading: false,
      tableData: {
        list: [],
        total: 0
      },
      columns: [{
          title: '序号',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: '50px',
          customCell: () => {
            return {
              on: {
                click: () => {
                  event.stopPropagation()
                }
              }
            }
          }
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: {
            customRender: 'status'
          },
          width: '5%'
        },
        {
          title: '房源信息',
          dataIndex: 'houseAddress',
          key: 'houseAddress',
          scopedSlots: {
            customRender: 'houseAddress'
          },
          width: '28.8%'
        },
        {
          title: '承租/预定信息',
          dataIndex: 'bookInfo',
          key: 'bookInfo',
          scopedSlots: {
            customRender: 'bookInfo'
          },
          width: '26%'
        },
        {
          title: '出租价格(元/月)',
          dataIndex: 'actualPrice',
          key: 'actualPrice',
          scopedSlots: {
            customRender: 'actualPrice'
          },
          width: '9%'
        },
        {
          title: '户型',
          dataIndex: 'houseType',
          key: 'houseType',
          scopedSlots: {
            customRender: 'houseType'
          },
          width: '8.5%'
        },
        {
          title: '面积',
          dataIndex: 'houseArea',
          key: 'houseArea',
          scopedSlots: {
            customRender: 'houseArea'
          },
          width: '4.5%'
        },
        {
          title: '朝向',
          dataIndex: 'orientationName',
          key: 'orientationName',
          scopedSlots: {
            customRender: 'orientationName'
          }
        },
        {
          title: '负责人信息',
          dataIndex: 'maintainer',
          key: 'maintainer',
          scopedSlots: {
            customRender: 'maintainer'
          },
          width: '12%'
        }
      ]
    }
  },
  methods: {
    loadData () {
    },
    backgroundColor (status) {
      const colorMap = { 1: '#FB4246', 2: '#FB4246', 3: '#03C683', 4: '#FFAF6D', 5: '#666666', 6: '#666666', 7: '#666666', 8: '#666666' }
      return { background: colorMap[status] || '#666666' }
    },
    openDetail () {}
  }
}
</script>

<style lang="less" scoped>
.house-table-list {
  /deep/ .ant-popover-inner-content {
    width: 100px;
    text-align: center;
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

  .lockOffline {
    ackground-color: fade(#BBBBBB, 10%);
    color: #BBBBBB;
  }

  .lockNormal {
    background-color: fade(#0A87F8, 10%);
    color: #0A87F8;
  }

  .lockLowPower {
    background-color: fade(#FB4246, 10%);
    color: #FB4246;
  }
}
</style>
