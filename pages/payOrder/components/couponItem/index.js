// pages/myCoupon/components/couponItem/index.js
const app = getApp()
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
      console.log('打印每一项obj:',this.properties.obj)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleSelectCouponItem(e){
      console.log(e.currentTarget.dataset.code)
      if(app.store.getState().payOrderCouponTemporaryClick==e.currentTarget.dataset.code){
        app.store.setState({
          payOrderCouponTemporaryClick:'',
          payOrderCouponTemporaryObj:null
        })
      }else{
        const getCurSelectedObj=app.store.getState().payOderCouponList.filter(item=>{
          return item.couponCode==e.currentTarget.dataset.code
        })[0]
        app.store.setState({
          payOrderCouponTemporaryClick:e.currentTarget.dataset.code,
          payOrderCouponTemporaryObj:getCurSelectedObj
        })
      }
      console.log("当前payOrderCouponTemporaryClick",app.store.getState().payOrderCouponTemporaryClick)
    }
  }
})
