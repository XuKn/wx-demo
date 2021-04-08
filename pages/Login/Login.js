// pages/Login/Login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',//手机号
    password:''//密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {noLogin} = options
    if (noLogin) {
      wx.showToast({
        title: '请登录',
      })
    }
  },
  // 获取用户输入
  getValue(event){
    let type = event.target.id
    this.setData({
      [type] :event.detail.value
    })
  },
  //登录验证 
  async Login(){
    let {phone,password} = this.data
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }
    let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    let passwordReg = /^\w{6,10}$/
    if (!passwordReg.test(password)) {
      wx.showToast({
        title: '密码格式不正确',
        icon: 'none'
      })
      return
    }
    let result = await request('/login/cellphone',{phone,password,isLogin:true})
    if (result.code===200) {
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
      // 存储用户信息
      wx.setStorageSync('userinfo',JSON.stringify(result.profile))
      //跳转页面
      wx.reLaunch({
        url: '/pages/personal/personal',
      });
      return
    }
    if (result.code===400) {
      wx.showToast({
        title: `${result.msg}`,
        icon: 'none'
      })
    }
    if (result.code === 502) {
      wx.showToast({
        title: `${result.msg}`,
        icon: 'none'
      })
    }
    else{
      wx.showToast({
        title: `${result.msg}`,
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})