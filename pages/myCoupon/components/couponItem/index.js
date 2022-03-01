// pages/myCoupon/components/couponItem/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj:{
      type:Object,
      value:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes:{
    attached(){
      // console.log('打印每一项obj:',this.properties.obj)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    toCouponDetail(){
      wx.navigateTo({
        url: `/pages/myCouponDetail/index?id=${this.properties.obj.templateId}&code=${this.properties.obj.couponCode}`
      })
    },
    handleToMake(){
      wx.navigateTo({
        url: `/pages/couponAvailableGoods/index?id=${this.properties.obj.templateId}&code=${this.properties.obj.couponCode}`
      })
      console.log("去使用。。。")
    }
  }
})
