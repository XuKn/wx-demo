// pages/personal/personal.js
let startY = 0 //开始鼠标位置
let EndY = 0 //移动后鼠标位置
let lastY = 0 //最终移动距离
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTransform:'translateY(0)',
    userTransition:'',
    userinfo:{},//用户信息
    recordList:[],//播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo !== '') {
      this.setData({
      userinfo:JSON.parse(userinfo)
    })
    this.playRecord(this.data.userinfo.userId)
    }
  },
  //用户播放记录
  async playRecord(userId){
    let result = await request('/user/record',{uid:userId,type:0})
    if (result.code===200) {
      let index = 0
      let recordList = result.allData.splice(0,10).map((item) => {
        item.id = index++
        return item
      })
      this.setData({
        recordList
      })
    }
  },
  handleTouchStart(event){
    this.setData({
      userTransition:''
    })
    startY = event.touches[0].clientY
  },
  handleTouchMove(event){
    EndY = event.touches[0].clientY
    lastY =EndY- startY
    if (lastY<=0) {
      return
    }
    else if (lastY >= 80) {
      lastY = 80
    } 
    this.setData({
      userTransform:`translateY(${lastY}rpx)`
    })
  },
  handleTouchEnd(){
    this.setData({
      userTransition:'transform 1s',
      userTransform:'translateY(0)'
    })
  },
  toLogin(){
    wx.navigateTo({
      url: '/pages/Login/Login'
    })
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