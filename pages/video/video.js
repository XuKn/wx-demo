// pages/personal/personal.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],//视频导航标签
    navId:'',//此时导航id
    videoGroupData:[],//视频数据
    videoId:'',//视频id
    videoTimeUpdate:[],//视频时长数组
    isRefresh:false,//刷新触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoList()
  },
  // 获取视频导航标签
  async getVideoList(){
    let result = await request('/video/group/list')
    if (result.code===200) {
       let videoGroupList = result.data.slice(0,10)
       this.setData({
       videoGroupList,
       navId:videoGroupList[0].id
    })
      this.getVideoData(this.data.navId)
    }
  },
  // 切换导航
  setActive(event){
    let id = event.target.id
    this.setData({
      navId:id*1,
      videoGroupData:[]
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getVideoData(this.data.navId)
    
  },
  // 获取视频数据
  async getVideoData(id){
    let result = await request('/video/group',{id})
    if (result.code===200) {
       let index =0
       let videoGroupData = result.datas.map(item=>{
       item.id = index++
       return item
    })
    this.setData({
      videoGroupData,
      isRefresh:false
    })
    }
    else{
      wx.reLaunch({
        url: '/pages/Login/Login?noLogin=true',
      });
    }
    wx.hideLoading()
  },
  // 管理视频播放
  handlePlay(event){
    let id = event.target.id
    this.setData({
      videoId:id
    })
    let VideoContext =  wx.createVideoContext(id)
    VideoContext.play()
    let {videoTimeUpdate} =this.data
    let videoItem = videoTimeUpdate.find((item) =>
      item.id === id
    )
    let currentTime = videoItem && videoItem.currentTime
    VideoContext.seek(currentTime)
    
  },
  // 视频播放时长
  handleTimeUpdate(event){
    let id = event.target.id
    let currentTime = event.detail.currentTime
    let TimeUpdateList ={id,currentTime}
    let {videoTimeUpdate} =this.data
    let item = videoTimeUpdate.length && videoTimeUpdate.find((item) => 
        item.id === event.target.id
    )
    if (item) {
      item.currentTime = currentTime
    }else{
      videoTimeUpdate.push(TimeUpdateList)
    }
     this.setData({
      videoTimeUpdate
    }) 

  },
  // 视频播放结束
  handleEnded(event){
    let {videoTimeUpdate} = this.data
    videoTimeUpdate.splice(videoTimeUpdate.findIndex((item) => item.id === event.target.id),1)
  },
  //下拉刷新
  handleRefresh(){
    let id = this.data.navId
    this.getVideoData(id)
  },
  // 上拉触底
  async handleTolower(event){
    let id = event.target.id
    let result = await request('/video/group',{id})
    let {videoGroupData} = this.data
    result.datas.forEach((item) => {
      videoGroupData.push(item)
    })
    this.setData({
      videoGroupData
    })
  },
  //跳转搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search'
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
      this.getVideoData(this.data.navId)
      wx.stopPullDownRefresh()
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