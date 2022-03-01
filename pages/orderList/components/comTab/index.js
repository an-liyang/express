// components/comTab/index.js
// import {orderNumber} from './../../../../apis/orderRelationApis.js'
const app = getApp()
Component({
  // 启用插槽
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    unPaidNumber:'',
    unServiceNumber:''
  },
  lifetimes: {
    attached: function () {
      app.store.setState({
        'orderListParams.pageNo':1,
        'orderListParams.total':null,
        orderListData:Array.from([])
      })
      this.handleOrderList()
      this.handleGetNumber()
    },
  },
  methods: {
    touchMove(){
      return true;
    },
    // handleGetNumber(){
    //   const _this =this;
    //   orderNumber({name:'wu'}).then(res=>{
    //     console.log(res)
    //     if(res.Success){
    //       _this.setData({
    //         unPaidNumber:res.Data.unPaidNumber,
    //         unServiceNumber:res.Data.unServiceNumber
    //       })
    //     }
    //   }).catch(err=>{
    //     console.log("获取数量失败",err)
    //   })
    // },
    async handleToggleTab(e){
      if(e.currentTarget.dataset.type==app.store.getState().active){
				return;
			}
      app.store.setState({
        isOrderLoad:false,
        isRequest: false,
        isShowLoading:true,
		    isCurNoNetwork:false,
        'orderListParams.pageNo':1,
        'orderListParams.total':null,
        orderListData:Array.from([])
      })
      await this.judgeNetwork()
      this.handleOrderList(e.currentTarget.dataset.type)
    }
  }
})
