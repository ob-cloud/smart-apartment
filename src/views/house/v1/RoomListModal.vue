<template>
  <a-drawer
    title="记录"
    :width="700"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
  >
    <div id="homeRoomlist">
      <div class="ca-center">
        <a-tabs v-model="activeName">
          <a-tab-pane tab="租客列表" key="first">
            <div class="hl-head">
              <a-form layout="inline" size="small" class="demo-form-inline">
                <a-form-item >
                  <a-input v-model="formInline.renterName" placeholder="租客"></a-input>
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="queryRoomOrderList">查询</a-button>
                </a-form-item>
              </a-form>
            </div>
            <div class="centerList">
              <a-table
                border
                :data-source="tableData"
                style="width: 100%">
                <a-table-column
                  dataIndex="date"
                  title="授权时间"
                  width="180">
                  <template slot-scope="text,record">
                    {{ record.startTime | formatDate }} 至 {{ record.endTime |formatDate }}
                  </template>
                </a-table-column>
                <a-table-column
                  dataIndex="time"
                  title="订单时间"
                  width="160">
                  <template slot-scope="text,record">
                    {{ record.openTime | formatDate }}
                  </template>
                </a-table-column>
                <a-table-column
                  dataIndex="render"
                  title="租客">
                  <template slot-scope="text,record">
                    <a-table
                      border
                      :data="record.renters"
                      style="width: 100%">
                      <a-table-column
                        prop="renterName"
                        title="姓名">
                      </a-table-column>
                      <a-table-column
                        prop="mobile"
                        title="电话">
                      </a-table-column>
                    </a-table>
                  </template>
                </a-table-column>
                <a-table-column
                  dataIndex=""
                  title="操作">
                  <template slot-scope="text,record">
                    <a-row type="flex" justify="center" align="center" style="flex-wrap:wrap">
                      <a-button type="primary" size="mini" @click="doorLockResend(record,1)" :disabled="record.orderStatus==6 || !record.isValidate || !!cutNum" class="mb20">在线密码 {{ cutNum ? cutNum : '' }}</a-button>
                      <a-button type="primary" size="mini" @click="doorLockResend(record,3)" :disabled="record.orderStatus==6 || !record.isValidate || !!cutNum" class="mb20">离线密码 {{ cutNum ? cutNum : '' }}</a-button>
                      <a-button type="primary" size="mini" @click="doorLockResend(record,2)" :disabled="record.orderStatus==6 || !record.isValidate || !!cutNum" class="mb20">看房密码 {{ cutNum ? cutNum : '' }}</a-button>
                      <a-button type="primary" size="mini" @click="doorLockResend(record,4)" disabled class="mb20">发卡</a-button>
                      <a-button v-if="record.orderStatus==6" type="text" size="mini" disabled class="mb20">（冻结单）</a-button>
                    </a-row>
                  </template>
                </a-table-column>
              </a-table>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="信息上报" key="second">
            <a-table
              :data-source="doorRecord"
              border
              style="width: 100%">
              <a-table-column
                dataIndex="operation"
                title="信息类型"
                width="180">
              </a-table-column>
              <a-table-column
                dataIndex="name"
                title="门锁类型"
                width="180">
                <template slot-scope="text,record">
                  {{ record.isInner === 1? '门内锁': '门外锁' }}
                </template>
              </a-table-column>
              <a-table-column
                dataIndex="nickName"
                title="用户"
                width="180">
              </a-table-column>
              <a-table-column
                dataIndex="optTime"
                title="时间">
                <template slot-scope="text,record">
                  {{ record.optTime | formatDate }}
                </template>
              </a-table-column>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
      <!-- <div class="drawer-bootom-button">
        <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
          <a-button style="margin-right: .8rem">取消</a-button>
        </a-popconfirm>
        <a-button :disabledd="!(formInline.innerLockSerialId && roomInfo.roomNo && roomInfo.roomTypeId)" @click="saveClock" type="primary" :loading="confirmLoading">提交</a-button>
      </div> -->
    </div>
  </a-drawer>
</template>
<script>
// import { mapGetters } from 'vuex'
import moment from 'moment'
import { postAction } from '@/utils/ajax'
import {
  setInterval
} from 'timers'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      roomNo: this.$route.query.roomNo,
      roomId: this.$route.query.roomId,
      roomInfo: {
        building: '',
        address: ''
      },
      formInline: {
        renterName: ''
      },
      tableData: [],
      activeName: 'first',
      doorRecord: [],
      cutNum: 0,
      interval: null
    }
  },
  computed: {
    // ...mapGetters([
    //   'access_token',
    //   'adminId',
    //   'headOfficeId'
    // ])
  },
  methods: {
    show(record) {
      this.visible = true
      this.roomId = record.roomId
      this.roomNo = record.roomNo
      this.queryRoomOrderList()
      this.queryDoorRecord()
    },
    queryRoomOrderList() {
      postAction(`/doorLockSys/queryRoomOrderList`, {
          roomId: this.$route.query.roomId,
          renterName: this.formInline.renterName
        })
        .then((response) => {
          if (response.data.status === 200) {
            const tarData = response.data.data
            this.roomInfo.building = tarData.building
            this.roomInfo.address = `${tarData.provinceName || ''}${tarData.cityName || ''}${tarData.areaName || ''}${tarData.branchName || ''}-${tarData.building || ''}`
            this.tableData = (tarData.orders || []).sort((a, b) => b.openTime - a.openTime)
          } else {
            this.$message.error('查询租客列表失败')
          }
        })
        .catch(() => {
          this.$message.error('查询租客列表失败')
        })
    },
    queryDoorRecord() {
      postAction(`/doorLockSys/queryDoorRecord`, {
          id: this.$route.query.roomId
        })
        .then((response) => {
          console.log(response)
          if (response.data.status === 200) {
            this.doorRecord = response.data.data.sort((a, b) => b.optTime - a.optTime)
          } else {
            this.$message('上报信息查询失败')
          }
        })
        .catch(() => {
          this.$message.error('上报信息查询失败')
        })
    },
    doorLockResend(row, type) {
      let sentData
      if (type === 1) {
        sentData = {
          'roomId': this.$route.query.roomId,
          'startTime': row.startTime,
          'sentType': type,
          'endTime': row.endTime,
          'roomNo': this.roomNo,
          'mobileRenterArray': row.renters.map(ele => {
            return {
              'renterName': ele.renterName,
              'mobile': ele.mobile
            }
          })
        }
      } else if (type === 2) {
        sentData = {
          'roomId': this.$route.query.roomId,
          'sentType': type,
          'roomNo': this.roomNo,
          'mobileRenterArray': row.renters.map(ele => {
            return {
              'renterName': ele.renterName,
              'mobile': ele.mobile
            }
          })
        }
      } else if (type === 3) {
        sentData = {
          'startTime': row.startTime,
          'endTime': row.endTime,
          'roomNo': this.roomNo,
          'roomId': this.$route.query.roomId,
          'mobileRenterArray': row.renters.map(ele => {
            ele.type *= 1
            ele.sex *= 1
            return ele
          })
        }
      }
      postAction(`/doorLockSys/${type === 3 ? 'sendOfflinePassWord' : 'doorLockResend'}`, sentData)
        .then((response) => {
          this.$message.success('短信已发送')
          this.cutNum = 10
          this.interval = setInterval(() => {
            this.cutNum--
            if (!this.cutNum) {
              clearInterval(this.interval['_id'])
            }
          }, 1000)
        })
        .catch(() => {
          this.$message.error('保存失败')
        })
    },
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    }
  },
  filters: {
    formatDate(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped lang="less">
#homeRoomlist {
  width: 100%;
  .ca-center {
    background-color: #fff;
    margin: 20px 2% 0;
    border-radius: 10px;
    padding: 20px 40px;
    background-color: #fff;
    min-height: calc( 100vh - 140px)
  }
  .hl-head {
    height: 40px;
    padding: 0 10px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
  }
  .address {
    color:#ccc;
    font-size: 14px;
  }
  .centerList {
    margin-top: 30px;
    padding: 0 10px;
    background-color: #fff;
  }
  .mb20{
    margin-top: 6px;
    margin-bottom: 6px;
  }
}
.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
