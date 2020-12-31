<template>
  <div class="map-box">
    <div class="amap-page-container">
      <div class="searchInputStyle">
        <a-input-search
          placeholder="请输入小区名"
          v-model="form.communityName"
          class="input-with-select"
          @compositionstart.native="cpLock=false"
          @compositionend.native="cpLock=true"
          @input.native="searchCommunity" />
        <div class="blocks" v-show="showBlock">
          <ul>
            <li
              v-for="(community,index) in communities"
              :key="index"
              @click="chooseCommunity(community)"
              style="cursor: pointer;">
              <i class="el-icon-search"></i>
              <span>{{ community.name }}</span>
              <span style="margin-left:10px;color:#838383;font-size:13px">{{ community.address }}</span>
            </li>
          </ul>
        </div>
      </div>
      <el-amap
        ref="map"
        vid="amapDemo"
        :plugin="plugin"
        :center="mapCenter"
        :zoom="mapZoom"
        @zoomend="zoomEnd"
        class="amap-demo"
        :events="events">
        <el-amap-marker
          v-for="(marker, index) in markers"
          :key="index"
          :position="marker.position"
          :events="marker.events"
          :visible="marker.visible"
          :animation="marker.animation"
          :draggable="marker.draggable"
          :vid="index"></el-amap-marker>
      </el-amap>
    </div>
    <div class="modifyStyle clearfix">
      <div style="width: calc(50%);" class="f-fl clearfix">
        <label-item title="" class="modifyAreaStyle f-fl" :mustFill="true">
          <div class="select-prefix">
            <span :class="canChange==false?'must-color':''">*</span>
            区域
          </div>
          <a-select
            v-model="form.area"
            placeholder
            class="f-fl padding-left160"
            @change="chooseArea"
            :disabled="canChange">
            <a-select-option v-for="(area,index) in areas" :key="index" :value="area.name" :label="area.name">
              {{ area.name }}</a-select-option>
          </a-select>
        </label-item>
        <label-item title="" class="modifyTownStyle f-fl">
          <div class="select-prefix">
            商圈
          </div>
          <a-select
            v-model="form.town"
            placeholder
            class="f-fl padding-left160"
            @change="chooseTown"
            :disabled="canChange">
            <a-select-option v-for="(town,index) in towns" :key="index" :value="town.name" :label="town.name">
              {{ town.name }}</a-select-option>
          </a-select>
        </label-item>
      </div>
      <div style="width: calc(50%)" class="f-fl clearfix">
        <label-item title="" class="modifyAddressStyle f-fl" :mustFill="true">
          <div class="select-prefix">
            <span :class="canChange==false?'must-color':''">*</span>
            地址
          </div>
          <a-input v-model="form.address" placeholder class="house-input" :disabled="canChange">
          </a-input>
        </label-item>
        <div class="modifyButtonStyle f-fl">
          <span class="correct" @click="canChange=false" style="cursor: pointer;">纠错</span>
        </div>
      </div>
    </div>
    <div class="clearfix" style="margin:0;">
      <a-button class="f-fr save-contract" type="warning" @click="handleSave" :loading="saveLoading">保存</a-button>
      <a-button class="f-fr quxiao" style="margin-right:20px;" @click="handleClose" type="warning">取消</a-button>
    </div>
  </div>
</template>

<script src="https://webapi.amap.com/maps?v=1.4.13&key=b21b9f5764e1fe30480d5d0f1fdac12a"></script>
<script>
// import {
//   getAreaListByCityId,
//   getTownListByAreaId,
//   insertCommunity
// } from '@/api/public'
export default {
  props: {
    cityId: {
      type: String
    },
    cityName: {
      type: String
    },
    cityPoint: {
      type: Array,
    },
  } /* 通过props接收父组件传递过来的数据 */ ,
  data: function () {
    var me = this
    return {
      cpLock: true,
      showBlock: false,
      events: {
        init: (o) => {
          o.setCity(me.cityName, result => {
            if (result && result.length > 0) {
              me.mapCenter = result
            }
          })
        },
      },
      plugin: [{
        pName: 'ToolBar',
        position: 'RB',
      }],
      mapCenter: [116.404, 39.915],
      mapZoom: 12,
      areas: [],
      communities: [],
      towns: {},
      markers: [],
      canChange: true,
      form: {
        communityName: '',
        communityId: '',
        address: '',
        name: '',
        region: '',
        area: '',
        areaId: '', // 区域id
        town: '',
        townId: '' // 商圈id
      },
      saveLoading: false,
    }
  },
  methods: {
    searchCommunity() {
      if (!this.form.communityName) {
        this.communities = []
      }
      this.showBlock = true
      let cityName = this.cityName
      let keywords = this.form.communityName
      let _this = this
      AMap.plugin('AMap.Autocomplete', function () {
        // 实例化Autocomplete
        var autoOptions = {
          city: cityName,
        }
        var autoComplete = new AMap.Autocomplete(autoOptions)
        autoComplete.search(keywords, function (status, result) {
          // 搜索成功时，result即是对应的匹配数据
          if (result.info === 'OK') {
            let communities = []
            if (result.tips && result.tips.length > 0) {
              result.tips.forEach((item) => {
                if (item.address && item.address.length > 0) {
                  communities.push(item)
                }
              })
            }
            _this.communities = communities
          } else {
            _this.communities = []
          }
        })
      })
    },
    chooseCommunity(community) {
      this.mapZoom = 15
      this.showBlock = false
      this.form.address = community.address
      this.form.communityName = community.name
      let point = [community.location.lng, community.location.lat]
      this.mapCenter = point
      this.getPoint(point)
      this.getLocation(point)
    },
    // 获取当前位置
    getLocation(position) {
      let _this = this
      let geocoder = null
      AMap.service('AMap.Geocoder', function () { //回调函数
        //实例化Geocoder
        geocoder = new AMap.Geocoder({
          city: '010' //城市，默认：“全国”
        })
      })
      if (!geocoder) {
        return
      }
      //逆地理编码
      geocoder.getAddress(position, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
          //获得了有效的地址信息:
          let districtArea = result.regeocode.addressComponent.district
          if (districtArea && districtArea.length > 2) {
            districtArea = districtArea.substr(0, districtArea.length - 1)
          }
          if (
            JSON.stringify(_this.areas).indexOf(districtArea) !=
            -1
          ) {

            _this.form.area = districtArea
            _this.chooseArea()
          }
          // 商圈
          let businessAreas = result.regeocode.addressComponent.businessAreas
          let areasName = ''
          if (businessAreas && businessAreas.length > 0) {
            areasName = businessAreas[0].name
          }
          setTimeout(() => {
            if (
              JSON.stringify(_this.towns).indexOf(areasName) != -1
            ) {
              _this.chooseTown(areasName)
            }
          }, 300)
        } else {
          //获取地址失败
        }
      })
    },
    handleClose() {
      this.$emit('close')
    },
    handleSave() {
      this.saveLoading = true
      this.clickSave = true
      if (!this.form.areaId) {
        this.$message.warning('请选择区域！')
        this.saveLoading = false
        return
      }
      if (!this.form.address) {
        this.$message.warning('请输入地址！')
        this.saveLoading = false
        return
      }
      var sendData = {
        address: '',
        areaId: '',
        cityId: '',
        lat: '',
        lng: '',
        name: '',
        townId: ''
      }
      sendData.address = this.form.address
      sendData.cityId = this.cityId
      sendData.areaId = this.form.areaId
      sendData.name = this.form.communityName
      sendData.lng = this.mapCenter[0]
      sendData.lat = this.mapCenter[1]
      sendData.townId = this.form.townId
      //坐标来源（1：百度；2：高德）
      sendData.coordinateSource = 2
      // insertCommunity(sendData).then(res => {
      //   if (!res) {
      //     this.saveLoading = false
      //   }
      //   if (res.code === 200) {
      //     this.$message.info('添加成功')
      //     this.form.communityId = res.data
      //     this.$emit('mapForm', this.form)
      //     this.handleClose()
      //   } else {
      //     this.$message.warn('添加失败')
      //   }
      //   this.saveLoading = false
      // })
    },
    chooseArea() {
      // 选择区域
      if (this.areas.length > 0) {
        for (var i = 0; i < this.areas.length; i++) {
          if (this.areas[i].name && this.form.area && (this.areas[i].name.startsWith(this.form.area) || this.form.area.startsWith(this.areas[i].name))) {
            this.form.areaId = this.areas[i].id
          }
        }
      }
      // getTownListByAreaId(this.form.areaId).then(res => {
      //   this.towns = res.data
      // })
    },
    chooseTown(val) {
      // 选择商圈
      if (this.towns.length > 0) {
        for (var i = 0; i < this.towns.length; i++) {
          if (val && this.towns[i].name === val) {
            this.form.town = val
            this.form.townId = this.towns[i].id
          }
          if (this.towns[i].name === this.form.town) {
            this.form.townId = this.towns[i].id
          }
        }
      }
    },
    zoomEnd(e) {
      // 获取地图的缩放级别
      this.mapZoom = e.target.getZoom()
    },
    getPoint(point) {
      this.markers = []
      this.mapCenter = point
      let obj = {
        animation: 'AMAP_ANIMATION_BOUNCE',
        draggable: true,
        position: point,
        visible: true,
        events: {
          dragend: (e) => {
            obj.position = [e.lnglat.lng, e.lnglat.lat]
            this.mapCenter = obj.position
          }
        },
      }
      this.markers.push(obj)
    },
    getAreaList() {
      // getAreaListByCityId(this.cityId).then(res => {
      //   // 根据城市id获取区域列表
      //   this.areas = res.data
      // })
    },
  },
  created() {
    if (this.cityPoint && this.cityPoint.length > 0) {
      //存在点，防止空
      if (this.cityPoint[0]) {
        this.getPoint(this.cityPoint)
      }
    }
    this.getAreaList()
  },
  mounted() {
    this.$nextTick(function () {})
  }
}
</script>

<style lang="less" scoped>
.map-box {
  padding: 14px 14px 0 14px;
  height: calc(100vh - 100px);

  .amap-demo {
    width: 100%;
    height: calc(100vh - 260px);
  }

  /deep/ .amap-toolbar {
    right: 25px !important;
  }

  .search-box {
    position: absolute;
    top: 15px;
    left: 20px;
  }

  /deep/ .el-vue-search-box-container {
    width: 932px;
    border-radius: 30px;
  }

  /deep/ .search-btn {
    color: #0a87f8;
    width: 70px !important;
  }

  .amap-page-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 260px);

    .searchInputStyle {
      position: absolute;
      left: 34px;
      top: 34px;
      z-index: 99;
      width: calc(100% - 128px);

      .input-with-select {
        width: calc(100%);
        height: 34px;

        & /deep/ .ant-input {
          border-radius: 20px;
        }
      }

      .blocks {
        // height: 360px;
        width: 50%;
        border-radius: 3px;
        border: 1px solid rgba(226, 226, 226, 1);
        position: absolute;
        left: 10px;
        top: 40px;
        z-index: 100;
        background-color: #fff;
      }

      .blocks ul {
        max-height: 360px;
        overflow-y: auto;
      }

      .blocks li {
        height: 34px;
        line-height: 34px;
        padding-left: 30px;
        padding-right: 20px;
        overflow: hidden;
        position: relative;
      }

      .blocks li:hover {
        background-color: #fdf5e3;
      }

      .blocks .el-icon-search {
        position: absolute;
        left: 6px;
        top: 10px;
        font-size: 14px;
        font-weight: 900;
      }
    }
  }

  .modifyStyle {
    width: 100%;
    padding: 20px 0 30px 0;

    .modifyAreaStyle {
      position: relative;
      margin-right: 20px;
      width: calc(50% - 20px);

      .select-prefix {
        position: absolute;
        left: 10px;
        top: 8px;
        width: 50px;
        z-index: 99;
        color: #c0c4cc;

        .must-color {
          color: red;
        }
      }
    }

    .modifyTownStyle {
      position: relative;
      margin-right: 20px;
      width: calc(50% - 20px);

      .select-prefix {
        position: absolute;
        left: 10px;
        top: 8px;
        width: 50px;
        z-index: 99;
        color: #c0c4cc;
      }
    }

    .modifyAddressStyle {
      width: calc(100% - 90px);
      margin-right: 20px;
      position: relative;

      .select-prefix {
        position: absolute;
        left: 10px;
        top: 8px;
        width: 50px;
        z-index: 99;
        color: #c0c4cc;

        .must-color {
          color: red;
        }
      }
    }

    .modifyButtonStyle {
      width: 66px;
      height: 34px;
      line-height: 34px;
      background-color: fade(#0A87F8, 10%);
      text-align: center;

      .correct {
        color: #0A87F8;
      }
    }

    /deep/ .ant-select-selection--single {
      height: 34px;
      line-height: 34px;
    }

    /deep/ .ant-input {
      height: 34px;
      line-height: 34px;
      padding-left: 60px;
      border: 1px solid #d9d9d9;
    }

    /deep/ .ant-select-selection {
      border: 1px solid #d9d9d9;
    }

    /deep/ .ant-select-selection__rendered {
      height: 34px;
      line-height: 34px;
      padding-left: 50px;
    }

    .padding-left160 {
      width: 100%;
    }
  }

  .save-contract {
    width: 120px;
    height: 40px;
    background: rgba(10, 135, 248, 1);
    border-radius: 5px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 40px;
  }

  .quxiao {
    width: 120px;
    height: 40px;
    border-radius: 5px;
  }
}
</style>
