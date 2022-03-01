// pages/orderDetail/components/comVerificationCodeInfo/index.js
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status:{
      type:String,
      value:'20'
    }
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
    handleToCopy(){
      // $state.orderDetailData.writeoffCode
      console.log('复制内容：',app.store.getState().orderDetailData.writeoffCode)
      wx.setClipboardData({
        data: app.store.getState().orderDetailData.writeoffCode,
        success (res) {
          console.log('复制成功：',res)
        }
      })
    }
  }
})
