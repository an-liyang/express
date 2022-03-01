// pages/orderDetail/components/comStoreInfo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    objData:{
      type:Object,
      value:{
        test:'1111'
      }
    },
    // 样式，是否有阴影
    isNoShadow:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes: {
    attached: function() {
      console.log("组件当前数据-------------------：",this.properties.objData)
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
    handleToCall() {
      console.log(this.properties.objData)
      const getPhone=this.properties.objData.tenantAppointmentPhone?this.properties.objData.tenantAppointmentPhone:this.properties.objData.contactWay
      wx.showActionSheet({
          itemList: [getPhone],
          success(res) {
              wx.makePhoneCall({
                  phoneNumber: getPhone
              })
          },
          fail(res) {
              console.log('wx.showActionSheet拉起异常', res.errMsg)
          }
      })
    },
    gotoMap: function (e) {
			const _this=this;
			const latitude = parseFloat(this.properties.objData.tenantAddressLatitude);
			const longitude = parseFloat(this.properties.objData.tenantAddressLongitude);
			wx.openLocation({
				latitude: latitude
				, longitude: longitude
				, name: _this.properties.objData.tenantName,
				address: _this.properties.objData.tenantDetailedAddress
				, success: function (res) {
					console.log(res)
				}
			})
			console.log(e);
	}
  }
})
