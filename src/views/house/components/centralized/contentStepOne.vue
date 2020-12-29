<template>
  <div class="step_one_css">
    <head-title title="项目信息" style="margin-top: 20px;"></head-title>
    <div class="house_info_css">
      <input-item title="项目编号">
        <template slot="content">
          <a-input placeholder="请输入项目编号" v-model="houseData.no" />
        </template>
      </input-item>
      <input-item title="项目名称" :must="true" :required="requeredData.name.required" :error="requeredData.name.error">
        <template slot="content">
          <a-input placeholder="请输入项目名称" v-model="houseData.name" @change="changeValidate('name')" />
        </template>
      </input-item>
      <input-item title="项目地址" class="address" :must="true" width="560px" right="0">
        <a-input-group slot="content" compact>
          <a-select style="min-width: 100px" v-model="houseData.cityId" :showSearch="true" :filterOption="(inputValue,option)=>filterOption(inputValue,option)" @change="selectCity">
            <a-select-option :value="item.id" :key="item.id" v-for="(item) in cityList">{{ item.name }}</a-select-option>
          </a-select>
          <a-select
            showSearch
            placeholder="请输入小区地址"
            labelInValue
            :class="{ 'must-fill-border': mustFillBorder }"
            style="width: 460px;"
            :defaultActiveFirstOption="false"
            :showArrow="false"
            :filterOption="false"
            @change="getCommunity"
            @search="selectCommunity"
            @focus="focusCommunity"
            @blur="isEmpty"
            :value="communityName?{label:communityName}:undefined"
          >
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0;" />
              <div
                style="padding: 4px 8px 8px 8px;color: #0A87F8; cursor: pointer;"
                @mousedown="e => e.preventDefault()"
                @click="map_toggle">
                找不到小区？点击这里添加小区
              </div>
            </div>
            <a-select-option v-for="(item) in communityList" :key="item.id">
              <span>
                <span v-if="item.have==1">
                  <span style="color: #111111;">{{ item.name1 }}</span>
                  <span style="color: #0a87f8;">{{ item.name2 }}</span>
                  <span style="color: #111111;">{{ item.name3 }}</span>
                </span>
                <span v-else>{{ item.name }}</span>
              </span>
              <p style="font-size: 12px;color: #777777;">
                <!-- <icon-font style="margin-right: 4px;vertical-align: middle;" type="iconyumengtubiao_dingwei" /> -->
                {{ item.address }}</p>
            </a-select-option>
          </a-select>
          <span class="tips-must-fill" v-show="mustFillBorder">请输入小区地址</span>
        </a-input-group>
      </input-item>
      <input-item title="楼栋信息" class="lastItem" :required="requeredData.buildingNo.required" :error="requeredData.buildingNo.error">
        <template slot="content">
          <a-input placeholder="请输入" class="input_end_css1" v-model="houseData.buildingNo" @change="changeValidate('buildingNo')">
            <span slot="suffix">号/栋<i class="mustLbl">*</i></span>
          </a-input>
          <a-input placeholder="请输入" class="input_end_css2" v-model="houseData.unit">
            <span slot="suffix">单元</span>
          </a-input>
        </template>
      </input-item>

      <input-item title="楼层" class="lastItem" :must="true" :required="requeredData.floorInfo.required" :error="requeredData.floorInfo.error">
        <template slot="content">
          <a-input
            placeholder="请输入"
            class="input_end_css3"
            v-model="houseData.totalFloor"
            @keyup.native="changeTotalFloor"
            :disabled="isEdit"
            @change="changeValidate('floorInfo')"
          >
            <span slot="prefix">共</span>
            <span slot="suffix">层，</span>
          </a-input>
          <a-input
            placeholder="请输入"
            class="input_end_css4"
            v-model="houseData.perFloorRoomsTotal"
            @keyup.native="changeTotalFloor"
            :disabled="isEdit"
            @change="changeValidate('floorInfo')">
            <span slot="prefix">每层</span>
            <span slot="suffix">间</span>
          </a-input>
        </template>
      </input-item>
      <input-item title="" width="560px" right="0">
        <div class="room_num_set_css" slot="content">
          <a-checkbox :defaultChecked="false" v-model="isExcludeFour" @change="changeTotalFloor" :disabled="isEdit">
            房间号去“4”
          </a-checkbox>
          <a-checkbox :defaultChecked="addPrefix" @change="addPrefixFn" v-model="isRoomNoPrefix" :disabled="isEdit">
            增加房间号前缀
          </a-checkbox>
          <template v-if="addPrefix">
            <a-input placeholder="请输入" v-model="houseData.roomNoPrefix" @keyup.native="changeTotalFloor" :disabled="isEdit"></a-input>
            <span class="tip_num">
              房间号前缀<i class="mustLbl">*</i>
            </span>
          </template>
        </div>
      </input-item>
    </div>

    <div v-for="(item,index) in generatorRoomList" :key="index">
      <head-title title="房间信息" v-show="item.floorNo == currentFloor"></head-title>
      <div class="room_item_info_set" v-show="item.floorNo == currentFloor">
        <div class="head_tabs_css">
          <span class="tab_card_num" v-for="item in Number(generatorRoomList.length)" :key="item" @click="currentFloor=item" :class="currentFloor==item?'choosedTab':''">{{ item }}F</span>
        </div>
        <div class="floor_info_set">
          <div class="floor_room_num">
            第 {{ currentFloor }} 层，共
            <a-input placeholder="请输入" class="" v-model="currentFloorRoomList[currentFloor-1]" @keyup.native="changeFloor(currentFloor)"></a-input>
            间
          </div>
          <div class="set_btn_csss">
            <label>点击下列房间号，可启用/禁用对应房间</label>
            <a-button type="primary" class="close_floor_btn" size="small" @click="disabledFloor">
              <div v-show="item.isDisabled==0">
                <!-- <icon-font type="iconyumengtubiao_jinyong" /> -->
                关闭楼层
              </div>
              <div v-show="item.isDisabled==1">
                <!-- <icon-font type="iconyumengtubiao_chenggong" /> -->
                启用楼层
              </div>
            </a-button>
          </div>
        </div>
        <p class="room_num_css" v-show="item.isDisabled==0">房间号</p>
        <div class="room_num_item" v-show="item.isDisabled==0">
          <span
            v-for="(temp,tempIndex) in item.roomList"
            :key="tempIndex"
            :class="temp.isDisabled==0?'normalColor':'disabledColor'"
            @click="disabledHouse(temp)">{{ temp.roomNo }}</span>
        </div>
      </div>
    </div>
    <head-title class="fzr-box" title="负责人信息"></head-title>
    <div class="clearfix">
      <label-item title="所属门店(部门)" style="" :mustFill="true" class="u-bottom-border f-fl">
        <!-- <store-tree resMark="mk_house_centralized" @cancelOtherTree="cancelOtherTree(1)"
          :defaultValue='houseData.deptName' placement="topLeft" ref="selectDept" width="200px"
          @selectChange="selectDept" :show-employee="false"></store-tree> -->
      </label-item>
      <label-item title="负责人" class="f-fl" style="min-height: 100px" v-show="this.buildingProjectId!=''">
        <!-- <dept-employee-tree resMark="mk_house_centralized" @cancelOtherTree="cancelOtherTree(2)" ref="selectDeptEmp"
          width="200px" @selectChange="selectDeptEmp" :disableDept="true" placement="topLeft"
          :defaultValue="houseData.maintainerName"></dept-employee-tree> -->
      </label-item>
      <label-item title="负责人" f-fl style="min-height: 100px" v-show="this.buildingProjectId==''">
        <!-- <dept-employee-tree resMark="mk_house_centralized" @cancelOtherTree="cancelOtherTree(2)" ref="selectDeptEmp"
          width="200px" @selectChange="selectDeptEmp" :disableDept="true" placement="topLeft"
          :defaultValue="houseData.maintainerName"></dept-employee-tree> -->
      </label-item>
    </div>
    <!-- 小区地图 -->
    <add-village-map-modal ref="map"></add-village-map-modal>
  </div>
</template>

<script>
import headTitle from './headTitle'
import inputItem from '@/components/inputBox/inputItem'
import LabelItem from '@/components/FormItem/LabelItem'
// import deptEmployeeTree from '@/components/DeptEmployeeTree/index'
// import StoreTree from '@/components/DeptEmployeeTree/store'
// import * as API from '@/api/centralizedHouse'
// import * as PublicAPI from '@/api/public'
// import { employeeUserInfo } from '@/api/enterprise'
import AddVillageMapModal from '../../modules/AddVillageMapModal'
export default {
  name: 'ContentStepOne',
    components: {
      headTitle,
      inputItem,
      LabelItem,
      // deptEmployeeTree,
      // StoreTree,
      AddVillageMapModal,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes
      }
    },
    props: {
      buildingProjectId: {
        type: String,
        default: ''
      },
      typeFlag: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        isExcludeFour: false,
        houseData: { //添加房源基本信息相关
          houseBizMode: 1, //房源经营模式- 1、直营【原包租】，2、代理，3、加盟(全托)，4、加盟(半托)
          buildingNo: '',
          cityId: '',
          cityName: '',
          communityId: '',
          communityName: undefined,
          isExcludeFour: false,
          maintainerId: '',
          maintainerName: '',
          deptId: '',
          deptName: '',
          name: '',
          no: '',
          perFloorRoomsTotal: undefined,
          roomNoPrefix: '',
          totalFloor: undefined,
          unit: '',
          floorList: [{
            floorNo: '',
            isDisabled: false,
            roomList: [{
              isDisabled: false,
              roomNo: ''
            }]
          }]
        },
        //生成房间号相关
        roomNoGeneratorForm: {
          // genFloor: 0,
          highestFloor: 0,
          isExcludeFour: false,
          isLeastFourDigits: false,
          isRoomsCountDiff: false,
          perFloorRoomsCount: 0,
          roomNoPrefix: ''
        },
        generatorRoomList: [],
        currentFloor: 1,
        currentFloorRoomList: [],
        addPrefix: false,
        //获取小区地址相关
        cityList: [],
        communityList: [],
        searchCommunityVal: undefined,
        mustFillBorder: false,
        isRoomNoPrefix: false,
        isEdit: false,
        cityName: undefined,
        requeredData: {
          no: {
            required: false,
            error: '请输入项目编号'
          },
          name: {
            required: false,
            error: '请输入项目名称'
          },
          buildingNo: {
            required: false,
            error: '请输入'
          },
          floorInfo: {
            required: false,
            error: '请输入'
          }
        },
        showMap: false,
        searchAddressHaveValue: false,
        communityName: undefined,
        cityPoint: []
      }
    },
    created() {
      // 获取租户的授权城市信息列表
      this.getCity()
      this.initData()
    },
    mounted() {},
    methods: {
      cancelOtherTree(val) {
        if (val === 1) {
          this.$refs.selectDeptEmp.showTree = false
        }
        if (val === 2) {
          this.$refs.selectDept.showTree = false
        }
      },
      //来自自定义搜索
      filterOption(inputValue, option) {
        if (!inputValue) {
          return true
        }
        return option.componentOptions.children[0].text.indexOf(inputValue) > -1
      },
      map_toggle() {
        this.$refs.map.show({ ...this.houseData, cityPoint: this.cityPoint })
      },
      map_toggle_close() {
        this.showMap = false
      },
      getCommunityBymap(value) {
        this.houseData.communityId = value.communityId
        this.houseData.communityName = value.communityName
        this.communityName = value.communityName
        this.mustFillBorder = false
      },
      getUserInfo() {
        // if (this.typeFlag === 1) {
        //   employeeUserInfo().then(res => {
        //     this.houseData.maintainerId = res.data.empId
        //     this.houseData.maintainerName = res.data.name
        //     this.houseData.deptId = res.data.deptId
        //     this.houseData.deptName = res.data.deptName
        //   })
        // }
      },
      //生成房间号相关
      addPrefixFn() {
        this.addPrefix = !this.addPrefix
      },
      changeTotalFloor() {
        // 改变共多少层
        if (this.houseData.totalFloor * 1 > 99) {
          this.houseData.totalFloor = 99
        }
        if (this.houseData.perFloorRoomsTotal * 1 > 100) {
          this.houseData.perFloorRoomsTotal = 100
        }
        if (
          !this.houseData.totalFloor ||
          !this.houseData.perFloorRoomsTotal
        ) {
          return
        }
        if (
          this.houseData.totalFloor *
          this.houseData.perFloorRoomsTotal >
          1000
        ) {
          this.$message.error('总房间数不能大于1000间')
          this.generatorRoomList = []
          return
        }
        if (!this.houseData.roomNoPrefix) {
          this.houseData.roomNoPrefix = ''
        }
        this.roomNoGeneratorForm.highestFloor = this.houseData.totalFloor
        this.roomNoGeneratorForm.perFloorRoomsCount = this.houseData.perFloorRoomsTotal
        this.roomNoGeneratorForm.roomNoPrefix = this.houseData.roomNoPrefix
        this.roomNoGeneratorForm.isExcludeFour = this.isExcludeFour
        const postData = Object.assign({}, this.roomNoGeneratorForm)
        postData.isExcludeFour = postData.isExcludeFour ? 1 : 0
        postData.isLeastFourDigits = postData.isLeastFourDigits ? 1 : 0
        postData.isRoomsCountDiff = postData.isRoomsCountDiff ? 1 : 0
        //每层房间数量
        this.currentFloorRoomList = []
        for (let i = 0; i < this.houseData.totalFloor; i++) {
          this.currentFloorRoomList.push(this.houseData.perFloorRoomsTotal)
        }
        // API.roomNoGenerator(postData).then(res => {
        //   let data = res.data
        //   let list = []
        //   for (let item of data) {
        //     let o = {}
        //     o.floorNo = item.floor
        //     o.isDisabled = 0
        //     let arr = []
        //     for (let f of item.roomNoList) {
        //       let n = {}
        //       n.roomNo = f
        //       n.isDisabled = 0
        //       arr.push(n)
        //     }
        //     o.roomList = arr
        //     list.push(o)
        //   }
        //   this.generatorRoomList = list
        //   this.currentFloor = 1
        // })
      },
      changeFloor(currentFloor) {
        if (
          !this.houseData.totalFloor ||
          !this.houseData.perFloorRoomsTotal
        ) {
          return
        }
        if (!this.currentFloorRoomList[currentFloor - 1]) {
          return
        }
        if (!this.houseData.roomNoPrefix) {
          this.houseData.roomNoPrefix = ''
        }
        this.roomNoGeneratorForm.isExcludeFour = this.isExcludeFour
        const postData = Object.assign({}, this.roomNoGeneratorForm)
        postData.genFloor = currentFloor
        postData.perFloorRoomsCount = this.currentFloorRoomList[currentFloor - 1]
        postData.isExcludeFour = postData.isExcludeFour ? 1 : 0
        postData.isLeastFourDigits = postData.isLeastFourDigits ? 1 : 0
        postData.isRoomsCountDiff = postData.isRoomsCountDiff ? 1 : 0

        // API.roomNoGenerator(postData).then(res => {
        //   if (res.code === '200') {
        //     // 改变了某一层有几间的数据
        //     let floor = res.data[0]
        //     let arr = []
        //     for (let item of floor.roomNoList) {
        //       let o = {
        //         roomNo: item,
        //         isDisabled: 0
        //       }
        //       arr.push(o)
        //     }
        //     this.generatorRoomList[floor.floor - 1].floorNo = floor.floor
        //     this.generatorRoomList[floor.floor - 1].roomList = arr
        //   }
        // })
      },
      disabledFloor() {
        this.generatorRoomList[this.currentFloor - 1].isDisabled = this.generatorRoomList[this.currentFloor - 1].isDisabled === 0 ? 1 : 0
      },
      disabledHouse(temp) {
        temp.isDisabled = temp.isDisabled === 0 ? 1 : 0
      },
      //获取小区地址相关
      getCity() {
        // PublicAPI.getCityList().then(res => {
        //   this.cityList = res.data
        //   this.houseData.cityId = this.cityList[0].id
        //   this.houseData.cityName = this.cityList[0].name
        //   this.cityPoint = [this.cityList[0].lng, this.cityList[0].lat]
        // })
      },
      selectCity(val) {
        this.houseData.cityId = val
        this.cityList.forEach((item) => {
          if (item.id === this.houseData.cityId) {
            this.houseData.cityName = item.name
            this.cityPoint = [item.lng, item.lat]
            //清空下小区地址
            this.houseData.communityId = ''
            this.communityName = undefined
          }
        })
      },
      getCommunity(value) {
        this.houseData.communityId = value.key
        this.communityName = value.label
        this.mustFillBorder = false
      },
      focusCommunity(searchVal) {
        if (searchVal === undefined || searchVal === '') {
          this.searchAddressHaveValue = false
          this.communityList = []
        } else {
          this.searchAddressHaveValue = true
        }
      },
      selectCommunity(searchVal) {
        this.searchCommunityVal = searchVal === '' ? undefined : searchVal
        this.communityList = []
        if (searchVal === undefined || searchVal === '') {
          this.searchAddressHaveValue = false
        } else {
          this.searchAddressHaveValue = true
        }
        // PublicAPI.searchCommunity(this.houseData.cityId, this.searchCommunityVal).then(res => {
        //   this.communityList = res.data
        //   //防止0
        //   if (searchVal === undefined || searchVal === '') {} else {
        //     this.communityList.forEach((item) => {
        //       const arr = item.name.split(searchVal)
        //       if (arr.length > 2) {
        //         item.have = 1
        //         item.name1 = arr[0]
        //         let val = ''
        //         arr.forEach((v, i) => {
        //           if (i > 1) {
        //             val += searchVal + v
        //           }
        //         })
        //         item.name2 = searchVal
        //         item.name3 = val
        //       } else if (arr.length === 2) {
        //         item.have = 1
        //         item.name1 = arr[0]
        //         item.name2 = searchVal
        //         item.name3 = arr[1]
        //       } else {
        //         item.have = 0
        //       }
        //     })
        //   }
        // })
      },
      isEmpty() {
        if (!this.houseData.communityId) {
          this.mustFillBorder = true
        } else {
          this.mustFillBorder = false
        }
      },
      //选择部门
      selectDept(selectObj) {
        if (selectObj.type === 'dept') {
          this.houseData.deptId = selectObj.id
          this.houseData.deptName = selectObj.name
        }
        if (!selectObj.type && !selectObj.name) {
          this.houseData.deptId = ''
          this.houseData.deptName = ''
        }
      },
      //选择负责人
      selectDeptEmp(selectObj) {
        if (selectObj.type === 'employee') {
          this.houseData.maintainerId = selectObj.id
          this.houseData.maintainerName = selectObj.name
        }
        if (!selectObj.type && !selectObj.name) {
          this.houseData.maintainerId = ''
          this.houseData.maintainerName = ''
        }
      },
      //保存数据
      houseCentralizedAdd(fromPos) {
        if (!this.houseData.deptId) {
          this.$message.warning('请选择所属门店(部门)！')
          return false
        }
        const flag = this.checkData()
        if (!flag) {
          this.$message.warning('请输入必填项！')
          return false
        }
        if (this.houseData.totalFloor * this.houseData.perFloorRoomsTotal > 1000) {
          this.$message.error('总房间数不能大于1000间')
          return false
        }
        this.houseData.floorList = this.generatorRoomList
        //是否包含4
        this.houseData.isExcludeFour = this.isExcludeFour ? 1 : 0
        this.$emit('changeLoading', true)
        // API.houseCentralizedAdd(this.houseData).then(res => {
        //   this.$emit('changeLoading', false)
        //   if (res.code === '200') {
        //     this.$message.info('添加成功')
        //     this.$emit('refreshinfoFun', true)
        //     this.$emit('initBuildingProjectId', res.data, fromPos)
        //   } else {
        //     this.$message.error('添加失败')
        //   }
        // })
        return true
      },
      //编辑数据
      houseCentralizedEdit() {
        if (!this.houseData.deptId) {
          this.$message.warning('请选择所属门店(部门)！')
          return false
        }
        const flag = this.checkData()
        if (!flag) {
          this.$message.warning('请输入必填项！')
          return false
        }
        this.houseData.id = this.buildingProjectId
        this.$emit('changeLoading', true)
        // API.houseCentralizedEdit(this.houseData).then(res => {
        //   this.$emit('changeLoading', false)
        //   if (res.code === '200') {
        //     this.$message.info('编辑成功')
        //     this.$emit('refreshinfoFun', true)
        //   } else {
        //     this.$message.error('编辑失败')
        //   }
        // })
        return true
      },
      //初始化数据
      initData() {
        if (this.buildingProjectId) {
          // API.houseCentralizedView(this.buildingProjectId).then(res => {
          //   if (res.code === '200') {
          //     this.isEdit = true
          //     this.houseData = res.data
          //     this.isExcludeFour = this.houseData.isExcludeFour === 1 ? true : false
          //     this.isRoomNoPrefix = this.houseData.roomNoPrefix != '' ? true : false
          //     this.addPrefix = this.isRoomNoPrefix
          //     this.communityName = this.houseData.communityName
          //   }
          // })
        }
        this.getUserInfo()
      },
      //检验数据
      checkData() {
        //检验
        let flag = true
        if (!this.houseData.name) {
          this.requeredData.name.required = true
          flag = false
        }
        if (!this.houseData.buildingNo) {
          this.requeredData.buildingNo.required = true
          flag = false
        }
        if (!this.houseData.totalFloor) {
          this.requeredData.floorInfo.required = true
          flag = false
        }
        if (!this.houseData.perFloorRoomsTotal) {
          this.requeredData.floorInfo.required = true
          flag = false
        }
        if (!this.houseData.communityId) {
          this.mustFillBorder = true
          flag = false
        } else {
          this.mustFillBorder = false
        }
        return flag
      },
      changeValidate(value) {
        if (value === 'floorInfo') {
          let flag = true
          if (!this.houseData['totalFloor']) {
            flag = false
          }
          if (!this.houseData['perFloorRoomsTotal']) {
            flag = false
          }
          if (flag) {
            this.requeredData[value].required = false
          } else {
            this.requeredData[value].required = true
          }
        } else {
          if (this.houseData[value]) {
            this.requeredData[value].required = false
          } else {
            this.requeredData[value].required = true
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .step_one_css {
    position: relative;
    width: 100%;
    padding: 0 20px;

    .house-model {
      .itemStyle {
        width: 275px;
        height: 70px;
        border-radius: 5px;
        margin: 0px 15px 0px 0;
        padding: 10px 0px 4px 10px;
        box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
        position: relative;

        .triangle-top-right-choose {
          position: absolute;
          color: #FFFFFF;
          top: 2px;
          right: 2px;
        }

        .triangle-top-right-click {
          position: absolute;
          width: 0;
          border: 16px solid #0A87F8;
          border-bottom: 16px solid transparent;
          border-left: 16px solid transparent;
          border-top-right-radius: 4px;
          top: 0px;
          right: 0px;
        }

        svg {
          width: 15px;
          height: 15px;
          color: #ffffff;
        }
      }

      .unClickStyle {
        background: #FFFFFF;
      }

      .clickStyle {
        box-shadow: 0px 2px 8px 0px rgba(2, 19, 34, 0.1);
        border: 1px solid #0A87F8;
        background: #F5FAFF;
      }
    }

    .house_info_css {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;

      .tips-must-fill {
        position: absolute;
        left: 100px;
        bottom: -20px;
        color: red;
      }

      & /deep/ .input_end_css1 {
        .ant-input {
          padding-right: 48px;
        }
      }

      & /deep/ .input_end_css2 {
        .ant-input {
          padding-left: 6px;
          padding-right: 31px;
        }
      }

      & /deep/ .input_end_css3 {
        .ant-input {
          padding-left: 18px;
          padding-right: 33px;
        }
      }

      & /deep/ .input_end_css4 {
        .ant-input {
          padding-left: 32px;
          padding-right: 16px;
        }
      }

      .address {
        /deep/ .ant-select-dropdown--empty {
          display: none;
        }

        /deep/ .ant-select-selection-selected-value {
          span {
            color: #111111 !important;
          }

          p {
            display: none;
          }
        }
      }

      .mustLbl {
        color: red;
        vertical-align: middle;
        padding-left: 5px;
      }

      .room_num_set_css {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 32px;

        & /deep/ .ant-checkbox-wrapper {
          flex-shrink: 0;
          color: #ddd;
        }

        & /deep/ .ant-input {
          width: 120px;
          margin-left: 20px;
        }

        .tip_num {
          flex-shrink: 0;
        }
      }
    }

    .room_item_info_set {
      background: #fff;
      border-radius: 4px;
      border: 1px solid #ddd;
      width: 100%;
      height: auto;
      overflow: hidden;
      padding: 0;
      margin-bottom: 20px;

      .head_tabs_css {
        width: 100%;
        height: 36px;
        border-radius: 0px 4px 4px 4px;
        border-bottom: 1px solid #ddd;
        display: -webkit-box;
        justify-content: flex-start;
        align-items: center;
        overflow-x: auto;
        overflow-y: hidden;

        .tab_card_num {
          width: 36px;
          height: 36px;
          color: #ddd;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #ddd;
          font-weight: 500;
          cursor: pointer;
        }

        .choosedTab {
          background: rgba(10, 135, 248, .1);
          z-index: 3;
          height: 37px;
        }
      }

      .floor_info_set {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        overflow: hidden;
        padding: 15px 10px 8px 10px;

        .floor_room_num {
          color: #ddd;
          font-size: 14px;

          & /deep/ .ant-input {
            width: 90px;
            border: none;
            box-shadow: none;
            border-bottom: 1px solid #ddd;
            border-radius: 0;
            text-align: center;
            color: #0a87f8;
          }
        }

        .set_btn_csss {
          display: flex;
          justify-content: flex-end;
          align-items: center;

          &>label {
            color: #ffa036;
            font-size: 12px;
            margin-right: 20px;
          }

          .close_floor_btn {
            width: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 28px;
          }
        }
      }

      .room_num_css {
        width: 100%;
        position: relative;
        overflow: hidden;
        padding: 10px;
        color: #777;
        font-size: 14px;
      }

      .room_num_item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        padding: 0px 0 0px 10px;

        &>span {
          width: 66px;
          height: 28px;
          flex-shrink: 0;
          text-align: center;
          line-height: 26px;
          cursor: pointer;
          font-size: 14px;
          border-radius: 4px;
          margin: 0 10px 20px 0;
        }

        .normalColor {
          border: 1px solid #0A87F8;
          color: #0A87F8;
        }

        .disabledColor {
          border: 1px solid #DDDDDD;
          color: #111111;
          background-color: #BBBBBB;
        }
      }
    }

    .lastItem {
      margin-bottom: 30px;
    }

    .fzr-box {
      padding: 0;
    }

    &/deep/ .ant-input {
      color: #111;
    }
  }
</style>
