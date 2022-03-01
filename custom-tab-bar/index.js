// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
		color: "#A3A09D",
	  selectedColor: "#FF7700",
    list: [
    {
      pagePath: "/pages/servicePage/index",
      text: "服务",
      iconPath: "/images/service/service-icon.png",
      selectedIconPath: "/images/service/service-icon-active.png",
    },
    {
      pagePath: "/pages/myPage/index",
      text: "我的",
      iconPath: "/images/service/my-icon.png",
      selectedIconPath: "/images/service/my-icon-active.png",
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const dataset = e.currentTarget.dataset
      const path = dataset.path
      const index = dataset.index
      // console.log(index,path);
      this.setData({
        selected: index
      })
      wx.switchTab({
        url: path
      })
    }
  }
})
