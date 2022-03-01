// components/comCouponBottomMask/index.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是够展示说明
    isShowMask: {
      type: Boolean,
      value: true
    },
    // 是否展示无优惠券
    isShowNoData: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
    isAnimation:true
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      app.store.setState({
        isAnimation:true
      })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
      // app.store.setState({
      //   isAnimation:true
      // })
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    clickShuoMing(){
      this.setData({
        isShow:!this.data.isShow
      })
    },
    handleClose(){
      app.store.setState({
        isAnimation:false
      })
      setTimeout(() => {
        app.store.setState({
          isShowCouponMask:false
        })
      },200)
      
    },
    preventClick(){
      return
    }
  }
})
