import request from "../../utils/request";

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],//轮播图容器
    recommendMusic:[],//推荐歌单
    topList:[],//排行榜
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function () {
    // 轮播图
    let bannerData = await request('/banner',{type:2})
    this.setData({
      banners:bannerData.banners
    })
    //推荐歌单
    let recommendData = await request('/personalized',{limit:10})
    this.setData({
      recommendMusic:recommendData.result
    })
    //排行榜
    let index = 0
    let topList = []
    while (index<5) {
      let topLists = await request('/top/list',{idx:index++})
      topList.push(topLists.playlist)
      this.setData({
        topList
      })
    }
  },
  toRecommendSong(){
    wx.navigateTo({
      url: '/songPackages/pages/recommendSong/recommendSong'
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