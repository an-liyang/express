// pages/orderDetail/components/comCarInfo/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status:{
      type:String,
      value:'10'
    },
    objData:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowCouponMask:false
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleClickCoupon(){
      app.store.setState({
        isAnimation:true
      })
      app.store.setState({
        isShowCouponMask:!app.store.getState().isShowCouponMask
      })
    }
  }
})
