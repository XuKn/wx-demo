// pages/songDetail/songDetail.js
import request from '../../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//音乐播放
    songDetail:{},//音乐详情
    musicUrl:'',//音乐地址
    musicId :'',//音乐id
    duration:'00:00',//音乐总时长
    currentTime :'00:00',//当前播放时间
    currentWidth:0,//实时进度条长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.ids
    this.setData({
      musicId:id
    })
    this.appInstance = getApp()
    //获取音乐详情
    this.getSongDetail(id)
    //音乐是否播放
    if (this.appInstance.globalData.isPlay && this.appInstance.globalData.musicId === id ) {
      this.setData({
        isPlay:true
      })
    }

    this.BackgroundAudioManager = wx.getBackgroundAudioManager();
    //监听背景音频暂停事件
    this.BackgroundAudioManager.onPause(()=>{
      this.changeMusic(false)
    })
    //监听背景音频播放事件
    this.BackgroundAudioManager.onPlay(()=>{
      this.appInstance.globalData.musicId = id
      this.changeMusic(true)
    })
    //监听背景音频停止事件
    this.BackgroundAudioManager.onStop(()=>{
      this.changeMusic(false)
    })
    //监听背景音频自然播放结束
    this.BackgroundAudioManager.onEnded(()=>{
      //播放下一首 随机
      // PubSub.publish('swichType','next')
      this.setData({
        currentWidth:0,
        currentTime:'00:00'
      })
      //自动播放
      const {musicId,musicUrl} = this.data
      this.getMusicUrl(true,musicId,musicUrl)
    })

  },
  //改变音乐播放函数
  changeMusic(isPlay){
    //储存在App实例中
    this.setData({
      isPlay
    })
    this.appInstance.globalData.isPlay=isPlay
  },
  // 获取音乐详情信息
  async getSongDetail(id){
    let result = await request(`/song/detail?ids=${id}`)
    
    //音乐总时长
    let duration = moment(result.songs[0].dt).format('mm:ss');
    //音乐播放监听
    this.BackgroundAudioManager.onTimeUpdate(()=>{
      let currentTime = moment(this.BackgroundAudioManager.currentTime*1000).format('mm:ss')
      //实时进度条长度
      let currentWidth = this.BackgroundAudioManager.currentTime/this.BackgroundAudioManager.duration*450
      this.setData({
        //音乐播放时长
        currentTime,
        currentWidth
      })

    })
    this.setData({
      songDetail:result.songs[0],
      duration
    })
    let title = this.data.songDetail.name
    // 动态设置标题值
    wx.setNavigationBarTitle({
      title
    });
    
  },
  // 播放按钮
  musicPlay(){
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    const {musicUrl,musicId} = this.data
    this.getMusicUrl(isPlay,musicId,musicUrl)
  },
  // 获取歌曲地址
  async getMusicUrl(isPlay,id,musicUrl){
    
    //判断是否播放歌曲
    if (isPlay) {
      if (!musicUrl) {
        let result = await request(`/song/url?id=${id}`)
        this.setData({
          musicUrl:result.data[0].url
        })
      }
      //音乐播放地址
      this.BackgroundAudioManager.src = this.data.musicUrl
      this.BackgroundAudioManager.title = this.data.songDetail.name
    }else{
      this.BackgroundAudioManager.pause()
    }
  },
  //切换音乐
  handleSwich(event){
    let tag = event.target.id
    //发布
    PubSub.publish('swichType',tag)
    //订阅
    PubSub.subscribe('musicDetail',(msg,data)=>{
      let musicId = data
      //切换时先停止上一个播放歌曲
      this.BackgroundAudioManager.pause()
      //获取详情
      this.getSongDetail(musicId)
      //自动播放
      this.getMusicUrl(true,musicId)
      this.setData({
        musicId
      })
      //取消订阅
      PubSub.unsubscribe('musicDetail')
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