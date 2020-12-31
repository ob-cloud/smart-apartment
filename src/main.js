// with polyfills
import 'core-js/stable'
// import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import LabelItem from '@/components/FormItem/LabelItem'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './utils/filter' // global filter
import '@/assets/styles/global.less'
import '@/utils/directives'

// 百度地图组件
import BaiduMap from 'vue-baidu-map'
//高德地图组件
import AMap from 'vue-amap' // global style

Vue.config.productionTip = false

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

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
