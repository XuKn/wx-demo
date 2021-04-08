// pages/search/search.js
import request from '../../utils/request'
let isGet = false //节流
let inputHistoryData = []//历史搜索数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContext:'',//搜索默认文本
    searchList:[],//热搜榜列表
    inputValue:'',//搜索框内容
    searchInputData:[],//热搜数据
    inputHistoryList:[],//搜索历史列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchData()
    this.getSearchListData()
    this.setData({
      inputHistoryList:wx.getStorageSync('history')
    })
  },
  //获取搜索默认值
  async getSearchData(){
    let result = await request('/search/default')
    if (result.code===200) {
      this.setData({
        searchContext:result.data.showKeyword
      })
    }
  },
  //获取搜索数据
  async getSearchListData(){
    let result = await request('/search/hot/detail')
    if (result.code === 200) {
      this.setData({
        searchList : result.data
      })
    }
  },
  //绑定input事件
  handleInputValue(event){
    let inputValue = event.detail.value
    this.setData({
      inputValue
    })
    // 节流
    if (isGet) {
      return
    }
    isGet = true
    setTimeout(() => {
      this.getSearchValue()
      isGet = false
    }, 300);
    
  },
  //获取搜索内容
  
  async getSearchValue(){
    if (this.data.inputValue) {
      let result = await request(`/search?keywords=${this.data.inputValue}&limit=10`)
      if (result.code===200) {
        this.setData({
          searchInputData : result.result.songs
        })
      }
      this.setHistoryData(this.data.inputValue)
    }else{
      this.setData({
        searchInputData : []
      })
    }
  },
  //合并历史数据
  setHistoryData(data){
    if (inputHistoryData.indexOf(data) !== -1){
      inputHistoryData.splice(inputHistoryData.indexOf(data),1)
      inputHistoryData.unshift(data)
    }else{
      inputHistoryData.unshift(data)
    }
    wx.setStorageSync('history', inputHistoryData)
    this.setData({
        inputHistoryList:inputHistoryData
    })  
  },
  // 取消搜索
  cancelBtn(){
    this.setData({
      inputValue:'',
      searchInputData:[]
    })
  },
  // 删除历史记录
  deleteHistory(){
    wx.showModal({
      title: '确定删除吗',
      success:(res)=>{
        if (res.confirm) {
          this.setData({
            inputHistoryList:[]
          })
          wx.removeStorageSync('history')
        }
      }
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