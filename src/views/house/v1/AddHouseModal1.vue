<template>
  <a-modal
    entered
    destroyOnClose
    :title="title"
    width="80%"
    :maskClosable="false"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :sm="12" :md="5" :lg="5">
              <a-form-item label="选择分店">
                <a-select v-model="branchId" placeholder="选择分店" :defaultValue="undefined">
                  <a-select-option v-for="(item, index) in storeList" :key="index" :value="item.subId">{{ item.subbranchName }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :sm="12" :md="5" :lg="5">
              <a-form-item label="">
                <a-button type="primary" @click="dialogFormVisible = true">批量生成房源</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        :loading="memberLoading"
      >
        <template v-for="(col, i) in ['building', 'roomNo', 'roomTypeId']" :slot="col" slot-scope="text, record">
          <template v-if="record.editable">
            <a-select v-if="col === 'roomTypeId'" :key="col" style="width: 140px;" :value="text" :defaultValue="undefined" :placeholder="columns[i].title" @change="val => handleChange(val, record.key, col)">
              <a-select-option v-for="item in roomTypeList" :key="item.id" :value="item.id">{{ item.roomtypeName }}</a-select-option>
            </a-select>
            <a-input
              :key="col"
              v-else
              style="margin: -5px 0"
              :value="text"
              :placeholder="columns[i].title"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
          </template>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </template>
        </template>
      </a-table>
      <a-button class="continue-add" style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">已添加<span>{{ data.length }}</span>套 <span class="add">继续添加</span></a-button>
    </a-card>
    <a-modal title="批量添加房间" :visible="dialogFormVisible" width="600px" @cancel="dialogFormVisible = false" @ok="handleAddBatch">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="栋/单位">
          <a-input v-decorator="[ 'building', {initialValue: undefined, rules: [{ required: true, message: '请输入栋/单位!' }]}]" placeholder="请输入栋/单位"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="楼层">
          <a-select v-decorator="[ 'floorLlist', {initialValue: undefined, rules: [{ required: true, message: '请选择楼层!' }]}]" mode="multiple" placeholder="选择房间所在楼层">
            <a-select-option
              v-for="item in 50"
              :key="item"
              :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="每层房间数">
          <a-input v-decorator="[ 'floorNum', {initialValue: undefined, rules: [{ required: true, message: '请输入每层房间数' }]}]" placeholder="请输入每层房间数"></a-input>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="房型">
          <a-select v-decorator="[ 'roomTypeId', {initialValue: undefined, rules: [{ required: true, message: '请请选择房型!' }]}]" placeholder="请选择房型">
            <a-select-option
              v-for="(item, index) in roomTypeList"
              :key="index"
              :value="item.id">
              {{ item.roomtypeName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>

<script>
import { postAction } from '@/utils/ajax'
export default {
  data() {
    return {
      title: '录入房间',
      visible: false,
      model: {},
      confirmLoading: false,
      memberLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      columns: [
        {
          title: '栋/单位',
          dataIndex: 'building',
          key: 'building',
          width: '20%',
          scopedSlots: { customRender: 'building' }
        },
        {
          title: '房间号',
          dataIndex: 'roomNo',
          key: 'roomNo',
          width: '20%',
          scopedSlots: { customRender: 'roomNo' }
        },
        {
          title: '户型',
          dataIndex: 'roomTypeId',
          key: 'roomTypeId',
          width: '40%',
          scopedSlots: { customRender: 'roomTypeId' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      branchId: [],
      storeList: [{ 'subbranchName': 'AV校区', 'address': 'AVAVAV', 'remark': 'AV', 'telphone': '01-323698546', 'fax': '', 'province': 1, 'city': 36, 'area': 38, 'headOfficeId': 0, 'subId': 23, 'addressId': 22, 'provinceName': '北京', 'cityName': '北京市', 'areaName': '西城区', 'branchIds': [] }],
      roomTypeList: [{ 'id': 21, 'roomtypeName': 'avav', 'roomtypeCount': 1123, 'headOfficeId': 17 }, { 'id': 22, 'roomtypeName': 'avav1', 'roomtypeCount': 1123, 'headOfficeId': 17 }],
      dialogFormVisible: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    show(record) {
      this.visiblekey = !!record.id
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.newMember()
        this.getStoreList()
        this.getRoomTypeList()
      })
    },
    // 确定
    handleOk() {
      this.memberLoading = true
      if (!this.branchId) {
        this.$message.error('请选择分店')
        return
      }
      this.data.forEach(record => {
        const { building, roomNo, roomTypeId } = record
        if (!building || !roomNo || !roomTypeId) {
          this.memberLoading = false
          this.$message.error('请填写完整房间信息。')
          // eslint-disable-next-line no-useless-return
          return false
        }
      })
      postAction(`/doorLockSys/addDoorLockRoom`, {
        'rooms': this.data.map(ele => {
          return {
            'roomNo': ele.roomNo,
            'building': ele.building,
            'branchId': this.branchId,
            'roomTypeId': ele.roomTypeId
          }
        })
      })
      .then((response) => {
        if (response.data.status === 201) {
          this.$message.success('新增房间成功')
          this.$emit('ok')
        } else {
          this.$message.error('新增房间失败')
        }
      })
      .catch(() => {
        this.$message.error('新增房间失败')
      }).finally(() => { this.memberLoading = false })
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    getStoreList () {
      postAction(`/doorLockSys/queryAllSubbranch`, {
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
    getRoomTypeList () {
      // TODO
      postAction(`/doorLockSys/queryAllRommType`, {
        'headOfficeId': 17
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
    newMember () {
      // const length = this.data.length
      // this.data.push({
      //   key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
      //   roomNo: '',
      //   building: '',
      //   roomTypeId: '',
      //   editable: true,
      //   isNew: true
      // })
      this.addNewRow()
    },
    addNewRow (row) {
      const length = this.data.length
      this.data.push({
        key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
        roomNo: row ? row.roomNo : '',
        building: row ? row.building : '',
        roomTypeId: row ? row.roomTypeId : '',
        editable: true,
        isNew: true
      })
    },
    remove (key) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.data = newData
      }
    },
    handleAddBatch () {
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = Object.assign({}, values)
          formData.floorLlist.sort((a, b) => a - b).forEach((ele, index) => {
            for (let index = 0; index < formData.floorNum; index++) {
              const num = index + 1
              if (this.data.length === 1 && !this.data[0].building && !this.data[0].roomNo && !this.data[0].roomTypeId) {
                this.data[0].building = formData.building
                this.data[0].roomNo = ele + '' + (num >= 10 ? num : ('0' + num))
                this.data[0].roomTypeId = formData.roomTypeId
              } else {
                this.addNewRow({
                  building: formData.building,
                  roomNo: ele + '' + (num >= 10 ? num : ('0' + num)),
                  roomTypeId: formData.roomTypeId
                })
              }
            }
          })
          this.dialogFormVisible = false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.continue-add {
  text-align: center;

  span {
    color: #0a87f8;
  }

  .add {
    padding-left: 10px;
  }

  &:hover {
    border-color: #0a87f8;
  }

}
</style>
