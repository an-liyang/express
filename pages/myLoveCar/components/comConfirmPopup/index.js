// components/comConfirmPopup/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 展示弹框
    show: { 
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 取消
    onClose(){
      this.triggerEvent('onClose')
    },
    // 确认
    onOk(){
      this.triggerEvent('onOk')
    }
  }
})
