<template>
  <div id="addWholeHouse" class="add-share-house">
    <label-item title="小区地址" border>
      <div class="u-bottom-border address">
        <a-select
          style="min-width: 100px"
          v-model="houseData.cityId"
          @change="selectCity"
          :showSearch="true"
          :filterOption="(inputValue,option)=>filterOption(inputValue,option)">
          <a-select-option :value="item.id" :key="item.id" v-for="(item) in cityList">{{ item.name }}</a-select-option>
        </a-select>
        <a-select
          showSearch
          placeholder="请输入小区地址"
          labelInValue
          :class="{ 'must-fill-border': mustFillBorder }"
          style="width: 100%;"
          :defaultActiveFirstOption="false"
          :showArrow="false"
          :filterOption="false"
          @change="getCommunity"
          @search="selectCommunity"
          @focus="focusCommunity"
          @blur="isEmpty"
          :value="communityName?{label:communityName}:undefined">
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu" />
            <a-divider style="margin: 4px 0;" />
            <div
              style="padding: 4px 8px 8px 8px;color: #0A87F8; cursor: pointer;"
              @mousedown="e => e.preventDefault()"
              @click="handleMap">
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
              <a-icon style="margin-right: 4px;vertical-align: middle;" type="environment" />
              {{ item.address }}
            </p>
          </a-select-option>
        </a-select>
        <span class="tips-must-fill" v-show="mustFillBorder">请输入小区地址</span>
      </div>
    </label-item>

    <label-item title="小区信息" border>
      <div class="village-info u-bottom-border">
        <label-item title="用水" :mustFill="true">
          <a-select v-model="houseData.waterType" style="width: 100%">
            <a-select-option :value="1">民水</a-select-option>
            <a-select-option :value="2">商业用水</a-select-option>
          </a-select>
        </label-item>
        <label-item title="用电" :mustFill="true">
          <a-select v-model="houseData.electricityType" style="width: 100%">
            <a-select-option :value="1">民电</a-select-option>
            <a-select-option :value="2">商业用电</a-select-option>
          </a-select>
        </label-item>
        <label-item title="供暖信息" :mustFill="true">
          <a-select v-model="houseData.heatingType" style="width: 100%">
            <a-select-option :value="0">未知</a-select-option>
            <a-select-option :value="1">自采暖</a-select-option>
            <a-select-option :value="2">集中供暖</a-select-option>
          </a-select>
        </label-item>
        <div style="margin-top: 28px">
          <a-checkbox v-model="houseData.isHaveElevator" @change="onChangeElevator">有电梯</a-checkbox>
          <a-checkbox v-model="houseData.gasType" @change="onChangeGasType">有燃气</a-checkbox>
        </div>
      </div>
    </label-item>
    <label-item title="房源信息" border>
      <!-- <div slot="title" class="f-ftc-blue title-opt" @click="fastSet">
        <span>快捷设置房源信息</span>
        <a-icon type="setting"></a-icon>
      </div> -->
      <div class="house-list">
        <div class="house-item">
          <div class="house-detail">
            <div class="house-title">
              <div style="max-width: 50px">房源编号</div>
              <div style="max-width: 40px">座/栋<span class="must-fill">*</span></div>
              <div style="max-width: 40px">单元</div>
              <div style="max-width: 50px">房间号<span class="must-fill">*</span></div>
              <div style="max-width: 60px">所在楼层<span class="must-fill">*</span></div>
              <div style="max-width: 60px">总楼层数<span class="must-fill">*</span></div>
              <div style="max-width: 30px">室<span class="must-fill">*</span></div>
              <div style="max-width: 30px">厅<span class="must-fill">*</span></div>
              <div style="max-width: 30px">厨<span class="must-fill">*</span></div>
              <div style="max-width: 30px">卫<span class="must-fill">*</span></div>
              <div style="max-width: 84px">朝向<span class="must-fill">*</span></div>
              <div style="max-width: 60px">面积<span class="must-fill">*</span></div>
              <div style="max-width: 90px;">装修类型<span class="must-fill">*</span></div>
              <div style="max-width: 60px">出租价格<span class="must-fill">*</span></div>
              <div style="max-width: 80px">是否可短租</div>
              <div style="max-width: 60px">房源特色</div>
              <div style="max-width: 60px">房源配置</div>
              <div style="max-width: 90px">房源标题/描述</div>
              <div style="max-width: 72px">房源图片</div>
              <div>更多信息</div>
              <div style="max-width: 40px">操作</div>
            </div>
            <div
              class="house-data u-no-border "
              v-for="(item,index) in houseData.houseWholeInfoAddFormList"
              :key="index">
              <div style="max-width: 50px">
                <a-input v-model="item.houseAlias" placeholder="请输入" />
              </div>
              <div style="max-width: 40px">
                <a-input v-mustFill:[clickSave] v-model="item.buildingNo" placeholder="必填" />
              </div>
              <div style="max-width: 40px">
                <a-input v-model="item.unit" placeholder="请输入" />
              </div>
              <div style="max-width: 50px">
                <a-input v-mustFill:[clickSave] v-model="item.doorplate" placeholder="必填" />
              </div>
              <div style="max-width: 60px">
                <a-input
                  v-mustFill:[clickSave]
                  v-model="item.currentFloor"
                  v-validate="'naturalNum|min(1)|max(99)'"
                  placeholder="必填" />
              </div>
              <div style="max-width: 60px">
                <a-input
                  v-mustFill:[clickSave]
                  v-model="item.totalFloor"
                  v-validate="'naturalNum|min(1)|max(99)'"
                  placeholder="必填" />
              </div>
              <div style="max-width: 30px">
                <a-input v-mustFill:[clickSave] v-model="item.room" />
              </div>
              <div style="max-width: 30px">
                <a-input v-mustFill:[clickSave] v-model="item.livingRoom" />
              </div>
              <div style="max-width: 30px">
                <a-input v-mustFill:[clickSave] v-model="item.kitchen" />
              </div>
              <div style="max-width: 30px;">
                <a-input v-mustFill:[clickSave] v-model="item.toilet" />
              </div>
              <div
                style="max-width: 84px"
                :class="{'select-border': houseSelectBorder==index && childSelectBorder == -1 && selectBorder=='orientation'}">
                <a-select
                  style="width: 100%;padding-left: 10px;box-sizing: border-box"
                  v-model="item.orientation"
                  @dropdownVisibleChange="changeSelect(index,-1,'orientation')">
                  <a-select-option :value="1">东</a-select-option>
                  <a-select-option :value="2">南</a-select-option>
                  <a-select-option :value="3">西</a-select-option>
                  <a-select-option :value="4">北</a-select-option>
                  <a-select-option :value="5">南北</a-select-option>
                </a-select>
              </div>
              <div style="position: relative;max-width: 60px">
                <a-input v-mustFill:[clickSave] v-model="item.houseArea" v-validate="'area'" placeholder="必填" /><span
                  style="position: absolute;right: 2px">㎡</span>
              </div>
              <div
                style="max-width: 90px"
                :class="{'select-border': houseSelectBorder==index && childSelectBorder == -1 && selectBorder=='decorationType'}">
                <a-select
                  style="width: 100%;padding-left: 10px;box-sizing: border-box"
                  v-model="item.decorationType"
                  @dropdownVisibleChange="changeSelect(index,-1,'decorationType')">
                  <a-select-option :value="2">精装</a-select-option>
                  <a-select-option :value="4">毛坯</a-select-option>
                  <a-select-option :value="3">简装</a-select-option>
                  <a-select-option :value="1">豪华装</a-select-option>
                </a-select>
              </div>
              <div style="max-width: 60px;">
                <a-input v-mustFill:[clickSave] v-validate="'moneyNoDot'" v-model="item.actualPrice" placeholder="必填" />
              </div>
              <div style="max-width: 80px" class="isShortRentStyle">
                <a-checkbox @change="e=>{item.isShortRent = e.target.checked ? 1 : 0}">可短租</a-checkbox>
              </div>
              <div style="max-width: 60px" @click="showTagConfigModal(index)">
                <a-popover placement="bottomRight" v-show="item.tagList.length">
                  <template slot="content">
                    <label-item title="特色">
                      <p style="max-width: 324px;margin-top: 10px">
                        <span class="houseAlias" v-for="(val,i) in item.tagList" :key="i">{{ val }}</span>
                      </p>
                    </label-item>
                  </template>
                  <p class="popover">
                    <span>已配置</span>
                    <a-icon type="edit"></a-icon>
                  </p>
                </a-popover>
                <p class="popover" v-show="item.tagList.length==0">
                  <span>暂无</span>
                  <a-icon type="edit"></a-icon>
                </p>
              </div>
              <div style="max-width: 60px" @click="showRoomConfigModal(index)">
                <a-popover placement="bottomRight" v-show="item.roomGoodsList.length">
                  <template slot="content">
                    <label-item title="配置">
                      <p style="max-width: 324px;margin-top: 10px">
                        <span class="houseAlias" v-for="(val,i) in item.roomGoodsList" :key="i">
                          {{ val.name }}{{ configRelationFlag?' x ' + val.quantity:'' }}
                        </span>
                      </p>
                    </label-item>
                  </template>
                  <p class="popover">
                    <span>已配置</span>
                    <a-icon type="edit"></a-icon>
                  </p>
                </a-popover>
                <p class="popover" v-show="item.roomGoodsList.length==0">
                  <span>暂无</span>
                  <a-icon type="edit"></a-icon>
                </p>
              </div>
              <div style="max-width: 90px" @click="showRoomTitleModal(index)">
                <a-popover placement="bottomRight" v-show="item.title.length||item.promotionDesc.length">
                  <template slot="content">
                    <div style="max-width: 324px; ">
                      <label-item title="房源标题">
                        <p style="margin-top: 10px">
                          <span>{{ item.title?item.title:'-' }}</span>
                        </p>
                      </label-item>
                      <label-item title="房源标题">
                        <p style="margin-top: 10px">
                          <span>{{ item.promotionDesc?item.promotionDesc:'-' }}</span>
                        </p>
                      </label-item>
                    </div>
                  </template>
                  <p class="popover">
                    <span>已填写</span>
                    <a-icon type="edit"></a-icon>
                  </p>
                </a-popover>
                <p class="popover" v-show="item.title.length==0&&item.promotionDesc.length==0">
                  <span>请输入</span>
                  <a-icon type="edit"></a-icon>
                </p>
              </div>
              <div style="max-width: 72px" @click="showPic(item.roomPicObjList,index)">
                <a-popover placement="bottomRight" v-show="item.roomPicObjList.length">
                  <template slot="content">
                    <label-item title="公区图片">
                      <ul class="pic-list">
                        <li v-for="(val,i) in item.roomPicObjList" :key="i">
                          <div v-if="(val.fileExt == 'jpg' || val.fileExt == 'png' || val.fileExt == 'jpeg')">
                            <img :src="val.origin" />
                          </div>
                          <div v-if="(val.fileExt == 'mp4' || val.fileExt == 'avi' || val.fileExt == 'mov')">
                            <video :src="val.origin" controls="controls"></video>
                          </div>
                          <span
                            v-if="(val.fileExt == 'jpg' || val.fileExt == 'png' || val.fileExt == 'jpeg')"
                            style="width: auto;padding: 2px 10px;margin-left: 6px">{{ val.fileOriginName }}</span>
                        </li>
                      </ul>
                    </label-item>
                  </template>
                  <p class="popover">
                    <span> {{ item.roomPicObjList.length == 0 ? '暂无图片' : `已上传${item.roomPicObjList.length}张` }}</span>
                    <a-icon type="edit"></a-icon>
                  </p>
                </a-popover>
                <p class="popover" v-show="item.roomPicObjList.length==0">
                  <span>暂无图片</span>
                  <a-icon type="edit"></a-icon>
                </p>
              </div>
              <div @click="showMoreModal(index)">
                <a-popover
                  placement="bottomRight"
                  v-show="item.vrUrl||item.checkCode||(item.lableList&&item.lableList.length>0)||item.comment">
                  <template slot="content">
                    <div style="width: 300px;" class="showMoreModalStyle">
                      <label-item title="VR看房地址">
                        <span>{{ item.vrUrl?item.vrUrl:'-' }}</span>
                      </label-item>
                      <label-item title="房源核验码" style="margin-top: 12px;">
                        <span>{{ item.checkCode?item.checkCode:'-' }}</span>
                      </label-item>
                      <label-item title="房源标签" style="margin-top: 12px;">
                        <div class="clearfix" v-if="item.lableList&&item.lableList.length>0">
                          <div
                            v-for="(itemTemp,index3) in item.lableList"
                            :key="index3"
                            class="selectDemandLabelItem f-fl clearfix"
                            style="margin:0 5px 5px 0;">
                            <div>{{ itemTemp }}</div>
                          </div>
                        </div>
                        <div v-else>-</div>
                      </label-item>
                      <label-item title="备注" style="margin-top: 7px;">
                        <span v-if="!item.comment">-</span>
                        <span v-else>
                          <a-textarea v-model="item.comment" maxlength="500" autosize /></span>
                      </label-item>
                    </div>
                  </template>
                  <p class="popover">
                    <span>已设置</span>
                    <a-icon type="edit"></a-icon>
                  </p>
                </a-popover>
                <p
                  class="popover"
                  v-show="(item.lableList&&item.lableList.length==0)&&!item.checkCode&&!item.comment&&!item.vrUrl">
                  <span>暂未设置</span>
                  <a-icon type="edit"></a-icon>
                </p>
              </div>
              <div style="max-width: 40px">
                <a-icon @click="deleteHouse(index)" class="delete-icon" type="delete"></a-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </label-item>
    <div class="continue-add">
      <p @click="addHouse">已添加<span>{{ houseData.houseWholeInfoAddFormList.length }}</span>套 <span class="add">继续添加</span> </p>
    </div>
    <label-item title="所属门店(部门)/维护人" border>
      <div class="clearfix">
        <label-item title="所属门店(部门)" style="" :mustFill="true" class="u-bottom-border f-fl">
          <a-select style="width: 160px;">
            <a-select-option value="Fixed">固定</a-select-option>
            <a-select-option value="Fluid">流式</a-select-option>
          </a-select>
        </label-item>
        <label-item title="维护人" class="u-bottom-border f-fl">
          <a-select style="width: 160px;">
            <a-select-option value="Fixed">固定</a-select-option>
            <a-select-option value="Fluid">流式</a-select-option>
          </a-select>
        </label-item>
      </div>
    </label-item>
    <a-modal
      title="编辑房源特色"
      centered
      v-model="showTagConfigDialog"
      class="ownModalBorder slim"
      @ok="saveTagConfig"
      okText="确认"
      cancelText="取消">
      <label-item style="margin: 0 20px 20px 20px" title="房源特色" leftLine border class="u-bottom-border">
        <a-checkbox-group class="public-config" v-model="currentTag" @change="value => publicConfigChange(value)">
          <a-checkbox :value="item.id" v-for="(item) in houseTagConfig" :key="item.id">{{ item.name }}</a-checkbox>
        </a-checkbox-group>
      </label-item>
    </a-modal>
    <a-modal
      title="编辑房源标题/描述"
      centered
      v-model="showTitleDialog"
      class="ownModalBorder slim"
      @ok="saveTitle"
      okText="确认"
      cancelText="取消">
      <label-item
        style="margin: 0 20px 20px 20px"
        title="房源标题"
        leftLine
        border
        class="u-bottom-border"
        :valLength="textAreaVal_title.length"
        :maxSize="30">
        <a-textarea autosize v-model="textAreaVal_title" maxlength="30" placeholder="请输入" />
      </label-item>
      <label-item
        style="margin: 0 20px 20px 20px"
        title="房源描述"
        leftLine
        border
        class="u-bottom-border"
        :valLength="textAreaVal_desc.length"
        :maxSize="500">
        <a-textarea
          :autosize="{ minRows: 1, maxRows: 5 }"
          v-model="textAreaVal_desc"
          maxlength="500"
          placeholder="请输入" />
      </label-item>
    </a-modal>
    <!-- 房源更多信息 -->
    <a-modal
      title="更多信息"
      centered
      v-model="showMoreDialog"
      class="ownModalBorder slim"
      style="position: relative"
      @ok="saveShowMore"
      okText="确认"
      cancelText="取消">
      <div class="moreStyle">
        <label-item
          style="margin: 0 20px 20px 20px"
          title="VR看房地址"
          border
          class="u-bottom-border"
          :valLength="currentMoreInfo.vrUrl.length"
          :maxSize="100">
          <a-textarea autosize v-model="currentMoreInfo.vrUrl" maxlength="100" placeholder="请输入" />
        </label-item>
        <label-item
          style="margin: 0 20px 20px 20px"
          title="房源核验码"
          border
          class="u-bottom-border"
          :valLength="currentMoreInfo.checkCode.length"
          :maxSize="30">
          <a-input v-model="currentMoreInfo.checkCode" maxlength="30" placeholder="请输入" />
          <div style="position: absolute;top: 0px;left:84px;">
            <div style="height: 50px;line-height: 50px;">
              <span style="font-size: 12px;">(仅内部可见)</span>
            </div>
          </div>
          <div class="smallIconStyle" style="position: absolute;top: 80px;color: #FFA036;font-size: 12px">
            <!-- <a-icon type="exclamation-circle" style="color: #FFA036;margin-right: 4px;" /> -->
            <span>武汉市的房源上架至"58公寓馆平台"需要填写</span>
          </div>
          <div style="position: absolute;right: 0px;top:15px;" class="realStyle">
            <!-- <icon-font type="iconheyanzhenjia" /> -->
          </div>
        </label-item>
        <label-item style="margin: 0 20px 20px 20px" title="房源标签" border class="u-bottom-border clearfix">
          <div class="clearfix" style="border-bottom: 1px solid #DDDDDD;">
            <div
              v-for="(itemTemp,index) in currentMoreInfo.lableList"
              :key="index"
              class="itemLableStyle f-fl clearfix"
              style="margin-top: 5px;">
              <div class="f-fl">{{ itemTemp }}</div>
              <a-icon type="close" style="color: #FB4246;margin-top: 5px;" class="cursor f-fl" @click="removeHouseLableList(index)"></a-icon>
              <!-- <icon-font
                style="color: #FB4246;margin-top: 5px;"
                class="cursor f-fl"
                @click="removeHouseLableList(index)"
                type="iconyumengtubiao_guanbi-" /> -->
            </div>
            <label-item class="f-fl u-no-border" v-if="currentMoreInfo.lableList.length<10">
              <a-input
                v-model="houseLableInput"
                style="text-align: left;"
                maxLength="10"
                @click="currentClickIndex=1"
                :placeholder="currentMoreInfo.lableList.length==0?'可输入补充标签，回车添加':'继续输入回车添加'"
                @keyup.enter="value=>addHouseLabel(value)" />
            </label-item>
            <div style="position: absolute;top: 6px;left:68px;">
              <div style="height: 50px;line-height: 50px;">
                <span style="font-size: 12px;">(仅内部可见)</span>
              </div>
            </div>
          </div>
        </label-item>
        <label-item
          style="margin: 0 20px 27px 20px;position: relative"
          title="备注"
          border
          class="u-bottom-border"
          :valLength="currentMoreInfo.comment.length"
          :maxSize="500">
          <a-textarea autosize v-model="currentMoreInfo.comment" maxlength="500" placeholder="请输入" />
          <div style="position: absolute;top: 0px;left:36px;">
            <div style="height: 50px;line-height: 50px;">
              <span style="font-size: 12px;">(仅内部可见)</span>
            </div>
          </div>
          <div
            class="poperLabelStyle2"
            v-if="currentClickIndex&&houseLableList.length>0"
            style="max-height: 200px;overflow-y: auto"
            @mouseenter="currentClickIndex=1"
            @mouseleave="currentClickIndex=undefined">
            <div style="width: 100%;font-size: 12px;color: #666666;line-height: 17px;margin: 0 0 2px 0;">常用标签</div>
            <div
              v-for="(itemTemp,index3) in houseLableList"
              :key="index3"
              @click.stop="changeLabelList(itemTemp)"
              class="selectDemandLabelItem cursor f-fl clearfix"
              style="margin:0 5px 5px 0;"
              :style="currentMoreInfo.lableList.indexOf(itemTemp)>-1?'':'background:#F4F4F4;'">
              <div class="f-fl">{{ itemTemp }}</div>
            </div>
          </div>
        </label-item>
      </div>
    </a-modal>
    <!-- <a-modal
      title="编辑房源图片"
      centered
      v-model="showPicDialog"
      width="588px"
      destroyOnClose
      class="ownModalBorder slim"
      @ok="savePic"
      okText="确认"
      cancelText="取消">
      <label-item
        style="margin: 0 20px 20px 20px;max-height: calc(100vh - 230px);overflow: auto;overflow-x: hidden"
        title="房源图片"
        leftLine
        border
        class="u-bottom-border">
        <house-video :picList="picList" ref="publicPic"></house-video>
      </label-item>
    </a-modal> -->
    <!-- 小区地图 -->
    <room-map ref="roomMap"></room-map>
    <!-- <a-modal
      title="添加小区"
      destroyOnClose
      centered
      :maskClosable="false"
      :footer="null"
      width="1000px"
      v-model="showMap"
      class="ownModalBorder slim"
      @close="showMap=false">
      <room-map
        @close="map_toggle_close"
        :cityId="houseData.cityId"
        :cityName="houseData.cityName"
        :cityPoint="cityPoint"
        @mapForm="getCommunityBymap"></room-map>
    </a-modal> -->
    <!-- 物品配置-不关联资产 -->
    <!-- <a-modal
      title="编辑房源配置"
      destroyOnClose
      centered
      :maskClosable="false"
      :footer="null"
      width="800px"
      v-model="editConfigDialog1"
      class="ownModalBorder slim"
      @close="editConfigDialog1=false">
      <config-default
        :fromType="fromType"
        :housePublicConfig="housePublicConfig"
        :currentConfig="currentConfig"
        @cancelSaveRoomConfig="cancelSaveRoomConfig"
        @saveRoomConfig="saveRoomConfig"></config-default>
    </a-modal> -->
    <!-- 物品配置-关联资产 -->
    <!-- <a-modal
      title="编辑房源配置"
      destroyOnClose
      centered
      :maskClosable="false"
      :footer="null"
      width="1000px"
      v-model="editConfigDialog2"
      class="ownModalBorder slim"
      @close="editConfigDialog2=false">
      <config-asset
        :fromType="fromType"
        :housePublicConfig="housePublicConfig"
        :currentConfig="currentConfig"
        @cancelSaveRoomConfig="cancelSaveRoomConfig"
        @saveRoomConfig="saveRoomConfig"></config-asset>
    </a-modal> -->
  </div>
</template>

<script>
// import { employeeUserInfo } from '@/api/enterprise'
// import DeptEmployeeTree from '@/components/DeptEmployeeTree'
// import StoreTree from '@/components/DeptEmployeeTree/store'
// import WholeHouseFastSet from './WholeHouseFastSet'
import roomMap from '../../modal/AddVillageMapModal'
// import * as PublicAPI from '@/api/public'
// import * as API from '@/api/wholeHouse'
// import { getListHouseLable } from '@/api/centralizedHouse'
// import HouseVideo from '@/components/OwnUpload/houseVideo'
// import { bizDecisionGet } from '@/api/decision'
// import ConfigDefault from './configDefault'
// import ConfigAsset from './configAsset'

export default {
  name: 'AddWholeHouse',
  components: {
    // WholeHouseFastSet,
    // DeptEmployeeTree,
    // StoreTree,
    roomMap,
    // HouseVideo,
    // ConfigDefault,
    // ConfigAsset,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  props: {
    addressObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      houseData: {
        cityId: '', // 城市id
        cityName: '',
        communityId: '', // 小区ID
        communityName: '',
        electricityType: 1, // 用电 - 0、未设置，1、民电，2、商业用电
        gasType: true, // 燃气 - 0、未设置，1、有，2、无
        heatingType: 1, // 供暖 - 0、未设置，1、自采暖，2、集中供暖
        houseBizMode: 1, // 房源经营模式- 1、包租，2、代理
        waterType: 1, // 用水 - 0、未设置，1、民水，2、商业用水
        isHaveElevator: true, // 是否有电梯【0否1是】
        maintainerId: '', // 维护人ID
        deptId: '', //部门id
        houseWholeInfoAddFormList: [ // 房源数据列表
          {
            actualPrice: '', // 出租价格（月租金）【单位分】
            buildingNo: '', // 楼号（座栋）
            currentFloor: '', // 所在楼层
            decorationType: 2, // 装修类型【枚举：1、豪华装，2、精装，3、简装，4、毛坯】
            doorplate: '', // 房间号
            houseAlias: '', // 房源编号
            houseArea: '', // 房间面积
            isShortRent: '', // 是否支持短租【0否1是】【民宿】
            kitchen: 1, // 厨房（几厨房）
            livingRoom: 1, // 客厅（几客厅）
            orientation: 2, // 朝向(1:东；2:南；3:西；4:北；5:南北)
            promotionDesc: '', // 描述
            room: 2, // 室（几室）
            roomGoodsList: [], // 物品ID集合
            roomPicIdList: [], // 房间图片ID列表
            roomPicObjList: [], // *房间图片对象列表包含物品的所有信息）*
            tagList: [], // 房间标签（特色）
            title: '', // 房源标题
            toilet: 1, // 卫生间（几卫生间）
            totalFloor: '', // 总楼层
            unit: '', // 单元
            lableList: [],
            checkCode: '',
            vrUrl: '',
            comment: ''
          }
        ]
      },
      cityList: [],
      communityList: [],
      mustFillBorder: false,
      searchCommunityVal: undefined,
      fastSetDialog: false,
      fastSetData: {
        roomConfig: [],
        tagConfig: [],
        tagConfigObj: [],
        title: '',
        desc: '',
        roomPic: []
      },
      clickSave: false,
      houseSelectBorder: 0,
      childSelectBorder: -1,
      selectBorder: '',
      currentConfig: [], //  当前选中的配置
      currentTag: [],
      showTagConfigDialog: false,
      houseTagConfig: [],
      houseTagConfigSize: 0, //初始特色长度
      housePublicConfig: [],
      currentSelectHouseIndex: '', //  当前选中的房源的index
      showRoomConfigDialog: false,
      showTitleDialog: false,
      showMoreDialog: false,
      textAreaVal_title: '',
      textAreaVal_desc: '',
      copyHouse: {},
      showPicDialog: false,
      picList: [],
      userInfo: {
        name: '',
        phone: '',
        empId: '',
        info: '',
        deptId: '',
        deptName: ''
      },
      showMap: false,
      searchAddressHaveValue: false,
      communityName: undefined,
      houseLableList: [],
      houseLableInput: '',
      currentMoreInfo: {
        vrUrl: '',
        checkCode: '',
        comment: '',
        lableList: []
      },
      currentClickIndex: undefined,
      cityPoint: [],
      configRelationFlag: false, //物品配置是否关联
      editConfigDialog1: false,
      editConfigDialog2: false,
      fromType: 'room'
    }
  },
  created() {
    this.getUserInfo()
    this.getCity()
    this.getDictionaryList()
    this.listHouseLable()
    const obj = this.houseData.houseWholeInfoAddFormList[0]
    this.copyHouse = Object.assign({}, obj)
    // 房态图中添加时需要回显地址
    this.houseData.cityId = this.addressObj.cityId
    this.houseData.communityId = this.addressObj.communityId
  },
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
    showMoreModal(index) {
      // this.showMoreDialog = true
      // this.currentSelectHouseIndex = index
      // this.currentClickIndex = undefined
      // const temp = []
      // this.houseData.houseWholeInfoAddFormList[index].lableList.forEach((item) => {
      //   temp.push(item)
      // })
      // this.currentMoreInfo = {
      //   vrUrl: this.houseData.houseWholeInfoAddFormList[index].vrUrl,
      //   checkCode: this.houseData.houseWholeInfoAddFormList[index].checkCode,
      //   lableList: temp,
      //   comment: this.houseData.houseWholeInfoAddFormList[index].comment
      // }
    },
    saveShowMore() {
      const index = this.currentSelectHouseIndex
      if (this.currentMoreInfo.vrUrl) {
        this.houseData.houseWholeInfoAddFormList[index].vrUrl = this.currentMoreInfo.vrUrl
      }
      if (this.currentMoreInfo.comment) {
        this.houseData.houseWholeInfoAddFormList[index].comment = this.currentMoreInfo.comment
      } else {
        this.houseData.houseWholeInfoAddFormList[index].comment = ''
      }
      if (this.currentMoreInfo.checkCode) {
        this.houseData.houseWholeInfoAddFormList[index].checkCode = this.currentMoreInfo.checkCode
      } else {
        this.houseData.houseWholeInfoAddFormList[index].checkCode = ''
      }
      if (this.currentMoreInfo.lableList && this.currentMoreInfo.lableList.length > 0) {
        this.houseData.houseWholeInfoAddFormList[index].lableList = this.currentMoreInfo.lableList
      } else {
        this.houseData.houseWholeInfoAddFormList[index].lableList = []
      }
      //还原
      this.currentMoreInfo = {
        vrUrl: '',
        checkCode: '',
        comment: '',
        lableList: []
      }
      this.houseLableInput = ''
      this.showMoreDialog = false
    },
    changeLabelList(itemTemp) {
      const pos = this.currentMoreInfo.lableList.indexOf(itemTemp)
      if (pos > -1) {
        this.currentMoreInfo.lableList.splice(pos, 1)
      } else {
        if (this.currentMoreInfo.lableList.length >= 10) {
          return
        }
        this.currentMoreInfo.lableList.push(itemTemp)
      }
    },
    addHouseLabel() {
      const value = this.houseLableInput
      if (value) {
        const pos = this.currentMoreInfo.lableList.indexOf(value)
        if (pos > -1) {
          //有了就不添加了
          this.$message.warning('该标签已存在，不可重复添加')
        } else {
          this.currentMoreInfo.lableList.push(value)
          this.houseLableInput = ''
        }
      }
    },
    removeHouseLableList(index) {
      this.currentMoreInfo.lableList.splice(index, 1)
    },
    listHouseLable() {
      // getListHouseLable().then(res => {
      //   if (res.code === '200') {
      //     this.houseLableList = res.data
      //   }
      // })
    },
    handleMap() {
      this.$refs.roomMap.show({ ...this.houseData, cityPoint: this.cityPoint })
    },
    getCommunityBymap(value) {
      this.houseData.communityId = value.communityId
      this.houseData.communityName = value.communityName
      this.communityName = value.communityName
      this.mustFillBorder = false
    },
    getUserInfo() {
      // employeeUserInfo().then(res => {
      //   this.userInfo.phone = res.data.phone
      //   this.userInfo.name = res.data.name
      //   this.userInfo.info = res.data.name
      //   this.userInfo.empId = res.data.empId
      //   this.userInfo.deptId = res.data.deptId
      //   this.userInfo.deptName = res.data.deptName
      //   this.houseData.maintainerId = res.data.empId
      //   this.houseData.deptId = res.data.deptId
      //   //根据所属部门id去取决策
      //   this.bizDecisionGet(res.data.deptId)
      // })
    },
    //获取决策配置
    bizDecisionGet(val) {
      // const paramter = {
      //   bizPoint: 'HOUSE_RULE',
      //   mark: 'HOUSE_STRONG_ASSOCIATION_ASSETS',
      //   module: 'HOUSE',
      //   deptId: val
      // }
      // bizDecisionGet(paramter).then(res => {
      //   if (res.data && res.data.onOff === 1) {
      //     this.configRelationFlag = true
      //   } else {
      //     this.configRelationFlag = false
      //   }
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
          this.communityName = ''
        }
      })
    },
    getCity() {
      // PublicAPI.getCityList().then(res => {
      //   this.cityList = res.data
      //   this.houseData.cityId = this.cityList[0].id
      //   this.houseData.cityName = this.cityList[0].name
      //   this.cityPoint = [this.cityList[0].lng, this.cityList[0].lat]
      // })
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
    onChangeElevator(e) {
      this.houseData.isHaveElevator = e.target.checked
    },
    onChangeGasType(e) {
      this.houseData.gasType = e.target.checked //  ? 1 : 2
    },
    fastSet() {
      this.fastSetDialog = true
    },
    saveFastSet() {
      this.fastSetDialog = false
      this.fastSetData = Object.assign({}, this.$refs.fastSet.fastSetDataConfig)
      if (this.configRelationFlag) {
        //强关联不变更配置
        this.fastSetData.roomConfig = []
      } else {
        const roomConfig = []
        this.$refs.fastSet.showPublicConfig.forEach((item) => {
          if (item.checked) {
            roomConfig.push(item)
          }
        })
        this.fastSetData.roomConfig = roomConfig
      }
      this.fastSetData.roomPic = [...this.$refs.fastSet.$refs.uploadRoomPicList.picsList]
      this.houseData.houseWholeInfoAddFormList.forEach((value) => {
        if (this.fastSetData.roomConfig.length > 0) {
          value.roomGoodsList = this.fastSetData.roomConfig
        }
        if (this.fastSetData.tagConfig.length > 0) {
          value.tagList = this.fastSetData.tagConfig
        }
        if (this.fastSetData.title) {
          value.title = this.fastSetData.title
        }
        if (this.fastSetData.desc) {
          value.promotionDesc = this.fastSetData.desc
        }
        if (this.fastSetData.roomPic.length > 0) {
          value.roomPicObjList = this.fastSetData.roomPic
          value.roomPicIdList = []
          this.fastSetData.roomPic.forEach((v) => {
            value.roomPicIdList.push(v.id)
          })
        }
      })
    },
    changeSelect(houseSelectBorder, childSelectBorder, selectBorder) {
      if (this.selectBorder !== selectBorder) {
        this.selectBorder = selectBorder
        this.houseSelectBorder = houseSelectBorder
        this.childSelectBorder = childSelectBorder
      } else {
        this.selectBorder = ''
      }
    },
    showTagConfigModal(index) {
      this.showTagConfigDialog = true
      this.currentSelectHouseIndex = index
      const temp = []
      this.houseTagConfig.forEach((value) => {
        this.houseData.houseWholeInfoAddFormList[index].tagList.forEach((val) => {
          if (value.name === val && val !== '####') {
            temp.push(value.id)
          }
        })
      })
      this.currentTag = temp
      if (this.currentTag.length === this.houseTagConfigSize) {
        this.currentTag.push('####')
      }
    },
    saveTagConfig() {
      const houseIndex = this.currentSelectHouseIndex
      this.showTagConfigDialog = false
      const tagList = []
      this.houseTagConfig.forEach((value) => {
        this.currentTag.forEach((val) => {
          if (value.id === val && val !== '####') {
            tagList.push(value.name)
          }
        })
      })
      this.houseData.houseWholeInfoAddFormList[houseIndex].tagList = tagList // 房源标签传给后台的是名称，不是ID
    },
    // 获取字典
    getDictionaryList() {
      // 特色
      // PublicAPI.getTagDictionary().then(res => {
      //   if (res.code === 200) {
      //     const tempData = res.data
      //     this.houseTagConfigSize = tempData.length
      //     const temp = {
      //       id: '####',
      //       name: '全选/取消',
      //       checked: false
      //     }
      //     this.houseTagConfig.push(temp)
      //     tempData.forEach((item) => {
      //       item.checked = false
      //       this.houseTagConfig.push(item)
      //     })
      //   }
      // })
      // // 公区配置、房间配置
      // const parameter = {
      //   houseId: ''
      // }
      // PublicAPI.getHouseConfig(parameter).then(res => {
      //   if (res.code === 200) {
      //     const tempData = res.data
      //     tempData.forEach((item) => {
      //       item.checked = false
      //       this.housePublicConfig.push(item)
      //     })
      //   }
      // })
    },
    publicConfigChange(checkedValues) {
      const pos = checkedValues.indexOf('####')
      if (pos > -1) {
        this.currentTag = []
        if (checkedValues.length >= this.houseTagConfigSize) {
          let cancelSelectAll = false
          //判断是否全选
          this.houseTagConfig.forEach((item) => {
            if (item.id === '####' && item.checked === false) {
              cancelSelectAll = true
            }
          })
          if (cancelSelectAll) {
            this.houseTagConfig.forEach((item) => {
              this.currentTag.push(item.id)
              item.checked = true
            })
            this.houseTagConfig.forEach((item) => {
              this.currentTag.push(item.id)
              item.checked = true
            })
          } else {
            this.houseTagConfig.forEach((item) => {
              const pos = checkedValues.indexOf(item.id)
              if (pos > -1 && item.id !== '####') {
                item.checked = true
                this.currentTag.push(item.id)
              }
              if (item.id === '####') {
                item.checked = false
              }
            })
          }
        } else {
          this.houseTagConfig.forEach((item) => {
            this.currentTag.push(item.id)
            item.checked = true
          })
        }
      } else {
        if (checkedValues.length === this.houseTagConfigSize) {
          //判断是全选，还是取消全选
          let cancelSelectAll = false
          this.houseTagConfig.forEach((item) => {
            if (item.id === '####' && item.checked === true) {
              cancelSelectAll = true
            }
          })
          if (cancelSelectAll) {
            this.currentTag = []
            this.houseTagConfig.forEach((item) => {
              item.checked = false
            })
          } else {
            this.currentTag.push('####')
            this.houseTagConfig.forEach((item) => {
              item.checked = true
            })
          }
        } else {
          this.currentTag = checkedValues
          this.houseTagConfig.forEach((item) => {
            const pos = this.currentTag.indexOf(item.id)
            if (pos > -1) {
              item.checked = true
            }
          })
        }
      }
    },
    showRoomConfigModal(houseIndex) {
      if (this.configRelationFlag) {
        this.editConfigDialog2 = true
      } else {
        this.editConfigDialog1 = true
      }
      this.currentSelectHouseIndex = houseIndex
      this.currentConfig = this.houseData.houseWholeInfoAddFormList[houseIndex].roomGoodsList
    },
    cancelSaveRoomConfig() {
      this.editConfigDialog1 = false
      this.editConfigDialog2 = false
    },
    saveRoomConfig(modifyConfig) {
      const houseIndex = this.currentSelectHouseIndex
      this.houseData.houseWholeInfoAddFormList[houseIndex].roomGoodsList = modifyConfig
      this.currentConfig = modifyConfig
      this.editConfigDialog1 = false
      this.editConfigDialog2 = false
    },
    showRoomTitleModal(houseIndex) {
      this.showTitleDialog = true
      this.currentSelectHouseIndex = houseIndex
      this.textAreaVal_title = this.houseData.houseWholeInfoAddFormList[houseIndex].title
      this.textAreaVal_desc = this.houseData.houseWholeInfoAddFormList[houseIndex].promotionDesc
    },
    saveTitle() {
      const houseIndex = this.currentSelectHouseIndex
      this.houseData.houseWholeInfoAddFormList[houseIndex].title = this.textAreaVal_title
      this.houseData.houseWholeInfoAddFormList[houseIndex].promotionDesc = this.textAreaVal_desc
      this.showTitleDialog = false
    },
    addHouse() {
      const obj = Object.assign({}, this.copyHouse)
      this.houseData.houseWholeInfoAddFormList.push(obj)
    },
    saveWholeHouse() {
      return new Promise((resolve, reject) => {
        if (!this.houseData.communityId) {
          this.mustFillBorder = true
          this.$message.warning('请输入小区地址！')
          reject()
          return
        } else {
          this.mustFillBorder = false
        }
        if (!this.houseData.deptId) {
          this.$message.warning('请选择所属门店(部门)！')
          reject()
          return
        }
        this.clickSave = true
        let mustKey = true
        const sendData = JSON.parse(JSON.stringify(this.houseData))
        sendData.houseWholeInfoAddFormList.forEach((val, i) => {
          if (val.buildingNo === '' ||
            val.doorplate === '' ||
            val.currentFloor === '' ||
            val.totalFloor === '' ||
            val.room === '' ||
            val.houseArea === '' ||
            val.livingRoom === '' ||
            val.kitchen === '' ||
            val.toilet === '' ||
            val.actualPrice === ''
          ) {
            this.$message.warning('请输入必填信息！')
            mustKey = false
            reject()
          } else {
            val.actualPrice = Math.round(val.actualPrice * 100)
          }
        })
        if (mustKey) {
          this.$emit('changeLoading', true)
          // API.addWholeHouse(sendData).then(res => {
          //   this.$emit('changeLoading', false)
          //   if (!res) {
          //     reject()
          //   }
          //   if (res.code === 200) {
          //     resolve()
          //   } else {
          //     this.$message.error('保存失败！')
          //     reject()
          //   }
          // }, () => {
          //   this.$emit('changeLoading', false)
          //   this.$message.error('保存失败！')
          //   reject()
          // })
        }
      })
    },
    deleteHouse(index) {
      this.houseData.houseWholeInfoAddFormList.splice(index, 1)
    },
    showPic(list, houseIndex) {
      this.showPicDialog = true
      this.currentSelectHouseIndex = houseIndex
      this.picList = []
      this.picList.push(...list)
      this.picList.forEach((item) => {
        item.bizId = item.id
        item.notRealDelete = true
      })
    },
    savePic() {
      const picList = [...this.$refs.publicPic.picsList]
      const houseIndex = this.currentSelectHouseIndex
      const list = this.houseData.houseWholeInfoAddFormList[houseIndex]
      list.roomPicObjList = picList
      list.roomPicIdList = []
      picList.forEach((val, i) => {
        list.roomPicIdList.push(val.id)
      })
      this.showPicDialog = false
    },
    selectDept(selectObj) {
      if (selectObj.type === 'dept') {
        this.houseData.deptId = selectObj.id
        this.userInfo.deptName = selectObj.name
        this.bizDecisionGet(selectObj.id)
      }
      if (!selectObj.type && !selectObj.name) {
        this.houseData.deptId = ''
        this.userInfo.deptName = ''
        this.configRelationFlag = false
      }
    },
    selectDeptEmp(selectObj) {
      if (selectObj.type === 'employee') {
        this.houseData.maintainerId = selectObj.id
        this.userInfo.info = selectObj.name
      }
      if (!selectObj.type && !selectObj.name) {
        this.houseData.maintainerId = ''
        this.userInfo.info = ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.add-share-house {
  padding: 0 20px 20px 20px;
  height: calc(100vh - 150px);
  overflow: auto;

  .title-opt {
    margin-left: 20px;
    font-size: 16px;
    cursor: pointer;
  }

  h3 {
    font-weight: 500;
    height: 44px;
    line-height: 44px;
  }

  &>div {
    margin-bottom: 20px;
  }

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

  .address {
    position: relative;
    display: flex;
    width: calc(50% - 15px);

    /deep/ .ant-select-selection-selected-value {
      span {
        color: rgba(0, 0, 0, 0.65) !important;
      }

      p {
        display: none;
      }
    }

    .must-fill-border {
      & /deep/ .ant-select-selection {
        border-bottom: 1px solid red;
      }
    }

    .tips-must-fill {
      position: absolute;
      left: 100px;
      bottom: -20px;
      color: red;
    }

    /deep/ .ant-select-dropdown--empty {
      display: none;
    }
  }

  .village-info {
    display: flex;

    .title {
      color: #777;
      font-size: 12px;
    }

    &>div {
      flex: 1;
      margin-right: 30px;
    }

    &>div:last-child {
      display: flex;
      align-items: center;
    }
  }

  .house-list {
    .house-item {
      margin-bottom: 20px;

      .delete-icon {
        color: red;
        font-size: 14px;
      }

      .house-detail {
        border-left: 1px solid #ddd;
        border-top: 1px solid #ddd;
        text-align: center;
        font-size: 12px;

        .house-title {
          display: flex;
          background-color: rgba(10,135,248,.1);

          &>div {
            flex: 1;
            height: 40px;
            line-height: 40px;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
          }

          .must-fill {
            color: #FB4246;
          }
        }

        .house-data {
          position: relative;
          display: flex;

          /deep/ .ant-select-selection-selected-value {
            padding-right: 2px;
          }

          &>div {
            flex: 1;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            background-color: #ffffff;

            .popover:hover {
              height: 39px;
              line-height: 38px;
              border: 1px solid #0a87f8;
              cursor: pointer;
            }
          }

          .pic-list {
            display: flex;
            flex-wrap: wrap;
            /*justify-content: space-around;*/
            max-width: 315px;
            margin-right: -5px;
            margin-bottom: 5px;

            /deep/ video {
              width: 98px;
              height: 68px;
            }

            li {
              position: relative;

              div {
                width: 100px;
                height: 68px;
                line-height: 68px;
                border: 1px solid #eeeeee;
                background-color: #f6f7f8;
                margin: 5px 5px 0 0;
                border-radius: 6px;
                text-align: center;
                overflow: hidden;

                img {
                  width: auto;
                  max-width: 100px;
                  height: auto;
                  max-height: 68px;
                  overflow: hidden;
                }
              }

              span {
                position: absolute;
                left: -10px;
                top: 3px;
                font-size: 12px;
                transform: scale(0.8);
                display: inline-block;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 5px 0px 5px 0px;
                color: #fff;
                max-width: 100px;
              }
            }
          }

          input {
            text-align: center;
            height: 100%;
          }

          input:focus {
            border: 1px solid #0a87f8  !important;
          }

          .select-border {
            border: 1px solid #0a87f8;
          }

          .options {

            i,
            span {
              display: inline-block;
              width: 50%;
              height: 39px;
              cursor: pointer;
            }

            i {
              line-height: 39px;
              font-size: 14px;
            }

            span {
              padding: 3px 4px;
              line-height: 18px;
              background-color: #DCEFFF;
              color: #0a87f8;
            }
          }

          .isShortRentStyle {
            /deep/ .ant-checkbox+span {
              padding-left: 4px;
              padding-right: 4px;
            }
          }
        }
      }

      .house-child {
        border: 1px solid #ddd;
        border-top: none;
        padding: 0 15px 15px 15px;
        background-color: #f6f7f8;

        h3 {
          font-size: 12px;

          p {
            color: #0a87f8;
          }
        }

        .house-title {
          background-color: #f6f7f8;
        }

        .add-child {
          font-size: 12px;
          cursor: pointer;

          span {
            margin-right: 6px;
          }

          i {
            font-size: 14px;
          }
        }
      }

    }

    .showMoreModalStyle {
      max-height: 400px;
      overflow-y: auto;

      /deep/ .label-item .title {
        font-size: 14px;
        color: #111111;
      }
    }
  }

  .continue-add {
    text-align: center;

    p {
      display: inline-block;
      padding: 4px 100px;
      border: 1px dashed #ddd;
      cursor: pointer;

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

  }

  &/deep/ .label-item .ant-select-selection__rendered {
    margin-left: 0;
  }
}

.public-config {
  label {
    width: 96px;
    margin: 10px 0;
  }
}

.smallIconStyle {
  svg {
    width: 10.5px;
    height: 10.5px;
  }
}

.itemLableStyle {
  color: #111111;
  font-size: 12px;
  background: #F0F8FF;
  border-radius: 4px;
  height: 22px;
  line-height: 23px;
  padding: 0 5px;
  margin-right: 5px;
}

.poperLabelStyle2 {
  position: absolute;
  padding: 10px 10px 10px 10px;
  width: 470px;
  min-height: 60px;
  top: -20px;
  left: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(238, 238, 238, 1);
  z-index: 99;
}

.selectDemandLabelItem {
  height: 24px;
  line-height: 24px;
  padding: 0 5px;
  font-size: 12px;
  color: #111111;
  border-radius: 4px;
  margin-top: 8px;
  margin-right: 5px;
  text-align: center;
  background: #F0F8FF;
}

.realStyle {
  color: #0A87F8;

  svg {
    width: 55px;
    height: 20px;
  }
}

.moreStyle {
  /deep/ .label-item .title .ft-bolder {
    height: 45px;
  }
}
</style>
