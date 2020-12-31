/* eslint-disable no-unused-vars */
/* eslint-disable no-eval */
import Vue from 'vue'

/**
 * mark 权限指令
 * 指令用法：
 *  - 在需要控制权限的组件上使用 v-mark="['mark']" , 如下：
 *    <i-button v-mark="['mk_house_whole_tj']" >添加</a-button>
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 */
Vue.directive('mark', {
  inserted: function (el, binding, vnode) {
    const permissions = JSON.parse(sessionStorage.getItem('permissions'))
    const marksArr = binding.value
    let flag = false
    if (permissions) {
      marksArr.forEach((val) => {
        permissions.some(function (item) {
          if (item.mark === val) {
            flag = true
            return true
          }
        })
      })
    }
    if (!flag) {
      el.parentNode && el.parentNode.removeChild(el) || (el.style.display = 'none')
    }
  }
})

Vue.directive('mustFill', {
  // 当绑定元素插入到 DOM 中。
  componentUpdated: function (el, binding, vnode, oldVnode) {
    // console.log(el)
    // console.log(binding)
    // console.log(vnode)
    // console.log(oldVnode)
    if (el.value === 'undefined') { // ant-design的 a-input组件在某些情况下返回的不是input，而是span标签包裹着input
      el = el.getElementsByTagName('input')[0]
    }
    if (binding.arg) {
      if (!el.value) {
        el.style.border = '1px solid red'
      } else {
        el.style.border = 'none'
      }
    } else {
      el.style.border = 'none'
    }
  }
})

Vue.directive('validate', {
  // 用法  v-validate="'required|min(5)|max(15)|minlength(6)|maxlength(12)'"
  inserted: function (el, validateStr) {
    if (el.value === undefined) { // ant-design的 a-input组件在某些情况下返回的不是input，而是span标签包裹着input
      el = el.getElementsByTagName('input')[0]
    }
    // 将验证规则拆分为验证数组
    const validateRuleArr = validateStr.value.split('|')
    // 监听失去焦点的时候
    el.addEventListener('keyup', function () {
      //失去焦点进行验证
      checkedKeyupFun()
    })
    el.addEventListener('blur', function () {
      //失去焦点进行验证
      checkedBlurFun()
    })

    // 循环进行验证
    function checkedKeyupFun() {
      for (var i = 0; i < validateRuleArr.length; ++i) {
        const rateRegex = /^rate$/ // 判断设置了费率（1个小数点）
        const moneyZeroRegex = /^moneyZero$/ // 判断设置了money可以为0
        const moneyRegex = /^money$/ // 判断设置了money
        const moneyNoDotRegex = /^moneyNoDot$/ // 判断设置了money,不能有小数点
        const areaRegex = /^area$/ // 判断设置了面积area
        const maxlengthRegex = /maxlength\(/ //判断设置了 maxlength 最大长度
        const maxRegex = /max\(/ //判断设置了max 最大值
        const phoneRegex = /^phone$/ //判断设置了max 最大值
        const cardIDRegex = /^cardID$/ //判断设置了cardID 身份证
        const naturalNumRegex = /^naturalNum$/ //判断设置了naturalNum 自然数
        const positiveIntRegex = /^positiveInt$/ //判断设置了positiveInt 正整数
        const intRegex = /^int$/ //判断设置了int 整数

        // 判断设置了money,不能有小数点
        if (rateRegex.test(validateRuleArr[i])) {
          rateKeyup()
        }
        // 判断设置了money,不能有小数点
        if (moneyNoDotRegex.test(validateRuleArr[i])) {
          moneyNoDotKeyup()
        }
        // 判断设置了money
        if (moneyRegex.test(validateRuleArr[i])) {
          moneyKeyup()
        }
        // 判断设置了moneyZero
        if (moneyZeroRegex.test(validateRuleArr[i])) {
          moneyZeroKeyup()
        }
        // 判断设置了area
        if (areaRegex.test(validateRuleArr[i])) {
          areaKeyup()
        }
        // 判断设置了最大长度、、最大值
        if (maxlengthRegex.test(validateRuleArr[i]) ||
          maxRegex.test(validateRuleArr[i])
        ) {
          eval(validateRuleArr[i])
        }
        // 判断设置了验证手机号码
        if (phoneRegex.test(validateRuleArr[i])) {
          phoneKeyup()
        }

        // 判断设置了验证身份证号码
        if (cardIDRegex.test(validateRuleArr[i])) {
          cardIDKeyup()
        }

        // 判断设置了验证自然数
        if (naturalNumRegex.test(validateRuleArr[i])) {
          naturalNumberKeyup()
        }

        // 判断设置了验证正整数
        if (positiveIntRegex.test(validateRuleArr[i])) {
          positiveIntegerKeyup()
        }

        // 判断设置了验证整数
        if (intRegex.test(validateRuleArr[i])) {
          integerKeyup()
        }
      }
    }

    // 循环进行验证
    function checkedBlurFun() {
      for (var i = 0; i < validateRuleArr.length; ++i) {
        const rateRegex = /^rate$/ // 判断设置了费率（1个小数点）
        const moneyZeroRegex = /^moneyZero$/ // 判断设置了金额money（可以为0）
        const moneyNoDotRegex = /^moneyNoDot$/ // 判断设置了金额money
        const moneyRegex = /^money$/ // 判断设置了金额money
        const areaRegex = /^area$/ // 判断设置了面积area
        const minRegex = /min\(/ //判断设置了min 最小值
        const minLengthRegex = /minlength\(/ //判断设置了 minlength 最小长度
        const phoneRegex = /^phone$/ //判断设置了max 最大值
        const cardIDRegex = /^cardID$/ //判断设置了cardID 身份证
        const intRegex = /^int$/ //判断设置了int 整数

        // 判断设置了rate
        if (rateRegex.test(validateRuleArr[i])) {
          rateBlur()
        }
        // 判断设置了money
        if (moneyNoDotRegex.test(validateRuleArr[i])) {
          moneyNoDotBlur()
        }
        // 判断设置了money
        if (moneyRegex.test(validateRuleArr[i])) {
          moneyBlur()
        }

        // 判断设置了moneyZero
        if (moneyZeroRegex.test(validateRuleArr[i])) {
          moneyZeroBlur()
        }

        // 判断设置了area
        if (areaRegex.test(validateRuleArr[i])) {
          areaBlur()
        }

        // 判断设置了最小长度、最小值
        if (minLengthRegex.test(validateRuleArr[i]) ||
          minRegex.test(validateRuleArr[i])
        ) {
          // eslint-disable-next-line no-eval
          eval(validateRuleArr[i])
        }

        // 判断设置了验证手机号码
        if (phoneRegex.test(validateRuleArr[i])) {
          phoneBlur()
        }

        // 判断设置了验证身份证号码
        if (cardIDRegex.test(validateRuleArr[i])) {
          cardIDBlur()
        }

        // 判断设置了验证整数
        if (intRegex.test(validateRuleArr[i])) {
          integerBlur()
        }
      }
    }
    // Keyup时验证是否是金额
    function rateKeyup() {
      el.value = (el.value.match(/^\d*(\.?\d{0,1})/g)[0])
      el.dispatchEvent(new Event('input')) //  触发v-model更新
      return true
    }

    // blur时验证是否是金额
    function rateBlur() {
      el.value = (el.value.match(/^\d*(\.?\d{0,1})/g)[0]) === 0 ? '' : Number(el.value.match(/^\d*(\.?\d{0,1})/g)[0])
      el.dispatchEvent(new Event('input'))
      return true
    }
    // Keyup时验证是否是金额
    function moneyKeyup() {
      el.value = (el.value.match(/^\d*(\.?\d{0,2})/g)[0])
      el.dispatchEvent(new Event('input')) //  触发v-model更新
      return true
    }

    // blur时验证是否是金额
    function moneyBlur() {
      el.value = (el.value.match(/^\d*(\.?\d{0,2})/g)[0]) === 0 ? '' : Number(el.value.match(/^\d*(\.?\d{0,2})/g)[0])
      el.dispatchEvent(new Event('input'))
      return true
    }

    // Keyup时验证是否是金额(没有小数点)
    function moneyNoDotKeyup() {
      el.value = (el.value.match(/^[0-9]*$/g))
      el.dispatchEvent(new Event('input')) //  触发v-model更新
      return true
    }

    // blur时验证是否是金额(没有小数点)
    function moneyNoDotBlur() {
      el.value = (el.value.match(/^[0-9]*$/g) === 0 ? '' : Number(el.value.match(/^[0-9]*$/g)[0]))
      el.dispatchEvent(new Event('input'))
      return true
    }

    // Keyup时验证是否是金额
    function moneyZeroKeyup() {
      el.value = (el.value.match(/^\d*(\.?\d{0,2})/g)[0])
      el.dispatchEvent(new Event('input')) //  触发v-model更新
      return true
    }

    // blur时验证是否是金额
    function moneyZeroBlur() {
      el.value = (el.value.match(/^\d*(\.?\d{0,2})/g)[0]) === 0 ? 0 : Number(el.value.match(/^\d*(\.?\d{0,2})/g)[0])
      el.dispatchEvent(new Event('input'))
      return true
    }

    // Keyup时验证是否是面积（目前和金额的一致）
    function areaKeyup() {
      el.value = (el.value.match(/^\d*(\.?\d{0,2})/g)[0])
      el.dispatchEvent(new Event('input'))
      return true
    }

    // blur时验证是否是面积（目前和金额的一致）
    function areaBlur() {
      // let value = el.value.toString();
      // el.value = value.replace(/[^\d.]/gi, ''); // 清除“数字”和“.”以外的字符
      el.value = (el.value.match(/^\d*(\.?\d{0,2})/g)[0]) === 0 ? '' : Number(el.value.match(/^\d*(\.?\d{0,2})/g)[0])
      el.dispatchEvent(new Event('input'))
      return true
    }

    // 最小值验证
    function min(num) {
      if (el.value < num) {
        el.value = num
        el.dispatchEvent(new Event('input'))
        Vue.prototype.$message.warning('最小值不能小于' + num)
        return false
      }

      return true
    }

    // 最大值验证
    function max(num) {
      if (el.value > num) {
        el.value = num
        el.dispatchEvent(new Event('input'))
        Vue.prototype.$message.warning('最大值不能大于' + num)
        return false
      }

      return true
    }

    // 最小长度验证
    function minlength(length) {
      if (el.value.length < length) {
        el.dispatchEvent(new Event('input'))
        Vue.prototype.$message.warning('最小长度不能小于' + length)
        return false
      }

      return true
    }

    // 最大长度进行验证
    function maxlength(length) {
      if (el.value.length > length) {
        el.value = el.value.substring(0, length)
        el.dispatchEvent(new Event('input'))
        return false
      }
      return true
    }

    // keyup时验证是否是正确的手机号码
    function phoneKeyup() {
      el.value = el.value.match(/^1\d*/g) ? el.value.match(/^1\d*/g)[0].substring(0, 11) : el.value.substring(0, el.value.length - 1)
      el.dispatchEvent(new Event('input'))
      return true
    }

    // blur时验证是否是正确的手机号码
    function phoneBlur() {
      const phoneRule = /^[1][0-9]{10}$/
      if (!phoneRule.test(el.value)) {
        el.value = ''
        el.dispatchEvent(new Event('input'))
        Vue.prototype.$message.warning('请输入正确的手机号码！')
        return false
      }

      return true
    }

    // keyup时验证是否是正确的手机号码
    function cardIDKeyup() {
      el.value = el.value.match(/^\d*([0-9Xx]$)/g) ? el.value.match(/^\d*([0-9Xx]$)/g)[0].substring(0, 18) : el.value.substring(0, el.value.length - 1)
      el.dispatchEvent(new Event('input'))
      return true
    }

    // blur时验证是否是正确的手机号码
    function cardIDBlur() {
      const cardIDRule = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/
      if (!cardIDRule.test(el.value)) {
        el.value = ''
        el.dispatchEvent(new Event('input'))
        Vue.prototype.$message.warning('请输入正确的身份证号码！')
        return false
      }

      return true
    }

    // keyup时验证是否是自然数
    function naturalNumberKeyup() {
      el.value = el.value.match(/^[0-9]*$/g)
      el.dispatchEvent(new Event('input'))
      return true
    }

    // keyup时验证是否是正整数
    function positiveIntegerKeyup() {
      el.value = el.value.match(/^\+?[1-9][0-9]*$/g)
      el.dispatchEvent(new Event('input'))
      return true
    }

    // keyup时验证是否是整数
    function integerKeyup() {
      el.value = el.value.match(/^-?\d*$/g)
      el.dispatchEvent(new Event('input'))
      return true
    }

    // Blur时验证是否是整数
    function integerBlur() {
      el.value = el.value.match(/^-?\d+$/g)
      el.dispatchEvent(new Event('input'))
      return true
    }

    // 添加提示信息
    function tipMsg(msg) {
      Vue.$message.warning(msg)
    }
  }
})
