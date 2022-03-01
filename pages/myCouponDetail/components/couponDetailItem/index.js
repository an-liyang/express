// pages/myCouponDetail/components/couponDetailItem/index.js
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
  lifetimes:{
    attached(){
      console.log("个人券详情：",this.properties.obj)
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

  }
})
