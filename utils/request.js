// 请求功能函数
import config from './config'
export default  (url,data={},method='GET') => {
  return new Promise((resolve,reject) => {
    wx.request({
      url:config.Phoneurl+url,
      data,
      method,
      header:{
        cookie :wx.getStorageSync('cookies')
      },
      success: (res)=> {
        if (data.isLogin) {
          let cookies = res.cookies.find(item=> item.indexOf('MUSIC_U')!== -1)
          wx.setStorageSync('cookies', cookies)
        }
        resolve(res.data)
      },
      fail: (err)=> {
        reject(err)
      }
    })
  })
  // 0: "__csrf=9f03eb7e29feaa5d74cd1fd69c821145; Max-Age=1296010; Expires=Tue 23 Feb 2021 07:31:28 GMT; Path=/;"
  // 1: "MUSIC_U=7cd8b1ff98120bd2e79bf78d5ce4da36867589a7201f8ac38f3624250e1b4f0d33a649814e309366; Max-Age=1296000; Expires=Tue 23 Feb 2021 07:31:18 GMT; Path=/;"
  // 2: "NMTID=00OEiQNDD_feJhXBEKIsVGcsThCMNEAAAF3gI1H2Q; Max-Age=315360000; Expires=Thu 6 Feb 2031 07:31:18 GMT; Path=/;"
  // 3: "__remember_me=true; Max-Age=1296000; Expires=Tue 23 Feb 2021 07:31:18 GMT; Path=/;"
}