import api from "../../utils/http_request.js"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getActList()
  },
  getActList() {
    const _self = this

    api.post("/scrm-promotion-service/front/promotionDomain/promotion/list", {
      brandId: app.globalData.brandId,
      page_no: 1,
      page_size: 20,
    }, {}).then(res => {

      if (res.httpStatus >= 550) {}
      console.log(res)
      _self.setData({
        actList: res.data.list.map(e => {
          return {
            ...e,
            endTime: e.endTime.substring(0, 16),
            startTime: e.startTime.substring(0, 16),
          }
        })
      })
    })
  },
  goActivity(e){
   let  promotionId =e.currentTarget.dataset.promotionid
      wx.navigateTo({
        url: `/Activity/activity/index?promotionId=${promotionId}`,
      })
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