// Auth/authorization/index.js
import api from "../../utils/http_request.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getAuthorization(e) {
    console.log(e)
    if((e.detail.iv||'')=='' || (e.detail.encryptedData || '')=='' ){
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 1500,
      })
      return 
    }
let params = e.detail 
    params.fansId = app.globalData.fansId
    params.brandId = app.globalData.brandId
    params.storeId = app.globalData.storeId
    params.companyId = app.globalData.companyId
    const _self = this
          api.post("/scrm-user-service/user/wechat/login", params, {
            loading: true
          }).then(res => {
            if (res.httpStatus >= 550) {
              wx.showToast({
                title: '授权失败',
                icon: 'none',
                duration: 1500,
              })
              return
            }
            wx.showToast({
              title: '授权成功',
              duration: 1500,
              mask:true
            })
           setTimeout(()=>{
            wx.reLaunch({
              url: '/pages/personal/index',
            })
           },1500)
          }).catch(e => {
            console.log(e)
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