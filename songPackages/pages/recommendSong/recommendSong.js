// pages/recommendSong/recommendSong.js
import request from '../../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mouth:'',//月份
    date:'',//日期
    recommend:[],//每日推荐歌曲
    index:0,//当前歌曲的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNowDate()
    this.getRecommendSongList()
  },
  // 获取此时时间
  getNowDate(){
    this.setData({
      mouth:new Date().getMonth()+1,
      date:new Date().getDate()
    })
  },
  // 获取每日推荐列表
  async getRecommendSongList(){
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      let result = await request('/recommend/songs')
      this.setData({
        recommend:result.recommend
      })
    }else{
      wx.showToast({
        title: '登录信息获取失败，请重新登录',
      })
      wx.reLaunch({
        url: '/pages/Login/Login'
      });
    }
  },
  // 跳转页面到详情
  goSongDetail(event){
    let id = event.currentTarget.id
    let index = event.currentTarget.dataset.index
    this.setData({
      index
    })
      wx.navigateTo({
      url: `/songPackages/pages/songDetail/songDetail?ids=${id}`
    })
    //订阅
    PubSub.subscribe('swichType',((msg, data)=>{
      const {recommend} = this.data
      if (data==='next') {
        if (index=== recommend.length-1) {
          index = -1
        }
        //index += 1
        //随机数
        index = Math.floor(Math.random()*30)
      }
      else if (data==='previous') {
        if (index===0) {
          index = recommend.length
        }
        index -= 1
      }
      this.setData({
        index
      })
      let musicId = recommend[this.data.index].id
      //发布
      PubSub.publish('musicDetail',musicId)
    }))
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