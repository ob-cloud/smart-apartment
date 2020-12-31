<template>
  <div id="homeCenter" class="table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="24">
        <a-col :sm="12" :md="5" :lg="5">
          <a-form-item label="分店">
            <a-select v-decorator="['subId', {initialValue: undefined}]" placeholder="所有分店">
              <a-select-option value="">所有分店</a-select-option>
              <a-select-option v-for="(item, index) in store" :key="index" :value="item.subId">{{ item.subbranchName }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :sm="12" :md="5" :lg="5">
          <a-form-item label="日期">
            <a-date-picker
              style="width: 100%"
              placeholder="选择日期时间"
              v-decorator="['date', {initialValue: '12:00:00'}]"
            />
          </a-form-item>
        </a-col>

        <a-col :sm="12" :md="5" :lg="5">
          <a-form-item label="状态">
            <a-select v-decorator="['roomStatus', {initialValue: undefined}]" placeholder="所有状态">
              <a-select-option value="">所有状态</a-select-option>
              <a-select-option v-for="(item,index) in roomType" :key="index" :value="index">{{ item }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <template v-if="toggleSearchStatus">
          <a-col :sm="12" :md="5" :lg="5">
            <a-form-item label="楼栋">
              <a-input v-decorator="['building']" placeholder="请输入楼栋号"></a-input>
            </a-form-item>
          </a-col>

          <a-col :sm="12" :md="5" :lg="5">
            <a-form-item label="房间">
              <a-input v-decorator="['roomNo']" placeholder="请输入房间号"></a-input>
            </a-form-item>
          </a-col>
        </template>

        <a-col :sm="12" :md="5" :lg="5">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="queryAllDoorLockRoom" icon="search">查询</a-button>
            <a @click="toggleSearchStatus = !toggleSearchStatus" style="margin-left: 8px">
              {{ toggleSearchStatus ? '收起' : '展开' }}
              <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
            </a>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <a-row>
      <a-col :span="18">
        <a-form
          class="sub-info"
        >

        </a-form>
      </a-col>
    </a-row>
    <div class="home-center">
      <a-collapse v-model="activeNames" v-if="tableData.length" :bordered="false" style="background-color: #fff;" expand-icon-position="right">
        <a-collapse-panel v-for="(item, index) in tableData" :key="`${index}`">
          <template slot="header">
            <a-row type="flex" class="row-bg roomList" justify="space-between">
              <a-col :span="12">
                <p><a-icon type="environment" /><strong>{{ item.name }} </strong></p>
                <p>{{ item.address }}</p>
              </a-col>
              <a-col class="text-r">
                <a-button type="primary" size="small" title="请勾选房间" :disabled="!item.select.length" @click.stop="opensRoom(item.select)">批量常开</a-button>
                <!-- <a-button type="primary" icon="plus" shape="circle" title="新增房源" @click="$router.push({path:'/home/addNew',query:{branchId:item.branchId,building:item.building}})" v-if="isShowList('房源管理','房间操作')"></a-button> -->
              </a-col>
            </a-row>
          </template>
          <div class="rl-center">
            <a-table
              :data-source="item.child"
              border
              :scroll="{y: 300}"
              rowKey="id"
              :pagination="false"
              style="width: 100%">
              <a-table-column
                title="#"
                dataIndex="index">
                <template slot-scope="text, record, index">
                  {{ index + 1 }}
                </template>
              </a-table-column>
              <a-table-column
                dataIndex="roomNo"
                title="房间号"
                align="center">
              </a-table-column>
              <a-table-column
                key="devStatus"
                title="设备状态"
                align="center">
                <template slot-scope="devStatus, record">
                  <span :style="{ color: record.isValid === 0 ? 'green' : record.isValid === 1 ? 'red' : '#ccc'}">
                    {{ record.isValid === '0' ? "正常" : record.isValid === '1' ? "异常" : "未绑定" }}
                  </span>
                </template>
              </a-table-column>
              <a-table-column
                key="status"
                title="房态"
                align="center">
                <template slot-scope="status, record">
                  {{ record.blocking === 1 ? '冻结' : (orderType[record.orderStatus] || roomType[record.roomStatus]) }}
                </template>
              </a-table-column>
              <a-table-column
                key="open"
                title="常开"
                align="center">
                <template slot-scope="text, record">
                  <p v-if="record.alwaysEndTime === 0 || record.alwaysEndTime < ( new Date()*1)">关</p>
                  <a-popover
                    v-else-if="record.alwaysStartTime < searchDate && record.alwaysEndTime > searchDate"
                    placement="right"
                    width="360"
                    trigger="hover">
                    <p>常开时间：{{ record.alwaysStartTime | formatDate }} - {{ record.alwaysEndTime | formatDate }}</p>
                    <span slot="reference" size="small" style="color:green">开</span>
                  </a-popover>
                  <a-tooltip
                    v-else
                    placement="right"
                    effect="light">
                    <p slot="content">常开时间：{{ record.alwaysStartTime | formatDate }} - {{ record.alwaysEndTime | formatDate }}</p>
                    <p >关<i class="a-icon-info a-icon--right"></i></p>
                  </a-tooltip>
                </template>
              </a-table-column>
              <a-table-column title="设置" align="center" key="action" width="200px">
                <template slot-scope="text, record">
                  <div v-if="record.isValid != '2'" >
                    <div v-if="record.blocking != 1">
                      <a-space>
                        <a-button type="primary" shape="circle" size="small" @click.stop="enterRoom(record)">住</a-button>
                        <a-button type="primary" shape="circle" size="small" @click.stop="watchRoom(record)">看</a-button>
                        <a-button type="primary" shape="circle" size="small" @click.stop="backRoom(record)" :disabled="record.orderStatus != 5">退</a-button>
                        <a-dropdown size="small" :trigger="['click']" type="primary" style="margin:0 10px;" >
                          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                            <a-icon type="more" />
                          </a>
                          <a-menu slot="overlay">
                            <a-menu-item key="1">
                              <a-button type="primary" plain size="small" @click.stop="blankRoom(record)">空闲</a-button>
                            </a-menu-item>
                            <a-menu-item key="2">
                              <a-button type="primary" plain size="small" @click.stop="clearRoom(record)">清洁</a-button>
                            </a-menu-item>
                            <a-menu-item key="3">
                              <a-button type="primary" plain size="small" @click.stop="fzRoom(record)">冻结</a-button>
                            </a-menu-item>
                            <a-menu-item key="4">
                              <a-button type="primary" plain size="small" @click.stop="opensRoom([record])">常开</a-button>
                            </a-menu-item>
                            <a-menu-item key="5">
                              <a-button type="primary" plain size="small" @click.stop="getRoomList(record)">记录</a-button>
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>
                      </a-space>
                    </div>
                    <div v-else>
                      <a-button type="primary" plain size="small" @click.stop="closeFZ(record)">解冻</a-button>
                    </div>
                  </div>
                  <div v-else>
                    <a-button type="primary" plain size="small" @click.stop="bindRoom(record)">绑定设备</a-button>
                  </div>
                </template>
              </a-table-column>
              <a-table-column
                key="oper"
                title="操作"
                align="center">
                <template slot-scope="text, record">
                  <a-space>
                    <a-button :disabled="isActionDisable(record)" type="default" icon="edit" circle size="small" @click.stop="editRoom(record)" title="编辑"></a-button>
                    <a-button :disabled="isActionDisable(record)" type="danger" icon="delete" circle size="small" @click.stop="deletRoom(record)" title="删除"></a-button>
                  </a-space>
                </template>
              </a-table-column>
            </a-table>
          </div>
        </a-collapse-panel>
      </a-collapse>
      <p class="none-tip" v-else>暂无数据</p>
      <!-- <div class="homt-foot">
          <a-pagination background layout="prev, pager, next" :total="1000"></a-pagination>
        </div> -->
    </div>
    <!-- <a-footer class="homt-foot">

    </a-footer> -->
    <!-- 弹窗 -->
    <a-modal title="看房" :visible="dialog1" center width="500px">
      <p class="mb20"><strong>将生效“{{ dealRoomInfo.building }}栋-{{ dealRoomInfo.roomNo }}房”的看房功能，授权日期：{{ dealRoomInfo.ds }}</strong></p>
      <a-form :model="form" laba-width="150px">
        <a-form-item label="选择员工">
          <a-select v-model="form.mobile" style="width:250px;" placeholder="请选择活动区域" @change="getPhone">
            <a-select-option value="">临时员工</a-select-option>
            <a-select-option v-for="(item, index) in userList" :key="index" :value="item.mobile">{{ item.userName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-model="form.phone" autocomplete="off" style="width:250px;"></a-input>
        </a-form-item>
      </a-form>
      <p class="warm-tip">点击“确认”后会将看房临时密码发至预留手机，15分钟内生效。点击“返回”取消该次授权</p>
      <div slot="footer" class="dialog-footer">
        <a-button type="primary" :disabled="!form.phone" @click="sureWatch">确 定</a-button>
        <a-button @click="dialog1 = false">取 消</a-button>
      </div>
    </a-modal>

    <a-modal title="退房" :visible.sync="dialog2" center width="500px">
      <p class="mb20"><strong>将结束“{{ dealRoomInfo.building }}栋-{{ dealRoomInfo.roomNo }}房”的授权，结束时间：{{ dealRoomInfo.ds }}</strong></p>
      <a-form :model="form" laba-width="160px">
        <a-form-item label="是否自动通知打扫房间">
          <a-radio v-model="form.autoClear" label="1">是</a-radio>
          <a-radio v-model="form.autoClear" label="0">否</a-radio>
        </a-form-item>
        <a-form-item label="选择员工">
          <a-select v-model="form.clearId" :disabled="form.autoClear === '0'" style="width:250px;" placeholder="请选择活动区域" @change="getPhone">
            <a-select-option value="">请选择员工</a-select-option>
            <a-select-option v-for="(item, index) in userList" :key="index" :value="item.mobile">{{ item.userName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <p class="warm-tip">点击“确认”后将结束本次授权，点击“返回”重新编辑勾选自动通知，结束本次操作将自动通知清洁工打扫卫生</p>
      <div slot="footer" class="dialog-footer">
        <a-button type="primary" :disabled="form.autoClear === '1' && form.clearId === ''" @click="sureBack">确 定</a-button>
        <a-button @click="dialog2 = false">取 消</a-button>
      </div>
    </a-modal>

    <a-modal title="清洁" :visible.sync="dialog3" center width="500px">
      <p class="mb20"><strong>是否将房态切换为清洁中</strong></p>
      <a-form :model="form" laba-width="150px">
        <a-form-item label="选择员工">
          <a-select v-model="form.mobile" style="width:250px;" placeholder="选择员工" @change="getPhone">
            <a-select-option value="">请选择员工</a-select-option>
            <a-select-option v-for="(item, index) in userList" :key="index" :value="item.mobile">{{ item.userName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="其他员工">
          <a-input v-model="form.phone" autocomplete="off" style="width:250px;" placeholder="请输入对应手机号"></a-input>
        </a-form-item>
      </a-form>
      <div slot="footer" class="dialog-footer">
        <a-button type="primary" :disabled="!form.phone" @click="sureClearRoom">确 定</a-button>
        <a-button @click="dialog3 = false">取 消</a-button>
      </div>
    </a-modal>

    <a-modal title="常开设置" :visible.sync="dialog4" center width="600px">
      <div class="text-r">
        <a-button type="info" @click="closeAlopen">关闭常开</a-button>
      </div>
      <a-form class="">
        <a-form-item label="常开次数：">
          <a-radio-group v-model="form.radio">
            <a-radio-button label="1">多次</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="常开时间：">
          <a-range-picker
            v-decorator="[ 'time', {} ]"
            format="YYYY-MM-DD HH:mm:ss"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始时间', '结束时间']"
          />
          <!-- <a-date-picker
            v-model="form.time"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            unlink-panels
            :default-time="['12:00:00', '12:00:00']">
          </a-date-picker> -->
        </a-form-item>
      </a-form>
      <p class="dl4-tip">
        点击确定后，该房间处于“常开”模式，在门锁端按“0#”即可开门
      </p>
      <div slot="footer" class="dialog-footer">
        <a-button type="primary" :disabled="!(form.time && form.time.length)" @click="sureOpen">确 定</a-button>
        <a-button @click="dialog4 = false">取 消</a-button>
      </div>
    </a-modal>
    <!-- 舍弃 start-->
    <a-modal title="冻结" :visible.sync="dialog5" center width="500px">
      <p class="dl4-tip">
        是否冻结该房源，冻结后，所有临时密码将无法开门
      </p>
      <div slot="footer" class="dialog-footer">
        <a-button type="primary" @click="frozenRoom">确 定</a-button>
        <a-button @click="dialog5 = false">取 消</a-button>
      </div>
    </a-modal>
    <bind-room-modal ref="roomModal"></bind-room-modal>
    <add-user-modal ref="userModal"></add-user-modal>
  </div>
</template>

<script>

import { postAction, getAction } from '@/utils/ajax'
import BindRoomModal from './BindRoomModal'
import AddUserModal from './AddUserModal'
export default {
  components: { BindRoomModal, AddUserModal },
  data() {
    return {
      toggleSearchStatus: false,
      store: [],
      formInline: {
        subId: '',
        user: '',
        roomStatus: '',
        building: '',
        roomNo: '',
        date: new Date().getTime()
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      tableData: [],
      roomType: {
        1: '空闲',
        2: '清洁',
        3: '脏房',
        4: '冻结',
        5: '退房',
        6: '常开'
      },
      orderType: {
        0: '',
        4: '冻结',
        5: '入住'
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
      activeNames: [],
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      userList: [],
      dealRoomInfo: {},
      form: {
        mobile: '',
        phone: '',
        autoClear: '0',
        clearId: '',
        radio: '1',
        time: [],

        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      searchDate: ''
    }
  },
  computed: {
    // ...mapGetters([
    //   'access_token',
    //   'headOfficeId',
    //   'adminName',
    //   'adminId',
    //   'branchIds'
    // ])
  },
  created() {
    this.queryAllSubbranch()
    this.queryAllDoorLockRoom()
    this.getUserList()
  },
  watch: {
    'form.time'(val) {
      if (!val) this.form.time = []
    }
  },
  methods: {
    isActionDisable (record) {
      return !(record.roomStatus === 1 && record.orderStatus === 0 && (record.alwaysEndTime === 0 || record.alwaysEndTime < (new Date() * 1)))
    },
    getUserList() {
      getAction(`/doorLockSys/queryAllUserPrivilege`, {
        'headOfficeId': this.headOfficeId
      })
      .then((response) => {
        if (response.data.status === 200) {
          this.userList = response.data.data
        }
      })
      .catch(() => {
        console.log()
      })
    },
    queryAllSubbranch() {
      postAction(`/doorLockSys/queryAllSubbranch`, {
        'headOfficeId': this.headOfficeId,
        'branchIds': this.branchIds
      })
      .then((response) => {
        if (response.data.status === 200) {
          this.store = response.data.data
        }
      })
      .catch(() => {
        this.$message.error('获取失败！')
      })
    },
    queryAllDoorLockRoom() {
      const sendData = {
        'headOfficeId': this.headOfficeId,
        conditionArray: []
      }
      if (this.formInline.roomStatus) sendData.roomStatus = this.formInline.roomStatus
      if (this.formInline.subId) {
        sendData.branchId = this.formInline.subId
      } else {
        sendData.branchIds = this.branchIds
      }
      if (this.formInline.date) sendData.checkInDate = this.formInline.date
      this.searchDate = this.formInline.date || new Date() * 1
      if (this.formInline.building) {
        sendData.conditionArray.push({
          'building': this.formInline.building
        })
      }
      if (this.formInline.roomNo) {
        sendData.conditionArray.push({
          'roomNo': this.formInline.roomNo
        })
      }
      postAction(`/doorLockSys/queryAllDoorLockRoom`, sendData)
      .then((response) => {
        if (response.data.status === 200) {
          // 处理房间列表处理为2级结构branchId+building确定第一级别
          // 第一级别参数有name，address，child
          const tarList = []; const getArrNum = {}
          response.data.data.forEach(element => {
            const name = element.branchName + '-' + element.building
            const arrNum = getArrNum[name]
            if (arrNum >= 0) {
              if (element.id > tarList[arrNum].child[tarList[arrNum].child.length - 1].id) {
                tarList[arrNum].child.push(element)
              } else {
                 tarList[arrNum].child.unshift(element)
              }
            } else {
              getArrNum[name] = tarList.length
              tarList.push({
                name,
                address: element.province + element.city + element.area,
                branchId: element.branchId,
                building: element.building,
                child: [element],
                select: []
              })
            }
          })
          this.tableData = tarList.sort((a, b) => {
            a.child.sort((c, d) => {
              return c.id - d.id
            })
            if (a.branchId === b.branchId) {
              return (a.building > b.building) ? 1 : -1
            } else {
              return a.branchId - b.branchId
            }
          })
        } else {
          this.tableData = []
        }
      })
      .catch(() => {
        this.$message.error('获取失败！')
      })

      // TODO
      const response = { data: {} }
      const { HouseList } = require('./data')
      response.data = HouseList
      console.log('===== ', response)
      const tarList = []; const getArrNum = {}
      response.data.data.forEach(element => {
        const name = element.branchName + '-' + element.building
        const arrNum = getArrNum[name]
        if (arrNum >= 0) {
          if (element.id > tarList[arrNum].child[tarList[arrNum].child.length - 1].id) {
            tarList[arrNum].child.push(element)
          } else {
              tarList[arrNum].child.unshift(element)
          }
        } else {
          getArrNum[name] = tarList.length
          tarList.push({
            name,
            address: element.province + element.city + element.area,
            branchId: element.branchId,
            building: element.building,
            child: [element],
            select: []
          })
        }
      })
      this.tableData = tarList.sort((a, b) => {
        a.child.sort((c, d) => {
          return c.id - d.id
        })
        if (a.branchId === b.branchId) {
          return (a.building > b.building) ? 1 : -1
        } else {
          return a.branchId - b.branchId
        }
      })
    },
    watchRoom(item) {
      this.form.phone = ''
      this.form.mobile = ''
      this.dealRoomInfo = Object.assign({}, item, {
        ds: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      })
      this.dialog1 = true
    },
    getPhone(val) {
       this.form.phone = val
    },
    sureWatch() {
      // 房间Id和电话号码
      postAction(`/doorLockSys/doorLockResend`,
        {
          'roomId': this.dealRoomInfo.id,
          'roomNo': this.dealRoomInfo.roomNo,
          'sentType': 2,
          'mobileRenterArray': [
            {
              'renterName': (this.userList.find(ele => ele.mobile === this.form.phone) || { userName: '临时员工' }).userName || ' ',
              'mobile': this.form.phone
            }
          ]

        })
      .then((response) => {
        this.$message.success('短信已发送')
        this.dialog1 = false
      })
      .catch(() => {
        this.$message.error('预约看房短信发送失败')
      })
    },
    doorLockResend(obj = {}) {
      postAction(`/doorLockSys/doorLockResend`,
       Object.assign({}, {
          'roomId': '',
          'sentType': '',
          'mobileRenterArray': []
        }, obj))
      .then((response) => {
        this.$message.success('短信已发送')
      })
      .catch(() => {
        this.$message.error('短信发送失败')
      })
    },
    sureBack() {
      postAction(`/doorLockSys/updateRoomStatus`, {
        'id': this.dealRoomInfo.id,
        'roomStatus': 3,
        'orderStatus': 5,
        'updateDate': new Date().getTime(),
        'roomNo': this.dealRoomInfo.roomNo,
        'startTime': this.dealRoomInfo.startTime,
        'endTime': this.dealRoomInfo.endTime,
        'innerLockSerialId': this.dealRoomInfo.innerLockSerialId,
        'outerLockSerialId': this.dealRoomInfo.outerLockSerialId,
        'renterMobile': this.form.clearId,
        'renterName': (this.userList.find(ele => ele.mobile === this.form.clearId) || {}).userName || ' '
      })
      .then((response) => {
        console.log(response)
        if (response.data.status === '205') {
          this.$message.success('退房成功')
          this.queryAllDoorLockRoom()
          this.dialog2 = false
        } else {
          this.$message.error('退房失败！')
        }
      })
      .catch(() => {
        this.$message.error('退房失败！')
      })
    },
    sureClearRoom() {
      postAction(`/doorLockSys/updateRoomStatus`, {
        'id': this.dealRoomInfo.id,
        'roomStatus': 2,
        'roomNo': this.dealRoomInfo.roomNo,
        'orderStatus': this.dealRoomInfo.orderStatus,
        'innerLockSerialId': this.dealRoomInfo.innerLockSerialId,
        'outerLockSerialId': this.dealRoomInfo.outerLockSerialId,
        'startTime': this.dealRoomInfo.startTime,
        'endTime': this.dealRoomInfo.endTime,
        'updateDate': new Date().getTime()
      })
      .then((response) => {
        if (response.data.status === '205') {
          this.$message.success('切换成功')
          this.doorLockResend({
            'roomId': this.dealRoomInfo.id,
            'roomNo': this.dealRoomInfo.roomNo,
            'sentType': 2,
            'mobileRenterArray': [
              {
                'renterName': (this.userList.find(ele => ele.mobile === this.form.mobile) || { userName: '临时员工' }).userName || '1',
                'mobile': this.form.mobile || this.form.phone
              }
            ]
          })
          this.queryAllDoorLockRoom()
          this.dialog3 = false
        } else {
          this.$message.error('切换失败')
        }
      })
      .catch(() => {
        this.$message.error('切换失败')
      })
    },
    sureOpen() {
      this.setAlwaysStatus(this.queryAllDoorLockRoom)
    },
    setAlwaysStatus(fn) {
      const tarPromise = this.dealRoomInfo.map(ele => {
        return postAction(`/doorLockSys/setAlwaysStatus`,
              {
                'roomId': ele.id,
                'startTime': this.form.time[0].getTime(),
                'endTime': this.form.time[1].getTime(),
                'times': this.form.radio === '1' ? 0 : 1,
                'isMax': this.form.radio === '1' ? 1 : 0,
                'roomNo': ele.roomNo,
                'mobileRenterArray': [{
                'mobile': this.adminName,
                'userName': this.adminName
                }],
                'deviceSerialIdArray': [
                  {
                  'innerLockSerialId': ele.innerLockSerialId,
                  'outerLockSerialId': ele.outerLockSerialId
                  }
                ]
                })
      })
      Promise.all(tarPromise)
      .then((response) => {
        this.$message.success('常开设置成功')
        this.dialog4 = false
        fn && fn()
      })
      .catch(() => {
        this.$message.error('常开设置失败')
      })
    },
    closeAlopen() {
      this.$confirm('是否关闭该房间常开功能', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const tarPromise = this.dealRoomInfo.map(ele => {
              return postAction(`/doorLockSys/delAlwaysStatus`, {
                    'deviceSerialIdArray': [
                      {
                      'innerLockSerialId': ele.innerLockSerialId,
                      'outerLockSerialId': ele.outerLockSerialId
                      }
                    ],
                    'roomId': ele.id
                  })
            })
            Promise.all(tarPromise)
            .then((response) => {
              this.dialog4 = false
              if (response.every(ele => ele.data.status === '205')) {
                this.$message.success('关闭常开成功')
                this.queryAllDoorLockRoom()
              } else {
                this.$message.error('关闭常开失败')
              }
              done()
            })
            .catch(() => {
              this.$message.error('关闭常开失败')
              this.dialog4 = false
              done()
            })
          } else {
            done()
          }
        }
      }).then(() => {
      }).catch(() => {
      })
    },
    backRoom(row) {
      this.form.autoClear = '0'
      this.form.clearId = ''
      this.dealRoomInfo = row
      this.dialog2 = true
    },
    fzRoom(row) {
      this.form.time = [(this.formInline.date || new Date().getTime()), (this.formInline.date || new Date().getTime()) + 24 * 3600 * 1000]
      this.dealRoomInfo = row
      // this.dialog5 = true;
      this.frozenRoom()
    },
    deletRoom(row) {
      this.$confirm({
        title: '提示',
        // centered: true,
        content: h => <div><p><strong>确定要删除房间{row.building}-{row.roomNo}</strong></p><p style="color:rgb(240, 197, 132);margin-top:6px;">点击“确定”后将删除该房间，点击“取消”返回</p></div>,
        onOk: () => {
          postAction(`/doorLockSys/deleteDoorLockRoom`, {
            'id': row.id,
            'roomNo': row.roomNo,
            'innerLockSerialId': row.innerLockSerialId
          })
          .then((response) => {
            console.log(response)
            if (response.data.status === '204' || response.data.status === '0') {
              this.$message.success('删除成功')
              this.queryAllDoorLockRoom()
            } else {
              this.$message.error('删除失败')
            }
          })
          .catch(() => {
            this.$message.error('删除失败')
          })
        },
        onCancel () {
        }
      })
    },
    enterRoom(row) {
      this.$refs.userModal.show({ roomId: row.id })
    },
    blankRoom(row) {
      if (this.$moment(this.formInline.date).format('YYYYMMDD') !== this.$moment(new Date()).format('YYYYMMDD')) {
        this.$message('搜索日期与当前日期不相符，不能操作空闲，清洁')
        return
      }
      this.$confirm(`<p><strong>是否将该房切换为空闲房</strong></p><p style="color:rgb(240, 197, 132);margin-top:6px;">点击“确定”后该房间当前的授权信息将被删除，点击“取消”返回</p>`, '切换空房', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        center: true
      }).then(() => {
        postAction(`/doorLockSys/updateRoomStatus`, {
          'id': row.id,
          'roomStatus': 1,
          'orderStatus': row.orderStatus,
          'innerLockSerialId': row.innerLockSerialId,
          'outerLockSerialId': row.outerLockSerialId,
          'startTime': row.startTime,
          'idleTime': row.orderStatus === 5 ? (this.$moment(this.$moment(row.endTime).format('YYYY-MM-DD')).add(1, 'day') - 1) : (this.$moment(this.$moment().format('YYYY-MM-DD')).add(1, 'day') - 1),
          'endTime': row.orderStatus === 5 ? row.endTime : (this.$moment(this.$moment().format('YYYY-MM-DD')).add(1, 'day') - 1),
          'roomNo': row.roomNo,
          'updateDate': new Date().getTime()
        })
        .then((response) => {
          console.log(response)
          if (response.data.status === '205') {
            this.$message.success('切换空闲房成功')
            this.queryAllDoorLockRoom()
          } else {
            this.$message.error('切换失败！')
          }
        })
        .catch(() => {
          this.$message.error('切换失败！')
        })
      }).catch(() => {
      })
    },
    clearRoom(row) {
      if (this.$moment(this.formInline.date).format('YYYYMMDD') !== this.$moment(new Date()).format('YYYYMMDD')) {
        this.$message('搜索日期与当前日期不相符，不能操作空闲，清洁')
        return
      }
      this.form.phone = ''
      this.form.mobile = ''
      this.dealRoomInfo = row
      this.dialog3 = true
    },
    frozenRoom() {
      this.$confirm(`<p style="color:rgb(240, 197, 132);"><strong>是否冻结该房源，冻结后，所有临时密码将无法开门</strong></p>`, '冻结房源', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
        center: true
      }).then(() => {
        if (this.dealRoomInfo.orderStatus === 5) {
          postAction(`/doorLockSys/updateRoomStatus`, {
            'id': this.dealRoomInfo.id,
            'roomStatus': this.dealRoomInfo.roomStatus,
            'roomNo': this.dealRoomInfo.roomNo,
            'innerLockSerialId': this.dealRoomInfo.innerLockSerialId,
            'outerLockSerialId': this.dealRoomInfo.outerLockSerialId,
            'orderStatus': 4,
            'startTime': 1546300800000,
            'endTime': 10413792000000,
            'updateDate': this.form.time[0]
          })
          .then((response) => {
            if (response.data.status === '205') {
              this.$message.success('冻结成功')
              this.queryAllDoorLockRoom()
              this.dialog5 = false
            } else {
              this.$message.error(response.data.message)
            }
          })
          .catch(() => {
            this.$message.error('冻结失败')
          })
        } else {
          postAction(`/doorLockSys/addRoomOrder`,
          {
            'startTime': 1546300800000,
            'endTime': 10413792000000,
            'roomId': this.dealRoomInfo.id,
            'roomNo': this.dealRoomInfo.roomNo,
            'roomStatus': 4
          }
          )
          .then((response) => {
            if (response.data.status === 201) {
              this.$message.success('冻结成功')
              this.queryAllDoorLockRoom()
              this.dialog5 = false
            } else {
              this.$message.error('冻结失败')
            }
          })
          .catch(() => {
            this.$message.error('保存失败')
          })
        }
      }).catch(() => {
      })
    },
    editRoom(record) {
      this.$refs.roomModal.show({ roomId: record.id, type: 1 })
    },
    getRoomList(row) {
      this.$router.push({
        path: '/home/roomList',
        query: {
          roomId: row.id,
          roomNo: row.roomNo
        }
      })
    },
    bindRoom(record) {
      this.$refs.roomModal.show({ roomId: record.id, type: 0 })
    },
    closeFZ(row) {
      this.$confirm(`此操作将解冻${row.roomNo}房间, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          postAction(`/doorLockSys/unblock`,
          {
            'id': row.id,
            'startTime': row.startTime,
            'endTime': row.endTime
          }
          )
          .then((response) => {
            this.$message.success(`${row.roomNo}解冻成功`)
            this.queryAllDoorLockRoom()
            this.dialog5 = false
          }).catch(() => {
            this.$message.success(`${row.roomNo}解冻失败`)
            this.queryAllDoorLockRoom()
            this.dialog5 = false
          })
        }).catch(() => {
        })
    },
    opensRoom(row) {
      this.form.radio = '1'
      this.form.time = []
      this.dealRoomInfo = row
      this.dialog4 = true
    },
    isShowList(str, str2 = '') {
      // //
      // const obj = JSON.parse(sessionStorage.getItem('roleInfo')).privilege
      // const tar = Object.keys(obj)
      // let isShow = false
      // for (let index = 0; index < tar.length; index++) {
      //   if (obj[tar[index]].name === str) {
      //     if (str2) {
      //       if (obj[tar[index]].subPrivilege.find(ele => ele.privilegeName === str2)) {
      //         isShow = true
      //       }
      //     } else {
      //       isShow = true
      //     }
      //   }
      // }
      // return isShow
      return true
    },
    handleSelectionChange(val, tar) {
      tar.select = val
    },
    checkboxInit(row, index) {
      if (row.innerLockSerialId && row.oboxSerialId) {
        return 1
      } else {
        return 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
#homeCenter {
  // background-color: rgb(240,242,245);
  .addNew {
    padding:10px 40px 0;
  }
  .title {
    text-align: left;
    font-size: 26px;
    height: 40px;
    line-height: 40px;
    padding: 10px 0 0 20px;
    color: rgb(118, 145, 155);
    font-weight: bold;
    border-bottom: 1px solid rgb(118, 145, 155);
  }
  .sub-info {
    padding: 10px 20px 0;
  }
  .sub {
    margin-left: 20px;
    height: 31px;
  }
  .home-center {
    position: relative;
    // min-height: calc(100vh - 170px);
    // padding: 0 1%;
    background-color: #fff;
    margin: 0px 20px;
    .home-tit {
      padding: 10px 20px 30px;
      font-size: 18px;
      font-weight: bold;
    }
    .home-list {
      padding: 0 20px;
    }
  }
  .pl20 {
    padding-left: 20px;
  }
  .left {
    float: left;
    height: 100px;
  }
  .el-collapse-item__header {
    height: auto;
  }
  .fs16 {
    font-size: 16px;
  }
  .text-r {
    text-align: right;
  }
  .mr20 {
    margin-right: 20px;
  }
  .el-table td,
  .el-table th {
    padding: 6px 0;
  }
  .homt-foot {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: #fff;
    text-align: right;
  }
  .roomList {
    width: 100%;
    line-height: 24px;
    padding: 6px 2%;
    .text-r {
      line-height: 48px;
    }
  }
  .rl-center {
    // margin: 10px 4% 0;
  }
  .mb20 {
    margin-bottom: 20px;
    text-align: center;
  }
  .warm-tip {
    color: rgb(240, 197, 132);
    text-align: center;
    padding: 4px 4%;
    font-weight: bold;
  }
  .dl4-tip {
    text-align: center;
    font-size: 16px;
    color: rgb(240, 197, 132);
  }
  .none-tip {
    border-top: 1px solid rgb(235, 238, 245);
    color: rgb(201, 201, 201);
    text-align: center;
    font-size: 14px;
    padding: 10px 4%;
    font-weight: bold;
  }
}
</style>
