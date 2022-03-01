const setNavFunc=(e,app)=>{
  if(e.scrollTop&&e.scrollTop>200){
    app.store.setState({
      navBkgColor:'#FFFFFF',
      navFontColor:'#292522',
      navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back.png',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#FFFFFF'
    })
    
  }else{
    app.store.setState({
      navBkgColor:'#FF7700',
      navFontColor:'#FFFFFF',
      navBackIcon:'http://img1.bitauto.com/das/chehou_sass/sass_wx/nav-back-white.png',
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#FF7700'
    })
  }
}
module.exports = {
	setNavFunc
}