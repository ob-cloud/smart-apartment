<template>
  <a-drawer
    title="录入房间"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
    <div id="homwAddNew">
      <div class="sub-center">
        <a-form :inline="true" :model="formInline" class="demo-form-inline top-info" size="small" laba-width="120px">
          <a-form-item >
            <strong slot="label">
              选择分店：
            </strong>
            <a-select v-model="formInline.branchId" placeholder="选择分店：" :disabled="!!branchId">
              <a-option v-for="(item, index) in storeList" :key="index" :label="item.subbranchName" :value="item.subId"></a-option>
            </a-select>
          </a-form-item>
          <a-form-item >
            <a-button type="primary" size="small" @click="dialogFormVisible = true">批量生成房源</a-button>
          </a-form-item>
          <div class="line-dashed"></div>
        </a-form>
        <div>
          <a-table
            :data="tableData"
            style="width: 100%">
            <a-table-column
              prop="date"
              label="栋/单位">
              <template slot-scope="scope">
                <a-input v-model="scope.row.building" placeholder="栋" size="small" :disabled="!!branchId"></a-input>
              </template>
            </a-table-column>
            <a-table-column
              prop="name"
              label="房间号">
              <template slot-scope="scope">
                <a-input v-model="scope.row.roomNo" placeholder="房间号" size="small"></a-input>
              </template>
            </a-table-column>
            <a-table-column
              prop="address"
              label="户型">
              <template slot-scope="scope">
                <a-select v-model="scope.row.roomTypeId" style="width:100%" size="small" placeholder="房型选择">
                  <a-option
                    v-for="(item, index) in roomTypeList"
                    :key="index"
                    :label="item.roomtypeName"
                    :value="item.id">
                  </a-option>
                </a-select>
              </template>
            </a-table-column>
            <a-table-column
              prop="name"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <a-button type="text" size="small" v-if="tableData.length > 1" @click="dealOneRoom(scope.$index)">删除</a-button>
              </template>
            </a-table-column>
          </a-table>
          <p class="addNewRoom" @click="addOneRoom"><a-button type="text" size="small" icon="a-icon-plus">添加房源</a-button></p>
        </div>
        <div class="btn-ct"><a-button type="primary" size="small" style="width:180p;" @click="subRoom">确认提交</a-button></div>
      </div>
      <!-- 弹窗内容 -->
      <a-modal title="批量添加房间" :visible="dialogFormVisible" width="400px">
        <a-form :model="dlForm" ref="someRoom" :inline="true" size="small" laba-width="100px" :rules="rules">
          <a-form-item label="栋/单位" prop="name">
            <a-input style="width:250px;" v-model="dlForm.name" placeholder="请输入栋/单位" :disabled="!!branchId"></a-input>
          </a-form-item>
          <a-form-item label="选择楼层" prop="floorLlist">
            <a-select v-model="dlForm.floorLlist" style="width:250px;" multiple placeholder="选择房间所在楼层">
              <a-option
                v-for="item in 50"
                :key="item"
                :label="item"
                :value="item">
                <template slot="prepend"></template>
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item label="每层房间数" prop="floorNum">
            <a-input v-model="dlForm.floorNum" style="width:250px;" placeholder="请输入每层房间数"></a-input>
          </a-form-item>
          <a-form-item label="房型选择" prop="floorType">
            <a-select v-model="dlForm.floorType" style="width:250px;" placeholder="请选择房型">
              <a-option
                v-for="(item, index) in roomTypeList"
                :key="index"
                :label="item.roomtypeName"
                :value="item.id">
              </a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <div slot="footer" class="dialog-footer">
          <a-button @click="dialogFormVisible = false" size="small">取 消</a-button>
          <a-button type="primary" @click="addSomeRoom('someRoom')" size="small">确 定</a-button>
        </div>
      </a-modal>
    </div>
  </a-drawer>
</template>

<script>
// import { mapGetters } from 'vuex'
import { postAction } from '@/utils/ajax'
export default {
  name: 'HomwAddNew',
  data() {
    return {
      drawerWidth: '60%',
      visible: false,
      formInline: {
        branchId: '',
        building: '',
        buildHeight: '',
        floorLlist: [],
        floorNum: '',
        user: '',
        region: ''
      },
      dlForm: {
        name: '',
        floorLlist: [],
        floorNum: '',
        floorType: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入栋/单位', trigger: 'blur' }
        ],
        floorLlist: [
          { type: 'array', required: true, message: '请选择楼层', trigger: 'change' }
        ],
        floorNum: [
          { required: true, message: '请输入每层房间数', trigger: 'blur' }
        ],
        floorType: [
          { required: true, message: '请选择房型', trigger: 'change' }
        ]
      },
      storeList: [],
      roomTypeList: [],
      tableData: [],
      copyData: {
        building: '',
        roomNo: '',
        roomTypeId: ''
      },
      dialogFormVisible: false,
      branchId: this.$route.query.branchId,
      building: this.$route.query.building
    }
  },
  computed: {
    // ...mapGetters([
    //   'adminId',
    //   'headOfficeId',
    //   'branchIds'
    // ])
  },
  methods: {
    show (record) {
      this.visible = true
      if (this.branchId && this.building) {
        this.formInline.branchId = this.branchId
        this.copyData.building = this.building
        this.dlForm.name = this.building
      }
      this.getStoreList()
      this.queryAllRommType()
      this.addOneRoom()
    },
    handleCancel () {
      this.close()
    },
    close () {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
    },
    getStoreList() {
      postAction(`/consumer/doorLockSys/queryAllSubbranch`, {
        'headOfficeId': this.headOfficeId,
        'branchIds': this.branchIds
      })
      .then((response) => {
        if (response.data.status === 200) {
          this.storeList = response.data.data
        } else {
          this.$message.error('分店列表查询失败')
        }
      })
      .catch(() => {
        this.$message.error('分店列表查询失败')
      })
    },
    queryAllRommType() {
      postAction(`/consumer/doorLockSys/queryAllRommType`, {
        'headOfficeId': this.headOfficeId
      })
      .then((response) => {
        if (response.data.status === 200) {
          this.roomTypeList = response.data.data
        } else {
          this.$message.error('分店列表查询失败')
        }
      })
      .catch(() => {
        this.$message.error('分店列表查询失败')
      })
    },
    addOneRoom(obj = {}) {
      this.tableData.push(Object.assign({}, this.copyData, obj))
    },
    dealOneRoom(index) {
      this.tableData.splice(index, 1)
    },
    addSomeRoom(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dlForm.floorLlist.sort((a, b) => a - b).forEach((ele, index) => {
            for (let index = 0; index < this.dlForm.floorNum; index++) {
              const num = index + 1
              if (this.tableData.length === 1 && !this.tableData[0].building && !this.tableData[0].roomNo && !this.tableData[0].roomTypeId) {
                this.tableData[0].building = this.dlForm.name
                this.tableData[0].roomNo = ele + '' + (num >= 10 ? num : ('0' + num))
                this.tableData[0].roomTypeId = this.dlForm.floorType
              } else {
                this.addOneRoom({
                  building: this.dlForm.name,
                  roomNo: ele + '' + (num >= 10 ? num : ('0' + num)),
                  roomTypeId: this.dlForm.floorType
                })
              }
            }
          })
          this.dialogFormVisible = false
        } else {
          this.$message.error('请完善资料')
          return false
        }
      })
    },
    subRoom() {
      if (!this.formInline.branchId) {
        this.$message.error('请选择分店')
        return
      }
      const clock = this.tableData.every(ele => {
        const keys = Object.keys(ele)
        for (let index = 0; index < keys.length; index++) {
          if (!ele[keys[index]]) return false
        }
        return true
      })
      if (clock) {
        postAction(`/consumer/doorLockSys/addDoorLockRoom`, {
          'rooms': this.tableData.map(ele => {
            return {
              'roomNo': ele.roomNo,
              'building': ele.building,
              'branchId': this.formInline.branchId,
              'roomTypeId': ele.roomTypeId
            }
          })
        })
        .then((response) => {
          if (response.data.status === 201) {
            this.$message.success('新增房间成功')
            this.$router.back(-1)
          } else {
            this.$message.error('新增房间失败')
          }
        })
        .catch(() => {
          this.$message.error('新增房间失败')
        })
      } else {
        this.$message.error('请填写完整信息')
      }
    }
  }
}
</script>

<style lang="less">
 #homwAddNew {
    box-sizing: border-box;
    // font-size: 16px;
    // width: 100%;
    // background-color: #e8e8e8;
    // .sub-center {
    //   margin: 20px 2% 0;
    //   border-radius: 10px;
    //   padding: 20px 40px;
    //   background-color: #fff;
    // }
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
 }
</style>
