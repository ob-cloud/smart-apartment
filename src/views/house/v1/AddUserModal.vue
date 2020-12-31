<template>
  <a-drawer
    title="添加租客"
    :width="800"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
  >
    <div id="homeAddUser">
      <div class="sub-center table-page-search-wrapper">
        <a-form-model layout="inline" :model="formInline">
          <a-form-model-item label="租期">
            <!-- <a-date-picker
              v-if="showDateSelect"
              v-model="addInfo.time"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              unlink-panels
              :picker-options="pickerOptions1"
              :default-time="['12:00:00', '12:00:00']">
            </a-date-picker> -->
            <a-range-picker
              v-if="showDateSelect"
              v-model="addInfo.time"
              format="YYYY-MM-DD HH:mm:ss"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始日期', '结束日期']"
            />
            <a-popover
              placement="right"
              trigger="click">
              <a-button>已租列表</a-button>
              <a-table slot="content" :data-source="closeData" style="width: 300px;">
                <a-table-column align="center" property="date" title="已租日期">
                  <template slot-scope="text, record">
                    {{ record.startTime | formatDate }} - {{ record.endTime | formatDate }}
                  </template>
                </a-table-column>
              </a-table>
            </a-popover>
          </a-form-model-item>
        </a-form-model>
        <p> 租客信息： </p>
        <a-form-model layout="inline" :ref="`form${index}`" :model="item" v-for="(item, index) in userList" :key="index" class="top-info bd-hr">
          <a-row :gutter="24">
            <a-col :sm="12" :md="12" :lg="12">
              <a-form-model-item label="姓名" prop="renterName" :rules="{ required: true, message: '姓名不能空', trigger: 'blur', }">
                <a-input v-model="item.renterName" placeholder="姓名"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :sm="12" :md="12" :lg="12">
              <a-form-model-item label="手机号" prop="renterMobile" :rules="[{ required: true, message: '手机不能空', trigger: 'blur' }, {validator: rulesObj.phontRules}]">
                <a-input v-model="item.renterMobile" placeholder="手机号"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :sm="12" :md="12" :lg="12">
              <a-form-model-item label="邮箱" prop="email" :rules="[{ required: true, message: '邮箱不能空', trigger: 'blur', }, {validator: rulesObj.emailRule}]">
                <a-input v-model="item.email" placeholder="邮箱"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :sm="12" :md="12" :lg="12">
              <a-form-model-item label="性别">
                <a-select v-model="item.sex" placeholder="性别">
                  <a-select-option value="1">男</a-select-option>
                  <a-select-option value="2">女</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :sm="12" :md="24" :lg="24">
              <a-form-model-item label="证件" prop="number" :rules="[{ required: true, message: '身份证不能空', trigger: 'blur' }, {validator: rulesObj.cdCardRule}]">
                <a-input-group compact>
                  <a-select style="width: 30%" v-model="item.type" placeholder="证件类型">
                    <a-select-option v-for="(item, index) in cdCardType" :key="index" :value="index">{{ item }}</a-select-option>
                  </a-select>
                  <a-input style="width: 70%" v-model="item.number" placeholder="证件号"></a-input>
                </a-input-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item v-if="userList.length > 1">
            <a-button style="float: right;" title="删除当前租客" icon="delete" @click="userList.splice(index,1)"></a-button>
          </a-form-model-item>
        </a-form-model>
        <div>
          <a-button plain size="small" @click="addOneRoom">新增租客</a-button>
        </div>
        <hr>
        <a-row class="row-bg mt20">
          <a-col :span="12">
            <a-radio-group v-model="radio2">
              <a-radio-button :value="1" disabled>发卡</a-radio-button>
              <a-radio-button :value="2">在线密码</a-radio-button>
              <a-radio-button :value="3">离线密码</a-radio-button>
            </a-radio-group>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button :disabledd="!addInfo.time.length" @click="saveAdd" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
//不可选时间段
// import { mapGetters } from 'vuex'
import { postAction } from '@/utils/ajax'
import moment from 'moment'
let dataList = []
export default {
  name: 'HomwAddNew',
  data() {
    //
    const phontRules = (rule, value, callback) => {
        if ((/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {
          callback()
        } else {
          callback(new Error('请输入正确手机号码'))
        }
      }
    const emailRule = (rule, value, callback) => {
        if ((/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) || !value) {
          callback()
        } else {
          callback(new Error('请输入正确邮箱'))
        }
      }
    const cdCardRule = (rule, value, callback) => {
      var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (regIdNo.test(value)) {
        callback()
      } else {
        callback(new Error('请输入18或15位身份证号'))
      }
    }

    return {
      visible: false,
      confirmLoading: false,
      roomId: '',
      addInfo: {
        time: []
      },
      rulesObj: { phontRules, emailRule, cdCardRule },
      userList: [],
      roomInfo: {},
      oneUser: {
        'renterName': '',
        'renterMobile': '',
        'email': '',
        'type': '0',
        'number': '',
        'remark': '',
        'sex': '1'
      },
      cdCardType: {
        0: '身份证/驾驶证',
        1: '士兵证',
        2: '台湾居民证',
        3: '外籍护照',
        4: '外交护照',
        5: '港澳通行证',
        6: '公务护照',
        7: '因公普通护照',
        8: '军官证'
      },
      formInline: {},
      pickerOptions1: {
        disabledDate(time) { //根据传入的时间匹配
          const timeStart = time.getTime()
          for (let index = 0; index < dataList.length; index++) {
            if (timeStart >= dataList[index].startTime && timeStart <= dataList[index].endTime) {
              return 1
            }
          }
        }
      },
      radio2: 2,
      closeData: [],
      rules: {
        renterName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        renterMobile: [
          { required: true, validator: phontRules, trigger: 'blur' }
        ],
        email: [
          { validator: emailRule, trigger: 'blur' }
        ],
        number: [
          { required: true, validator: cdCardRule, trigger: 'blur' }
        ]
      },
      showDateSelect: false
    }
  },
  mounted() {
    console.log(this.$refs)
  },
  computed: {
    // ...mapGetters([
    //   'access_token',
    //   'adminId',
    //   'headOfficeId'
    // ])
  },
  watch: {
    'addInfo.time'(val, oldVal) {
      if (!val) {
        this.addInfo.time = []
        return
      }
      let tar = false
      for (let index = 0; index < dataList.length; index++) {
        if ((val[0] >= dataList[index].startTime && val[0] <= dataList[index].endTime) || (val[1] >= dataList[index].startTime && val[1] <= dataList[index].endTime)) {
          tar = true
        }
      }
      if (tar) {
        this.$message.warning('不可选择已租用时间')
        this.addInfo.time = []
      }
    }
  },
  methods: {
    show (record) {
      this.visible = true
      this.roomId = record.roomId
      this.getRoomInfo(record.roomId)
      this.queryRoomOrderByRoomId(record.roomId)
      this.addOneRoom()
      this.$nextTick(() => {
        this.addInfo.time = [this.formatDate(Date.now()), this.formatDate(Date.now())]
      })
    },
    getRoomInfo(roomId) {
      postAction(`/doorLockSys/queryDoorLockRoom`, {
        roomId
      })
      .then((response) => {
        if (response.data.status === 200) {
          this.roomInfo = response.data.data
        } else {
          this.$message.error('查询房间日期失败')
        }
      })
      .catch(() => {
        this.$message.error('查询房间日期失败')
      })
    },
    queryRoomOrderByRoomId(roomId) {
      postAction(`/doorLockSys/queryRoomOrderByRoomId`, {
        id: roomId
      })
      .then((response) => {
        if (response.data.status === 200) {
          dataList = response.data.data
          this.closeData = dataList || []
        }
          this.showDateSelect = true
      })
      .catch(error => {
        console.log('queryRoomOrderByRoomId', error)
        this.$message.error('查询预定日期失败')
          this.showDateSelect = true
      })
    },
    addOneRoom(obj = {}) {
      this.userList.push(Object.assign({}, this.oneUser, obj))
    },
    saveAdd() {
      // 校验表单；
      console.log(this.formatDate(Date.now()))
      const canSave = this.userList.every((ele, index) => {
        let isOk = false
        this.$refs[`form${index}`][0].validate(valid => {
          if (valid) {
            isOk = true
          }
        })
        return isOk
      })
      if (!canSave) return
      //根据radio2的不同提示不一样的操作
      if (this.radio2 === 1) {
        this.$confirm({
          icon: 'check-circle',
          title: '发卡',
          width: 600,
          content: h => <p><p>将生成房间房间{this.roomInfo.roomNo}的房间授权信息</p><p style="color: #ccc;font-size:12px;">点击“确认”后将门卡放置发卡机；点击“返回”重新编辑。</p></p>,
          onOk: () => {
            this.addRoomOrder()
          },
          onCancel () {}
        })
      } else {
        this.$confirm({
          icon: 'check-circle',
          title: '发密码',
          width: 600,
          content: h => <p><p>将生成房间房间{this.roomInfo.roomNo}的房间授权信息</p><p>授权日期：{this.formatDate(this.addInfo.time[0])} - {this.formatDate(this.addInfo.time[1])}</p><p>预留手机号码：{this.userList.map(ele => ele.renterMobile).join(',')}</p><p style="color: #ccc;font-size:12px;">点击“确认”后将授权密码发至预留手机，请妥善保管；也可在“记录”中查看本次授权密码。点击“返回”重新编辑。</p></p>,
          onOk: () => {
            if (this.radio2 === 2) {
              this.addRoomOrder()
            } else if (this.radio2 === 3) {
              this.addRoomOrder()
            }
          },
          onCancel () {}
        })
      }
    },
    addRoomOrder(fn) {
      const sendData = {
        'startTime': this.addInfo.time[0],
        'endTime': this.addInfo.time[1],
        'roomId': this.roomId,
        'roomNo': this.roomInfo.roomNo,
        'roomStatus': 5,
        'renters': JSON.parse(JSON.stringify(this.userList)).map(ele => {
          ele.type *= 1
          ele.sex *= 1
          return ele
        })
      }
      if (this.radio2 === 3) {
        sendData.sendType = 2
      } else if (this.radio2 === 2) {
        sendData.sendType = 1
      }
      postAction(`/doorLockSys/addRoomOrder`, sendData
      )
      .then((response) => {
        if (response.data.status === 201) {
          this.$message.success('办理入住成功')
          // fn && fn();
          this.$router.back(-1)
        } else {
          this.$message.error('办理入住失败')
        }
      })
      .catch(() => {
        this.$message.error('保存失败')
      })
    },
    sendOfflinePassWord(fn) {
      postAction(`/doorLockSys/sendOfflinePassWord`,
      {
        'startTime': this.addInfo.time[0],
        'endTime': this.addInfo.time[1],
        'roomId': this.roomId,
        'mobileRenterArray': this.userList.map(ele => {
          ele.type *= 1
          ele.sex *= 1
          return ele
        })
      })
      .then((response) => {
        this.$message.success('短信已发送')
        this.$router.back(-1)
      })
      .catch(() => {
        this.$message.error('保存失败')
      })
    },
    canSub() {
      for (let index = 0; index < this.userList.length; index++) {
        if (!this.userList[index].renterName || !this.userList[index].renterMobile || !this.userList[index].number) {
          this.$message('用户姓名，手机号，证件号不能为空')
          return false
        }
      }
      return true
    },
    doorLockResend() {
      postAction(`/doorLockSys/doorLockResend`,
        {
          'roomId': this.roomId,
          'startTime': this.addInfo.time[0],
          'sentType': 1,
          'endTime': this.addInfo.time[1],
          'mobileRenterArray': this.userList.map(ele => {
            return {
                    'renterName': ele.renterName,
                    'mobile': ele.renterMobile
                  }
          })
        })
      .then((response) => {
        this.$message.success('短信已发送')
        this.$router.back(-1)
      })
      .catch(() => {
        this.$message.error('保存失败')
      })
    },
    formatDate(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCancel () {
      this.close()
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.userList = []
    }
  }

}
</script>

<style lang="less">
 #homeAddUser {
    box-sizing: border-box;
    font-size: 16px;
    width: 100%;
    // background-color: #e8e8e8;
    .sub-center {
      // margin: 20px 2% 0;
      // border-radius: 10px;
      padding: 20px 40px;
      // background-color: #fff;
    }
    .top-info {
      padding: 10px 20px 0;
    }
    .line-dashed {
      border-bottom: 1px dashed #ccc;
      margin-bottom:20px;
    }
    .addNewRoom {
      cursor: pointer;
      margin: 16px 10px 0;
      font-size: 16px;
      font-weight: bold;
      height: 30px;
      line-height: 30px;
      border: 1px solid rgba(202, 194, 194, 0.5);
      border-radius: 10px;
      text-align: center;
    }
    .btn-ct {
      height: 40px;
      line-height: 40px;
      // text-align: center;
      margin-top: 10px;
    }
    .a-dialog__body {
      padding: 10px 20px 0;
    }
    .bd-hr {
      margin: 10px 0;
      border: 1px dashed #ccc;
    }
    .mt20 {
       margin-top: 30px;
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
