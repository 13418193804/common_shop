// Auth/authorization/index.js
import api from "../../utils/http_request.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goNext() {
    wx.navigateTo({
      url: '/Auth/member_info/index',
    })
  },
  getUserInfoPage(e) {

    let params = e.detail

    const _self = this
    params.fansId = app.globalData.fansId
    // return
    api.post("/scrm-user-service/user/wechat/user/info", params, {
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
      this.goNext()
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