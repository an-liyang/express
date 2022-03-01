// components/comSubmitOrder/components/comCarKey/index.js
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    keyList:[
      ['京', '津', '沪', '渝', '苏', '浙', '豫'], 
      ['粤', '川', '陕','冀', '辽', '吉', '皖'], 
      ['闽', '鄂', '湘', '鲁', '晋', '黑','赣'], 
      ['贵', '甘', '桂', '琼', '云', '青', '蒙']
    ],
    curSelectedVal:''
  },
  lifetimes: {
    attached: function() {
      console.log('attached。。。')
      this.setData({
        curSelectedVal:app.store.getState().carKeyDefaultVal
      })
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
    // 防止点击空白处隐藏键盘
    catchtapFalse(){
      return false
    },
    onConfirm(){
      app.store.setState({
        carKeyDefaultVal: this.data.curSelectedVal,
        isShowCarKey: false
      });
      this.triggerEvent('onConfirm',false)
    },
    handleToggle(e){
      console.log(e.currentTarget.dataset.name)
      this.setData({
        isShowCarKey: true,
        curSelectedVal:e.currentTarget.dataset.name
      })
    }
  }
})
