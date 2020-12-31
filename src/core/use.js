import Vue from 'vue'

// base library
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import VueCropper from 'vue-cropper'
import 'ant-design-vue/dist/antd.less'

// ext library
import VueClipboard from 'vue-clipboard2'
import MultiTab from '@/components/MultiTab'
import PageLoading from '@/components/PageLoading'
// import PermissionHelper from '@/core/permission/permission'
// import '@/components/use'
// import './directives/action'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import LabelItem from '@/components/FormItem/LabelItem'

// permission
import isPermitted from '@/core/directives/permission'
import { $isPermitted } from '@/core/directives/permission/button'
import '@/utils/directives'
import { isAjaxSuccess } from '@/utils/util'

// 百度地图组件
import BaiduMap from 'vue-baidu-map'
//高德地图组件
import AMap from 'vue-amap' // global style

Vue.prototype.$isPermitted = $isPermitted
Vue.prototype.$isAjaxSuccess = isAjaxSuccess

VueClipboard.config.autoSetContainer = true

Vue.use(Antd)
Vue.use(Viser)
Vue.use(MultiTab)
Vue.use(PageLoading)
Vue.use(VueClipboard)
// Vue.use(PermissionHelper)
Vue.use(VueCropper)
Vue.use(isPermitted)

// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('LabelItem', LabelItem)

Vue.use(BaiduMap, {
  ak: 'SKG8d2hZRjmSQpvtkz89nquhHn5BCrdD&s=1'
})
Vue.use(AMap, {
  ak: 'b21b9f5764e1fe30480d5d0f1fdac12a'
})
AMap.initAMapApiLoader({
  key: 'b21b9f5764e1fe30480d5d0f1fdac12a',
  plugin: [
    'AMap.Autocomplete',
    //输入提示插件
    'AMap.PlaceSearch',
    //POI搜索插件
    'AMap.Scale',
    //右下角缩略图插件 比例尺
    'AMap.OverView',
    //地图鹰眼插件
    'AMap.ToolBar',
    //地图工具条
    'AMap.MapType',
    //类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    'AMap.PolyEditor',
    //编辑 折线多，边形
    'AMap.CircleEditor',
    //圆形编辑器插件
    'AMap.Geolocation'
    //定位控件，用来获取和展示用户主机所在的经纬度位置
  ],
  uiVersion: '1.0'
})

// process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] WARNING: Antd now use fulled imported.')
