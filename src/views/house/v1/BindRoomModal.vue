<template>
  <a-drawer
    title="设备绑定"
    :width="700"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
  >
    <div id="bindRoom">
      <a-form>
        <a-form-item label="房间名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'roomNo', {} ]" placeholder="房间名称" :disabled="disableEdit"></a-input>
        </a-form-item>
        <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-cascader
            :disabled="disableEdit"
            placeholder="请选择区域"
            expand-trigger="hover"
            v-decorator="[ 'where', {} ]"
            :options="options2"
            :props="props"
          ></a-cascader>
        </a-form-item>
        <a-form-item label="详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'addressName', {} ]" placeholder="详细地址" :disabled="disableEdit"></a-input>
        </a-form-item>
        <a-form-item label="房型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'roomTypeId', {initialValue: undefined} ]" placeholder="请选择房型" :disabled="disableEdit">
            <a-select-option v-for="(item, index) in roomList" :key="index" :value="item.id">{{ item.roomtypeName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="绑定网关" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'oboxSerialId', {initialValue: undefined} ]" placeholder="请选择网关" @change="changeClock" :disabled="!disableEdit">
            <a-select-option v-for="(item, index) in lockList" :key="index" :value="item.oboxId">{{ item.oboxName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="绑定外门锁" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'outerLockSerialId', {initialValue: undefined} ]" placeholder="（无外门锁可不选,选定则于外门锁绑定）" :disabled="!disableEdit">
            <a-select-option value="">无</a-select-option>
            <a-select-option v-for="(item, index) in llChild" :key="index" :value="item.deviceId">{{ item.deviceName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="绑定内门锁" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'innerLockSerialId', {initialValue: undefined} ]" placeholder="请选择内门锁" :disabled="!disableEdit">
            <a-select-option v-for="(item, index) in llChild" :key="index" :value="item.deviceId">{{ item.deviceName }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
    <!-- <div>
        <a-button type="primary" size="small" v-if="isShowList('房源管理','关联设备')" @click="saveClock" :disabledd="!(formInline.innerLockSerialId && roomInfo.roomNo && roomInfo.roomTypeId)">确 定</a-button>
        <a-button size="small" @click="$router.back(-1)">取 消</a-button>
      </div> -->
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button :disabledd="!(formInline.innerLockSerialId && roomInfo.roomNo && roomInfo.roomTypeId)" @click="saveClock" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
// import { mapGetters } from 'vuex'
import { postAction, getAction } from '@/utils/ajax'
export default {
  data() {
    return {
      visible: false,
      confirmLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      formInline: {
        oboxSerialId: '',
        innerLockSerialId: '',
        outerLockSerialId: ''
      },
      roomInfo: {},
      options2: [],
      props: {
        value: 'id',
        children: 'children',
        label: 'name'
      },
      roomList: [],
      lockList: [],
      llChild: [],
      form: this.$form.createForm(this),
      disableEdit: false
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
    show (record) {
      this.visible = true
      this.form.resetFields()
      this.disableEdit = record.type !== 1 // 1 房间编辑
      this.getRoomInfo(record.roomId)
      this.getPrinList()
      this.getRoomList()
    },
    getRoomInfo(roomId) {
      postAction(`/doorLockSys/queryDoorLockRoom`, {
        roomId
      })
      .then((response) => {
        if (response.data.status === 200) {
          const tarData = response.data.data
          tarData.where = [tarData.provinceId, tarData.cityId, tarData.areaId]
          this.roomInfo = tarData
          if (tarData.oboxSerialId) {
            this.formInline.oboxSerialId = tarData.oboxSerialId
            this.changeClock(this.formInline.oboxSerialId, 2)
          }
          if (tarData.innerLockSerialId) {
            this.formInline.innerLockSerialId = tarData.innerLockSerialId
          } else {
          }
          if (tarData.outerLockSerialId) this.formInline.outerLockSerialId = tarData.outerLockSerialId
          this.queryDoorLockByAdminId()
          const { where, roomNo, addressName, roomTypeId, oboxSerialId, innerLockSerialId, outerLockSerialId } = tarData
          this.form.setFieldsValue({ where, roomNo, addressName, roomTypeId, oboxSerialId, innerLockSerialId, outerLockSerialId })
        } else {
          this.$message.error('查询房间信息失败')
        }
      })
      .catch(() => {
        console.log()
        this.$message.error('查询房间信息失败')
      })
    },
    getPrinList() {
      getAction(`/doorLockSys/queryArea`)
      .then((response) => {
        const tarArr = []; const nameid = []
        response.data.data.forEach(ele => {
          if (nameid.indexOf(ele.provinceId) === -1) {
            nameid.push(ele.provinceId)
            tarArr.push({
              id: ele.provinceId,
              name: ele.provinceName,
              children: [{
                id: ele.cityId,
                name: ele.cityName,
                children: [{
                  id: ele.areaId,
                  name: ele.areaName
                }]
              }]
            })
          } else {
            const tarCity = tarArr[nameid.indexOf(ele.provinceId)].children
            const hasCity = tarCity.find(ele2 => ele2.id === ele.cityId)
            if (hasCity) {
              hasCity.children.push({
                id: ele.areaId,
                name: ele.areaName
              })
            } else {
              tarCity.push({
                id: ele.cityId,
                name: ele.cityName,
                children: [{
                  id: ele.areaId,
                  name: ele.areaName
                }]
              })
            }
          }
        })
        this.options2 = tarArr
      })
      .catch(() => {
        console.log()
        this.$message.error('获取省市区数据失败')
      })
    },
    getRoomList() {
      postAction(`/doorLockSys/queryAllRommType`, {
        'headOfficeId': this.headOfficeId
      })
      .then((response) => {
        if (response.data.status === 200) {
          this.roomList = response.data.data
        } else {
          this.$message.error('房型列表查询失败')
        }
      })
      .catch(() => {
        this.$message.error('房型列表查询失败')
      })
    },
    queryDoorLockByAdminId() {
      postAction(`/doorLockSys/queryDoorLockByAdminId`, {
        adminId: this.adminId
      })
      .then((response) => {
        if (response.data.status === 200) {
          this.lockList = response.data.data.oboxDevices || []
          // 将绑定的门锁重新绑回Obox列表
         if (this.roomInfo.oboxSerialId) { //没绑定的不用进入
            const hasObox = this.lockList.find(ele => ele.oboxId === this.roomInfo.oboxSerialId)
          if (hasObox) {
            hasObox.devices.push(
              { 'deviceId': this.roomInfo.innerLockSerialId, 'deviceName': this.roomInfo.innerLockName }
            )
          } else {
            this.lockList.push(
              { 'oboxId': this.roomInfo.oboxSerialId, 'devices': [{ 'deviceId': this.roomInfo.innerLockSerialId, 'deviceName': this.roomInfo.innerLockName }], 'oboxName': this.roomInfo.oboxName }
            )
          }
         }
          // 如果已经绑定了设备，就设置值，查不出来
          if (this.formInline.oboxSerialId) {
            this.changeClock(this.formInline.oboxSerialId, 2)
          }
        } else {
          this.$message('暂无可绑设备/设备获取失败')
        }
      })
      .catch(() => {
        this.$message('暂无可绑设备/设备获取失败')
      })
    },
    changeClock(val, cl = 1) {
      if (cl === 1) {
        this.formInline.innerLockSerialId = ''
        this.formInline.outerLockSerialId = ''
      }
      if (val) {
        this.llChild = (this.lockList.find(ele => ele.oboxId === val) || { devices: [] }).devices
      } else {
        this.llChild = []
      }
    },
    saveClock() {
      if (this.formInline.innerLockSerialId === this.formInline.outerLockSerialId) {
        this.$message.error('内门锁和外门锁不能选择同一设备')
        return
      }
      postAction(`/doorLockSys/updateDoorLockRoom`, {
        'id': this.roomInfo.id,
        'roomNo': this.roomInfo.roomNo,
        'building': this.roomInfo.building,
        'innerLockSerialId': this.formInline.innerLockSerialId,
        'outerLockSerialId': this.formInline.outerLockSerialId,
        'oboxSerialId': this.formInline.oboxSerialId,
        'oboxName': this.lockList.find(ele => ele.oboxId === this.formInline.oboxSerialId).oboxName,
        'branchId': this.roomInfo.branchId,
        'roomTypeId': this.roomInfo.roomTypeId,
        'roomStatus': this.roomInfo.roomStatus,
        'innerLockName': this.formInline.innerLockSerialId ? this.llChild.find(ele => ele.deviceId === this.formInline.innerLockSerialId).deviceName : '',
        'outerLockName': this.formInline.outerLockSerialId ? this.llChild.find(ele => ele.deviceId === this.formInline.outerLockSerialId).deviceName : '',
        'formerOuterId': this.roomInfo.outerLockSerialId,
        'formerInnerId': this.roomInfo.innerLockSerialId === this.formInline.innerLockSerialId ? '' : this.roomInfo.innerLockSerialId
      })
      .then((response) => {
        if (response.data.status === 205) {
          this.$message.success('绑定成功')
          this.$router.back(-1)
        } else {
          this.$message.error('绑定失败')
        }
      })
      .catch(() => {
        this.$message.error('绑定失败')
      })
    },
    isShowList(str, str2 = '') {
      //
      const obj = JSON.parse(sessionStorage.getItem('roleInfo')).privilege
      const tar = Object.keys(obj)
      let isShow = false
      for (let index = 0; index < tar.length; index++) {
        if (obj[tar[index]].name === str) {
          if (str2) {
            if (obj[tar[index]].subPrivilege.find(ele => ele.privilegeName === str2)) {
              isShow = true
            }
          } else {
            isShow = true
          }
        }
      }
      return isShow
    },
    handleCancel () {
      this.close()
    },
    close () {
      this.$emit('close')
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
#bindRoom {
  .centerInfo {
    box-sizing: border-box;
    margin: 20px 20px;
    background-color: #fff;
    border-radius: 20px;
    padding: 20px 40px;
    text-align: center;
    .baseInfo {
      padding: 20px 20px;

    }
    .equip {
      padding: 0 20px;
      .eq-top {
        font-weight: bold;
        font-size: 16px;
        text-align: center;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
      }
    }
    .flex-p {
      display: flex;
      justify-content: flex-start;
      margin: 20px 0 10px;
      padding-top: 10px;
      min-height: 400px;
      border: 1px dashed #ccc;
      border-radius: 10px;
      .fp-l {
        width: 300px;
        .bs-top {
          font-weight: bold;
          font-size: 16px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          margin-bottom: 10px;
        }
      }
      .fp-r {
        flex-grow: 1;
        margin-left: 20px;
        .eq-top {
          font-weight: bold;
          font-size: 16px;
          text-align: center;
          height: 30px;
          line-height: 30px;
          margin-bottom: 10px;
        }
        .a-form-item {
          text-align: left;
        }
      }
    }
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
