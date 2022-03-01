// pages/orderDetail/components/comOrderStatusInfo/index.js
import{calcTimeDistance}from './../../../../utils/util.js'
const app=getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status:{
      type:String,
      value:'80'
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
    timer:null
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      console.log('订单详情页状态：',app.store.getState().orderDetailData)
      const _this=this;
      app.store.setState({
        expireTime:''
      })
      console.log(_this.properties.status,app.store.getState().orderDetailData)
      setTimeout(()=>{
        if(_this.properties.status=='10'){
          _this.timer=setInterval(()=>{
            if(app.store.getState().expireTime=='00:00:00'){
              clearInterval(_this.timer)
            }
            app.store.setState({
              expireTime:calcTimeDistance(app.store.getState().orderDetailData.orderExpireTime)
            })
            console.log("当前倒计时：",calcTimeDistance(app.store.getState().orderDetailData.orderExpireTime))
          },1000)
        }
      },500)
     },
    moved: function () { 
      if(this.properties.status=='10'){
        clearInterval(this.timer)
        this.timer = null
        app.store.setState({
          expireTime:null
        })
      }
    },
    detached: function () {
      if(this.properties.status=='10'){
        clearInterval(this.timer)
        this.timer = null
        app.store.setState({
          expireTime:null
        })
      }
     },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
