<template>
  <div id="workbench">
    <div class="loadingCircle" id="loadingCircle" v-if="spinLoading"></div>
    <skeleton-workbench v-show="hasWorkbench && spinLoading"> </skeleton-workbench>
    <content-main v-show="hasWorkbench">
      <div class="house f-clearfix">
        <div class="left f-fl">
          <div class="title">
            <!-- <icon-font class="title-icon" type="iconyumengtubiao_fangyuan-" /> -->
            <a-icon class="title-icon" type="power"></a-icon>
            房源管理
          </div>
          <div>
            <div class="house-con f-clearfix">
              <div class="occupancy-rate f-fl" @click="goto('share','index',1)">
                <p class="share-house">合/整租 <span>(0 间)</span></p>
                <p>入住率：0%</p>
              </div>
              <ul class="f-fl house-info">
                <li @click="goto('share','vacant',1)">
                  <p><span class="vacant">0</span></p>
                  <p><span>空置 </span></p>
                </li>
                <li @click="goto('share','config',1)">
                  <p><span class="config">0</span></p>
                  <p><span>配置 </span></p>
                </li>
                <li @click="goto('share','rent',1)">
                  <p><span class="rent">0</span></p>
                  <p><span>已租 </span></p>
                </li>
                <li @click="goto('share','moveIn',1)" style="width: 160px;">
                  <p><span class="config">0</span></p>
                  <p><span>即将搬入(30天内) </span></p>
                </li>
                <li @click="goto('share','moveOut',1)" style="width: 160px;">
                  <p><span class="config">0</span></p>
                  <p><span>即将到期(30天内) </span></p>
                </li>
                <li @click="goto('share','expired',1)">
                  <p><span class="vacant">0</span></p>
                  <p><span>已到期 </span></p>
                </li>
              </ul>
            </div>
            <div class="house-con f-clearfix">
              <div class="occupancy-rate f-fl" @click="goto('centralized','index',2)">
                <p class="centralized-house">独栋 <span>(2间)</span> </p>
                <p>入住率：2%</p>
              </div>
              <ul class="f-fl house-info">
                <li @click="goto('centralized','vacant',2)">
                  <p><span class="vacant">0</span></p>
                  <p><span>空置 </span></p>
                </li>
                <li @click="goto('centralized','config',2)">
                  <p><span class="config">0</span></p>
                  <p><span>配置 </span></p>
                </li>
                <li @click="goto('centralized','rent',2)">
                  <p><span class="rent">0</span></p>
                  <p><span>已租 </span></p>
                </li>
                <li @click="goto('centralized','moveIn',2)" style="width: 160px;">
                  <p><span class="config">0</span></p>
                  <p><span>即将搬入(30天内) </span></p>
                </li>
                <li @click="goto('centralized','moveOut',2)" style="width: 160px;">
                  <p><span class="config">0</span></p>
                  <p><span>即将到期(30天内) </span></p>
                </li>
                <li @click="goto('centralized','expired',2)">
                  <p><span class="vacant">0</span></p>
                  <p><span>已到期 </span></p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="right f-fr chart-wrap">
          <ul class="house-type">
            <li :class="{active: activeIndex == index}" @click="changeHouseType(item,index)" v-for="(item,index) in houseType" :key="index">{{ item }}</li>
          </ul>
          <div v-if="houseDataNullFlag" style="position:absolute;top:50%;left:calc(50% - 30px);color: #777777">暂无数据</div>
          <div id="workbench-c1"></div>
        </div>
      </div>

      <div class="contract f-clearfix">
        <div class="left f-fl">
          <div class="title">
            <!-- <icon-font class="title-icon" type="iconyumengtubiao_daishenpirenyuan" /> -->
            <a-icon class="title-icon" type="power"></a-icon>
            合约管理
          </div>
          <div>
            <div class="contract-con f-clearfix">
              <div class="contract-count f-fl" @click="goto('tenant','index',3)">
                <p>
                  <b>
                    <span>租客合同</span>
                    <span>（0份）</span>
                  </b>
                </p>
              </div>
              <ul class="f-fl f-clearfix contract-info">
                <li class="f-fl" @click="goto('tenant','toBeSign',3)">
                  <p class="config">0</p>
                  <p>待签字</p>
                </li>
                <li class="f-fl" @click="goto('tenant','inRent',3)">
                  <p class="rent">0</p>
                  <p>在租中</p>
                </li>
                <li class="f-fl" @click="goto('tenant','moveOut',3)">
                  <p class="config">0</p>
                  <p>即将搬出</p>
                </li>
                <li class="f-fl" @click="goto('tenant','expired',3)">
                  <p class="vacant">0</p>
                  <p>已到期</p>
                </li>
              </ul>
            </div>
            <div class="contract-con f-clearfix">
              <div class="contract-count f-fl" @click="goto('owner','index',4)">
                <p>
                  <b>
                    <span>业主合同</span>
                    <span>（0份）</span>
                  </b>
                </p>
              </div>
              <ul class="f-fl f-clearfix contract-info">
                <li class="f-fl" @click="goto('owner','inRent',4)">
                  <p class="rent">0</p>
                  <p>合约中</p>
                </li>
                <li class="f-fl" @click="goto('owner','moveOut',4)">
                  <p class="config">0</p>
                  <p>即将到期</p>
                </li>
                <li class="f-fl" @click="goto('owner','expired',4)">
                  <p class="vacant">0</p>
                  <p>已到期</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="right f-fr chart-wrap">
          <ul class="contract-type">
            <li :class="{active: contractActiveIndex == index}" @click="changeContractType(item,index)" v-for="(item,index) in ContractType" :key="index">{{ item }}</li>
          </ul>
          <div id="workbench-c2"></div>
        </div>
      </div>
      <div class="finance f-clearfix">
        <div class="left f-fl">
          <div class="title">
            <!-- <icon-font class="title-icon" type="iconyumengtubiao_caiwuguanli" /> -->
            <a-icon class="title-icon" type="power"></a-icon>
            财务管理
          </div>
          <div class="finance-con">
            <div class="finance-info">
              <div class="total-balance">
                <div>
                  <a-statistic valueStyle="font-size:16px;color: #111111;" :precision="2" :value="23/100" />
                  <p>账户总额</p>
                </div>
              </div>
              <div class="total-balance-detail">
                <div class="yesterday">
                  <p class="date">昨日</p>
                  <div class="yesterday-balance">
                    <a-statistic valueStyle="font-size:16px;color: #0A87F8;" :precision="2" :value="34/100" />
                    <p>昨日营收(元)</p>
                  </div>
                  <div>
                    <a-statistic valueStyle="font-size:16px;color: #0A87F8;" :precision="2" :value="53/100" />
                    <p>昨日收入(元)</p>
                  </div>
                  <div>
                    <a-statistic valueStyle="font-size:16px;color: #0A87F8;" :precision="2" :value="65/100" />
                    <p>昨日支出(元)</p>
                  </div>
                </div>
                <div class="today">
                  <p class="date">今日</p>
                  <div class="today-balance">
                    <a-statistic valueStyle="font-size:16px;color: #0A87F8;" :precision="2" :value="78/100" />
                    <p>今日营收(元)</p>
                  </div>
                  <div>
                    <a-statistic valueStyle="font-size:16px;color: #0A87F8;" :precision="2" :value="54/100" />
                    <p>今日收入(元)</p>
                  </div>
                  <div>
                    <a-statistic valueStyle="font-size:16px;color: #0A87F8;" :precision="2" :value="65/100" />
                    <p>今日支出(元)</p>
                  </div>
                </div>
              </div>
            </div>
            <!--
            <div class="overdueAmount">
                <div class="arrow-down"></div>
                <p >
                   累计欠费(元)：<a-statistic style="display: inline-block" valueStyle="font-size:16px;color: #0A87F8;" :precision="2" :value="billData.overdueAmount/100" />
                </p>
            </div>
            -->
            <div class="in-out">
              <div class="in-detail">
                <p class="in-tag">
                  <span>收</span>
                </p>
                <div class="in-total" @click="goto('bill','income')">
                  <div>
                    <p>
                      <span class="tag-icon">
                        <b>78</b>
                      </span>
                    </p>
                    <p>应收(笔)</p>
                  </div>
                  <div>
                    <p class="in-Yaxis">
                      <a-statistic valueStyle="font-size:16px;color: #0A87F8;" :precision="2" :value="23/100" />
                    </p>
                    <p>应收(元)</p>
                  </div>
                </div>
                <div class="today-total" @click="goto('bill','todayIncome')">
                  <div>
                    <p class="tag-icon">
                      <b>33</b>
                    </p>
                    <p>今日(笔)</p>
                  </div>
                  <div>
                    <p>
                      <a-statistic valueStyle="font-size:16px;color:#111111" :precision="2" :value="32/100" />
                    </p>
                    <p>今日应收(元)</p>
                  </div>
                </div>
                <div class="overdue-total" @click="goto('bill','overdueIncome')">
                  <div>
                    <p class="tag-icon">
                      <b>23</b>
                    </p>
                    <p>逾期(笔)</p>
                  </div>
                  <div>
                    <p>
                      <a-statistic valueStyle="font-size:16px;color:#111111" :precision="2" :value="53/100" />
                    </p>
                    <p>逾期应收(元)</p>
                  </div>
                </div>
              </div>
              <div class="out-detail">
                <p class="out-tag">
                  <span>支</span>
                </p>
                <div class="out-total" @click="goto('bill','expend')">
                  <div>
                    <p>
                      <span class="tag-icon">
                        <b>23</b>
                      </span>
                    </p>
                    <p>应支(笔)</p>
                  </div>
                  <div>
                    <p class="out-Yaxis">
                      <a-statistic valueStyle="font-size:16px;color:#FB4246" :precision="2" :value="23/100" />
                    </p>
                    <p>应支(元)</p>
                  </div>
                </div>
                <div class="today-total" @click="goto('bill','todayExpend')">
                  <div>
                    <p class="tag-icon">
                      <b>54</b>
                    </p>
                    <p>今日(笔)</p>
                  </div>
                  <div>
                    <p>
                      <a-statistic valueStyle="font-size:16px;color:#111111" :precision="2" :value="23/100" />
                    </p>
                    <p>今日支收(元)</p>
                  </div>
                </div>
                <div class="overdue-total" @click="goto('bill','overdueExpend')">
                  <div>
                    <p class="tag-icon">
                      <b>23</b>
                    </p>
                    <p>逾期(笔)</p>
                  </div>
                  <div>
                    <p>
                      <a-statistic valueStyle="font-size:16px;color:#111111" :precision="2" :value="43/100" />
                    </p>
                    <p>逾期应支(元)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right f-fr chart-wrap">
          <p>近6月交易流水</p>
          <div id="c3"></div>
        </div>
      </div>
      <div class="workorder">
        <div class="title first-box">
          <!-- <icon-font class="title-icon" type="iconfangzi" /> -->
          <a-icon class="title-icon" type="power"></a-icon>
          租前
        </div>
        <div class="workorder-content clearfix">
          <div class="detail bgStyle f-fl clearfix">
            <div style="position: relative" class="title leftBgStyle f-fl cursor" @click="goto('tenantSource','pending',6)">
              <div style="position: absolute;top:0px;left: 0px;">
                <img style="width: 52px;height: 52px;" src="http://placehold.it/80x80">
              </div>
              <div class="titleNumberStyle nameCommonStyle margin-bottom2" style="color: #FF8600;">5</div>
              <div class="nameStyle nameCommonStyle">待处理</div>
            </div>
            <div class="details f-fl cursor" style="margin-left: 14px" @click="goto('tenantSource','todayQuantity',6)">
              <div class="processingStyle commonStyle margin-bottom2" style="color: #111111;">5</div>
              <div class="nameStyle commonStyle">今日预约</div>
            </div>
            <div class="details f-fl cursor" @click="goto('tenantSource','weekQuantity',6)">
              <div class="pendingStyle commonStyle margin-bottom2" style="color: #111111;">23</div>
              <div class="nameStyle commonStyle">本周预约</div>
            </div>
            <div class="details f-fl cursor" @click="goto('tenantSource','monthQuantity',6)">
              <div class="acceptanceStyle commonStyle margin-bottom2" style="color: #111111;">76</div>
              <div class="nameStyle commonStyle">本月预约</div>
            </div>
          </div>
          <div class="detail bgStyle f-fl clearfix" style="margin-left: 10px;">
            <div style="position: relative" class="title leftBgStyle f-fl cursor" @click="goto('reserve','pending',7)">
              <div style="position: absolute;top:0px;left: 0px;">
                <img style="width: 52px;height: 52px;" src="http://placehold.it/80x80">
              </div>
              <div class="titleNumberStyle nameCommonStyle margin-bottom2" style="color: #FF8600;">43</div>
              <div class="nameStyle nameCommonStyle">待使用</div>
            </div>
            <div class="details f-fl cursor" style="margin-left: 14px" @click="goto('reserve','todayQuantity',7)">
              <div class="processingStyle commonStyle margin-bottom2" style="color: #111111;">5</div>
              <div class="nameStyle commonStyle">今日预定</div>
            </div>
            <div class="details f-fl cursor" @click="goto('reserve','weekQuantity',7)">
              <div class="pendingStyle commonStyle margin-bottom2" style="color: #111111;">9</div>
              <div class="nameStyle commonStyle">本周预定</div>
            </div>
            <div class="details f-fl cursor" @click="goto('reserve','monthQuantity',7)">
              <div class="acceptanceStyle commonStyle margin-bottom2" style="color: #111111;">3</div>
              <div class="nameStyle commonStyle">本月约定</div>
            </div>
          </div>
        </div>
      </div>
      <div class="workorder clearfix">
        <div class="title first-box">
          <!-- <icon-font class="title-icon" type="icon-yumengtubiao_shouye-zuhou" /> -->
          <a-icon class="title-icon" type="power"></a-icon>
          租后
        </div>
        <div class="workorder-content clearfix">
          <div class="detail bgStyle f-fl clearfix">
            <div class="title leftBgStyle f-fl cursor" @click="goto('repair','all',8)">
              <div class="titleNumberStyle nameCommonStyle margin-bottom2">76</div>
              <div class="nameStyle nameCommonStyle">维修服务</div>
            </div>
            <div class="details f-fl cursor" style="margin-left: 14px" @click="goto('repair','pending',8)">
              <div class="processingStyle commonStyle margin-bottom2">3</div>
              <div class="nameStyle commonStyle">待处理</div>
            </div>
            <div class="details f-fl cursor" @click="goto('repair','processing',8)">
              <div class="pendingStyle commonStyle margin-bottom2">6}</div>
              <div class="nameStyle commonStyle">处理中</div>
            </div>
            <div class="details f-fl cursor" @click="goto('repair','acceptance',8)">
              <div class="acceptanceStyle commonStyle margin-bottom2">43</div>
              <div class="nameStyle commonStyle">待验收</div>
            </div>
          </div>
          <div class="detail bgStyle f-fl clearfix" style="margin-left: 10px;">
            <div class="title leftBgStyle f-fl cursor" @click="goto('cleaning','all',9)">
              <div class="titleNumberStyle nameCommonStyle margin-bottom2">7</div>
              <div class="nameStyle nameCommonStyle">保洁服务</div>
            </div>
            <div class="details f-fl cursor" style="margin-left: 14px" @click="goto('cleaning','pending',9)">
              <div class="processingStyle commonStyle margin-bottom2">2</div>
              <div class="nameStyle commonStyle">待处理</div>
            </div>
            <div class="details f-fl cursor" @click="goto('cleaning','processing',9)">
              <div class="pendingStyle commonStyle margin-bottom2">54</div>
              <div class="nameStyle commonStyle">处理中</div>
            </div>
            <div class="details f-fl cursor" @click="goto('cleaning','acceptance',9)">
              <div class="acceptanceStyle commonStyle margin-bottom2">9</div>
              <div class="nameStyle commonStyle">待验收</div>
            </div>
          </div>
        </div>
        <div class="workorder-content clearfix">
          <div class="detail bgStyle f-fl clearfix">
            <div class="title leftBgStyle f-fl cursor" @click="goto('distribution','all',10)">
              <div class="titleNumberStyle nameCommonStyle margin-bottom2">56</div>
              <div class="nameStyle nameCommonStyle">配货服务</div>
            </div>
            <div class="details f-fl cursor" style="margin-left: 14px" @click="goto('distribution','pending',10)">
              <div class="processingStyle commonStyle margin-bottom2">43</div>
              <div class="nameStyle commonStyle">待处理</div>
            </div>
            <div class="details f-fl cursor" @click="goto('distribution','processing',10)">
              <div class="pendingStyle commonStyle margin-bottom2">6</div>
              <div class="nameStyle commonStyle">处理中</div>
            </div>
            <div class="details f-fl cursor" @click="goto('distribution','acceptance',10)">
              <div class="acceptanceStyle commonStyle margin-bottom2">6</div>
              <div class="nameStyle commonStyle">待验收</div>
            </div>
          </div>
          <div class="detail bgStyle f-fl clearfix" style="margin-left: 10px;">
            <div class="title leftBgStyle f-fl cursor" @click="goto('complaint','all',11)">
              <div class="titleNumberStyle nameCommonStyle margin-bottom2">54</div>
              <div class="nameStyle nameCommonStyle">投诉服务</div>
            </div>
            <div class="details f-fl cursor" style="margin-left: 14px" @click="goto('complaint','pending',11)">
              <div class="processingStyle commonStyle margin-bottom2">54</div>
              <div class="nameStyle commonStyle">待处理</div>
            </div>
            <div class="details f-fl cursor" @click="goto('complaint','processing',11)">
              <div class="pendingStyle commonStyle margin-bottom2">34</div>
              <div class="nameStyle commonStyle">处理中</div>
            </div>
            <div class="details f-fl cursor" @click="goto('complaint','acceptance',11)">
              <div class="acceptanceStyle commonStyle margin-bottom2">43</div>
              <div class="nameStyle commonStyle">待验收</div>
            </div>
          </div>
        </div>
      </div>
      <div class="workorder">
        <div class="title first-box">
          <!-- <icon-font class="title-icon" type="iconwangguanzhuangtai" /> -->
          <a-icon class="title-icon" type="power"></a-icon>
          智能设备
        </div>
        <div class="workorder-content clearfix">
          <div class="detail bgStyle f-fl clearfix">
            <div style="position: relative;" class="title leftBgStyle f-fl cursor" @click="goto('lock','all',12)">
              <div style="position: absolute;top:0px;left: 0px;">
                <img style="width: 52px;height: 52px;" src="http://placehold.it/80x80">
              </div>
              <div class="titleNumberStyle nameCommonStyle margin-bottom2">55</div>
              <div class="nameStyle nameCommonStyle">门锁统计</div>
            </div>
            <div class="details f-fl cursor" style="margin-left: 14px;width: 100px;" @click="goto('lock','online',12)">
              <div class="processingStyle littleCommonStyle margin-bottom2">34</div>
              <div class="nameStyle littleCommonStyle">在线</div>
            </div>
            <div class="details f-fl cursor" style="width: 100px;" @click="goto('lock','onlineLowPower',12)">
              <div class="acceptanceStyle littleCommonStyle margin-bottom2">32</div>
              <div class="nameStyle littleCommonStyle">低电量</div>
            </div>
            <div class="details f-fl cursor" style="width: 100px;" @click="goto('lock','offline',12)">
              <div class="offLineStyle littleCommonStyle margin-bottom2">23</div>
              <div class="nameStyle littleCommonStyle">离线</div>
            </div>
            <div class="details f-fl cursor" style="width: 100px;" @click="goto('lock','threeDaysUnlocked',12)">
              <div class="acceptanceStyle littleCommonStyle margin-bottom2">23</div>
              <div class="nameStyle littleCommonStyle">近3天未开锁</div>
            </div>
          </div>
          <div class="detail bgStyle f-fl clearfix" style="margin-left: 10px;">
            <div style="position: relative;" class="title leftBgStyle f-fl cursor" @click="goto('electric','all',13)">
              <div style="position: absolute;top:0px;left: 0px;">
                <img style="width: 52px;height: 52px;" src="http://placehold.it/80x80">
              </div>
              <div class="titleNumberStyle nameCommonStyle margin-bottom2">77</div>
              <div class="nameStyle nameCommonStyle">电表总计</div>
            </div>
            <div class="details f-fl cursor" style="margin-left: 14px" @click="goto('electric','powerSupply',13)">
              <div class="processingStyle commonStyle margin-bottom2">23</div>
              <div class="nameStyle commonStyle">供电</div>
            </div>
            <div class="details f-fl cursor" @click="goto('electric','powerOff',13)">
              <div class="offLineStyle commonStyle margin-bottom2">23</div>
              <div class="nameStyle commonStyle">断电</div>
            </div>
            <div class="details f-fl cursor" @click="goto('electric','error',13)">
              <div class="acceptanceStyle commonStyle margin-bottom2">32</div>
              <div class="nameStyle commonStyle">异常</div>
            </div>
          </div>
        </div>
        <div class="workorder-content clearfix" style="padding-bottom: 14px;">
          <div class="detail bgStyle f-fl clearfix">
            <div style="position: relative;" class="title leftBgStyle f-fl cursor" @click="goto('water','cold',18)">
              <div style="position: absolute;top:0px;left: 0px;">
                <img style="width: 52px;height: 52px;" src="http://placehold.it/80x80">
              </div>
              <div class="titleNumberStyle nameCommonStyle margin-bottom2">43</div>
              <div class="nameStyle nameCommonStyle">冷水表</div>
            </div>
            <div class="details f-fl cursor" style="margin-left: 14px;width: 100px;" @click="goto('water','coldNormal',18)">
              <div class="processingStyle littleCommonStyle margin-bottom2">23</div>
              <div class="nameStyle littleCommonStyle">供水</div>
            </div>
            <div class="details f-fl cursor" style="width: 100px;" @click="goto('water','coldAbnormal',18)">
              <div class="acceptanceStyle littleCommonStyle margin-bottom2">23</div>
              <div class="nameStyle littleCommonStyle">断水</div>
            </div>
          </div>
          <div class="detail bgStyle f-fl clearfix" style="margin-left: 10px;">
            <div style="position: relative;" class="title leftBgStyle f-fl cursor" @click="goto('water','hot',18)">
              <div style="position: absolute;top:0px;left: 0px;">
                <img style="width: 52px;height: 52px;" src="http://placehold.it/80x80">
              </div>
              <div class="titleNumberStyle nameCommonStyle margin-bottom2">23</div>
              <div class="nameStyle nameCommonStyle">热水表</div>
            </div>
            <div class="details f-fl cursor" style="margin-left: 14px" @click="goto('water','hotNormal',18)">
              <div class="processingStyle commonStyle margin-bottom2">23</div>
              <div class="nameStyle commonStyle">供水</div>
            </div>
            <div class="details f-fl cursor" @click="goto('water','hotAbnormal',18)">
              <div class="acceptanceStyle commonStyle margin-bottom2">23</div>
              <div class="nameStyle commonStyle">断水</div>
            </div>
          </div>
        </div>
      </div>
      <div class="assets">
        <div class="title first-box">
          <!-- <icon-font class="title-icon" type="iconzichan" /> -->
          <a-icon class="title-icon" type="power"></a-icon>
          物资管理
        </div>
        <div class="assets-content">
          <div class="detail bgStyle clearfix">
            <div style="position: relative;text-align: left;" class="title leftBgStyle f-fl cursor" @click="goto('management','all',17)">
              <div class="titleNumberStyle nameCommonStyle margin-bottom2">
                物品总数：23
                <span style="color: #777777;font-size: 16px;"> 件</span>
              </div>
              <div class="titleNumberStyle nameCommonStyle">
                物品总价：{{ 23/100 }}
                <span style="color: #777777;font-size: 16px;"> 元</span>
              </div>
            </div>
            <div class="details cursor" style="width: 100px;background: #F5F7FF;" @click="goto('management','companyType',17)">
              <div class="greenStyle littleCommonStyle margin-bottom2">43</div>
              <div class="fontColorStyle littleCommonStyle">公司物品总数(件)</div>
            </div>
            <div class="details cursor" style="width: 100px;background: #F5F7FF;position: relative;" @click="goto('management','companyType',17)">
              <div class="greenStyle littleCommonStyle margin-bottom2">¥{{ 32/100 }}</div>
              <div class="fontColorStyle littleCommonStyle">公司物品总数(元)</div>
              <div class="splitStyle"></div>
            </div>
            <div class="details cursor" style="width: 100px;background: #F5F7FF;" @click="goto('management','ownerType',17)">
              <div class="pendingStyle littleCommonStyle margin-bottom2">12</div>
              <div class="fontColorStyle littleCommonStyle">业主物品总数(件)</div>
            </div>
            <div class="details cursor" style="width: 100px;background: #F5F7FF;" @click="goto('management','ownerType',17)">
              <div class="pendingStyle littleCommonStyle margin-bottom2">¥{{ 32/100 }}</div>
              <div class="fontColorStyle littleCommonStyle">业主物品总数(元)</div>
            </div>
            <div class="details cursor" style="width: 100px;" @click="goto('management','idle',17)">
              <div class="acceptanceStyle littleCommonStyle margin-bottom2">54</div>
              <div class="fontColorStyle littleCommonStyle">闲置物品总数(件)</div>
            </div>
            <div class="details cursor" style="width: 100px;" @click="goto('management','idle',17)">
              <div class="acceptanceStyle littleCommonStyle margin-bottom2">¥{{ 76/100 }}</div>
              <div class="fontColorStyle littleCommonStyle">闲置物品总数(元)</div>
            </div>
          </div>
        </div>
      </div>
      <div class="workflow">
        <div class="title first-box">
          <!-- <icon-font class="title-icon" type="iconyumengtubiao_daishenpirenyuan" /> -->
          <a-icon class="title-icon" type="power"></a-icon>
          审批管理
        </div>
        <div class="workflow-content">
          <div class="detail clearfix">
            <div class="f-fl clearfix cursor" style="margin-right: 60px;" @click="goto('myTodo','',14)">
              <div class="f-fl bgStyle">
                <!-- <icon-font class="title-icon" type="icondaishenpi" /> -->
                <a-icon class="title-icon" type="power"></a-icon>
              </div>
              <div class="f-fl normalStyle">
                <span class="commonStyle">待我审批</span><span class="myTaskTotalStyle">（23）</span>
              </div>
            </div>
            <div class="f-fl clearfix cursor" style="margin-right: 60px;" @click="goto('myLaunch','unDo',15)">
              <div class="f-fl bgStyle">
                <!-- <icon-font class="title-icon" type="iconwofaqi" /> -->
                <a-icon class="title-icon" type="power"></a-icon>
              </div>
              <div class="f-fl normalStyle">
                <span class="commonStyle">我发起的</span><span class="mySubmitStyle">（23）</span>
              </div>
            </div>
            <div class="f-fl clearfix cursor" @click="goto('myCc','unDo',16)">
              <div class="f-fl bgStyle">
                <!-- <icon-font class="title-icon" type="iconchaosongwo" /> -->
                <a-icon class="title-icon" type="power"></a-icon>
              </div>
              <div class="f-fl normalStyle">
                <span class="commonStyle">抄送我的</span><span class="ccMeStyle">（43）</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </content-main>
  </div>
</template>
<script>
import skeletonWorkbench from '../skeleton/workbench'
export default {
  name: 'Workbench',
  components: {
    skeletonWorkbench
  },
  data () {
    return {
      houeData: {},
      contractData: {},
      houseType: ['全部', '合/整租', '独栋'],
      ContractType: ['租客', '业主'],
      activeIndex: 0,
      contractActiveIndex: 0,
      houseDataNullFlag: false,
      spinLoading: true,
      noPermissions: false,
      hasWorkbench: false
    }
  },
  created () {
    this.hasWorkbench = true
  },
  mounted () {
    this.spinLoading = true
    setTimeout(() => {
      this.spinLoading = false
    }, 500)
  },
  methods: {
    goto () {
    },
    changeHouseType (type, index) {
      this.activeIndex = index
    },
    changeContractType (type, index) {
      this.contractActiveIndex = index
    }
  }
}
</script>

<style scoped lang="less">
@chartWidth: 360px;

#workbench {
  & /deep/ .content-main {
    height: calc(100vh - 50px);
    padding: 14px;
    min-width: 1290px;

    .content {
      min-height: calc(100vh - 170px);
      padding: 0px;
      background-color: #f0f2f5;
    }
  }

  .house {
    margin-bottom: 14px;
    height: 300px;

    .house-con {
      display: flex;
      padding: 30px 0;

      &:not(:last-child) {
        border-bottom: 1px solid #EEEEEE;
      }

      .occupancy-rate {
        width: 150px;
        line-height: 30px;
        cursor: pointer;

        .share-house {
          color: #FFA036;

          span {
            color: #777777;
          }
        }

        .whole-house {
          color: #0A87F8;

          span {
            color: #777777;
          }
        }

        .centralized-house {
          color: #03C683;

          span {
            color: #777777;
          }
        }
      }

      .house-info {
        flex: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;

        li {
          width: 100px;
          text-align: center;
          line-height: 26px;
          cursor: pointer;

          p:first-child {
            font-weight: bold;
            font-size: 16px;
          }
        }
      }
    }
  }

  .contract {
    margin-bottom: 14px;
    height: 250px;

    .contract-con {
      display: flex;
      padding: 20px 0;
      cursor: pointer;

      &:not(:last-child) {
        border-bottom: 1px solid #EEEEEE;
      }

      .contract-count {
        display: flex;
        align-items: center;
        width: 150px;
      }

      .contract-info {
        flex: 1;

        li {
          width: 20%;
          text-align: center;
          line-height: 26px;
          cursor: pointer;

          p:first-child {
            font-weight: bold;
            font-size: 16px;
          }
        }
      }
    }
  }

  .finance {
    height: 450px;

    .finance-con {
      margin: 20px 0;
      text-align: center;

      .finance-info {
        display: flex;
        margin-bottom: 10px;
        line-height: 26px;

        .total-balance {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 172px;
          background: #EEF2FE;
        }

        .total-balance-detail {
          flex: 1;
          background: #FAFBFF;

          /*display: flex;*/
          .yesterday {
            border-bottom: 1px solid #EEEEEE;
          }

          .yesterday,
          .today {
            position: relative;
            display: flex;
            align-items: center;

            &>div {
              flex: 1;
              padding: 20px 0;
            }

            .date {
              position: absolute;
              top: 6px;
              left: 6px;
              font-size: 12px;
              color: #777;
            }
          }

          .yesterday-balance,
          .today-balance {
            background: #F5F7FF;
          }

        }

      }

      .overdueAmount {
        position: relative;
        border-top: 1px solid #EEEEEE;
        padding: 20px 0;

        .arrow-down {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translate(-50%, -50%);
          transform: rotate(45deg);
          width: 16px;
          height: 16px;
          border: 1px solid #EEEEEE;
          border-top: none;
          border-left: none;
          background: #ffffff;
        }
      }

      .in-out {
        line-height: 24px;

        .in-detail,
        .out-detail {
          position: relative;
          display: flex;
          margin-bottom: 14px;

          .in-tag,
          .out-tag {
            position: absolute;
            width: 32px;
            height: 32px;
            line-height: 32px;
            border-bottom-right-radius: 100%;
            background: #D6DEFF;

            span {
              position: absolute;
              top: -2px;
              left: 6px;
              color: #0a87f8;
            }
          }

          .out-tag {
            background: #FCD4D5;

            span {
              color: #FB4246;
            }
          }

          &>div {
            flex: 1;
            display: flex;

            &>div {
              flex: 1;
              padding: 20px 0;
              cursor: pointer;
            }
          }

          .in-total {
            background: #EEF2FE;
          }

          .out-total {
            background: #FBECEC;
          }
        }

        .in-detail {
          .in-Yaxis {
            /*color: #0A87F8;*/
          }

          .today-total {
            background: #F5F7FF;
          }

          .overdue-total {
            background: #FAFBFF;
          }
        }

        .out-detail {
          .out-Yaxis {
            /*color: #FB4246;*/
          }

          .today-total {
            background: #FBF3F4;
          }

          .overdue-total {
            background: #FCF7F9;
          }
        }
      }
    }
  }

  .workorder {
    margin-top: 14px;
    border-radius: 4px;
    background-color: #FFFFFF;

    .first-box {
      padding: 14px 14px 6px 14px;
    }

    .workorder-content {
      padding: 14px;
      display: flex;

      .detail {
        width: calc(50% - 5px);
        height: 85px;
        border-radius: 4px;

        .title {
          width: 170px;
          padding: 15px 0 20px 0;
          text-align: center;
        }

        .details {
          width: 140px;
          margin-top: 18px;
          text-align: center;
        }

        .littleCommonStyle {
          width: 100px;
          text-align: center;
        }

        .commonStyle {
          width: 140px;
          text-align: center;
        }

        .margin-bottom2 {
          margin-bottom: 2px;
        }

        .nameCommonStyle {
          width: 170px;
          text-align: center;
        }

        .nameStyle {
          font-size: 14px;
          color: #333333;
        }

        .titleNumberStyle {
          font-size: 18px;
          color: #111111;
        }

        .titleNumberColor1 {
          color: #FF8600;
        }

        .titleNumberColor2 {
          color: #111111;
        }

        .processingStyle {
          color: #0A87F8;
          font-size: 16px;
        }

        .pendingStyle {
          color: #FF8600;
          font-size: 16px;
        }

        .acceptanceStyle {
          color: #FB4246;
          font-size: 16px;
        }

        .offLineStyle {
          color: #777777;
          font-size: 16px;
        }
      }

      .bgStyle {
        background: #FAFBFF;
      }

      .leftBgStyle {
        background: #EEF2FE;
      }
    }
  }

  .assets {
    margin-top: 14px;
    border-radius: 4px;
    background-color: #FFFFFF;

    .first-box {
      padding: 14px 14px 6px 14px;
    }

    .assets-content {
      padding: 14px;
      width: 100%;

      .item {
        flex: 1;
      }

      .detail {
        width: 100%;
        height: 85px;
        border-radius: 4px;
        display: flex;

        .title {
          width: 238px;
          padding: 15px 0 20px 0;
          text-align: center;
        }

        .details {
          width: 140px;
          padding-top: 18px;
          text-align: center;
          flex: 1;
        }

        .littleCommonStyle {
          text-align: center;
        }

        .commonStyle {
          width: 140px;
          text-align: center;
        }

        .margin-bottom2 {
          margin-bottom: 2px;
        }

        .nameCommonStyle {
          padding-left: 15px;
        }

        .fontColorStyle {
          font-size: 14px;
          font-weight: 400;
          color: #333333;
        }

        .greenStyle {
          color: #03C683;
          font-size: 16px;
          font-weight: 600;
        }

        .pendingStyle {
          color: #FF8600;
          font-size: 16px;
          font-weight: 600;
        }

        .acceptanceStyle {
          color: #FB4246;
          font-size: 16px;
          font-weight: 600;
        }

        .splitStyle {
          position: absolute;
          width: 1px;
          height: 45px;
          background-color: #DDDDDD;
          right: 0;
          bottom: 19px;
        }
      }

      .bgStyle {
        background: #FAFBFF;
      }

      .leftBgStyle {
        background: #EEF2FE;
      }
    }
  }

  .workflow {
    margin-top: 14px;
    border-radius: 4px;
    background-color: #FFFFFF;

    .first-box {
      padding: 14px 14px 6px 14px;
    }

    .workflow-content {
      padding: 14px;

      .detail {
        height: 40px;

        .bgStyle {
          width: 36px;
          height: 36px;
          background-color: fade(#0A87F8, 10%);
          border-radius: 50%;

          svg {
            margin: 8px 0 0 8px;
            width: 20px;
            height: 20px;
            color: #0A87F8;
          }
        }

        .normalStyle {
          height: 40px;
          line-height: 40px;
          margin-left: 13px;
        }

        .ccMeStyle {
          font-size: 18px;
          color: #111111;
        }

        .mySubmitStyle {
          font-size: 18px;
          color: #0A87F8;
        }

        .myTaskTotalStyle {
          font-size: 18px;
          color: #FF8600;
        }

        .commonStyle {
          color: #333333;
          font-size: 14px;
        }
      }
    }
  }

  .left,
  .right {
    padding: 14px;
    height: 100%;
    background: #ffffff;
    border-radius: 4px;
  }

  .left {
    width: calc(100% - @chartWidth - 2px);
  }

  .chart-wrap {
    width: @chartWidth;
    text-align: center;
    position: relative;

    .house-type,
    .contract-type {
      margin: 0 50px 0px 50px;
      display: flex;
      justify-content: space-around;

      li {
        cursor: pointer;
      }

      .active {
        color: #0a87f8;
      }
    }

    .contract-type {
      margin: 0 100px 0px 100px;
    }
  }

  .title {
    font-size: 16px;
    color: #333333;

    .title-icon {
      color: #777777;
      font-size: 20px;
    }
  }

  .tag-icon {
    position: relative;
    display: inline-block;
    height: 20px;
    line-height: 20px;
    padding: 0px 6px;
    min-width: 30px;
    border-radius: 12px;
    color: #ffffff;
    background: #777777;

    &:after {
      position: absolute;
      bottom: -14px;
      left: 6px;
      content: "";
      display: inline-block;
      border-width: 10px 3px;
      border-style: solid;
      border-color: #777777 transparent transparent transparent;
      transform: rotate(45deg);
    }
  }

  .vacant {
    color: #0d8728;
  }

  .rent {
    color: #0a87f8;
  }

  .config {
    color: #0A87F8;
  }
}

.no-permissions-wrap {
  height: calc(100vh - 170px);
  text-align: center;
  background-color: #ffffff;
  overflow: hidden;

  .title {
    font-size: 24px !important;
    color: #111111;
  }

  .bg-title {
    margin-top: -30px;
    height: 56px;
    font-size: 40px;
    font-family: Arial-Black, Arial;
    font-weight: 900;
    color: rgba(17, 17, 17, .05);
    line-height: 56px;
  }

  .tips {
    margin: 20px auto 80px auto;
    color: #777777;
  }

  img {
    width: 368px;
    height: 191px;
  }
}
</style>
