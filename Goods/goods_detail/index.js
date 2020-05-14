import api from "../../utils/http_request.js"
const app = getApp()
// Goods/goods_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    goodsId: null,
    goodsDetail: {},
    windowWidth: 0,
    num:1
  },
  changeNum(e){
    this.setData({
      num : e.detail
    })
  },
  goConfirm(){
    app.globalData.confirmGoodId = this.data.goodsId
    app.globalData.confirmNum = this.data.num,
    app.globalData.confirmRemark = '',
    app.globalData.confirmAddressId = null,
    this.setData({
      show:false
    })
    wx.navigateTo({
      url: `/Trade/confirm/index`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsId: options.goodsId
    })
    const _self = this
    wx.getSystemInfo({
      success(res) {
        _self.setData({
          windowWidth: res.windowWidth,
        })
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
    this.getGoodsDetail()
  },
  getGoodsDetail() {
    api.post("/scrm-points-service/front/pointsDomain/goods/detail", {
      goodsId: this.data.goodsId
    }, {

    }).then(res => {
      if (res.httpStatus >= 550) {}
      // res.data.goodsDetail =res.data.goodsDetail.replace('<img' , `<img style='width:100%' `)
      this.setData({
        goodsDetail: res.data
      })
    })
  },
  actionOpen(){
    this.setData({
      show:true
    })
  },
  actionClose(){
   this.setData({
     show:false
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