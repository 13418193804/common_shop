import api from "../../utils/http_request.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    confirmRemark: '',
    goodsId: null,
    confirmNum: null
  },
  confirmRemarkChange(e) {
    this.setData({
      confirmRemark: e.detail.value
    })
  },

  goAddAddress() {
    wx.navigateTo({
      url: '/Contract/address_list/index?confirm=true',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      goodsId: app.globalData.confirmGoodId,
      confirmNum: app.globalData.confirmNum,
      confirmRemark: app.globalData.confirmRemark
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
    
    this.getAddress()

  },
  goAddressList(){
    wx.navigateTo({
      url: '/Contract/address_list/index?confirm=true',
    })
  },
  getAddress() {
let params = {
  tableuserId: app.globalData.userId
  
}
      if(!app.globalData.confirmAddressId){
        params.defaultAddress = true
      }else{
        params.id = app.globalData.confirmAddressId
      }
    api.post("/scrm-user-service/user/address/getUserAddressNotPage", params, {

    }).then(res => {
      if (res.httpStatus >= 550) {}
      console.log(res)
      this.setData({
        address: res.list[0] ? res.list[0] : null
      })
    })
  },

  payOrder() {
    const _self = this
    if (!this.data.address) {
      wx.showModal({
        title: '提示',
        content: '还没有地址，是否去新增地址？',
        success(e) {
          console.log(e)
          if (e.confirm) {
            _self.goAddAddress()
            return
          }
        }
      })
      return
    }


    api.post("/scrm-points-service/front/pointsDomain/exchange/points/transaction", {
      addressId: this.data.address.id,
      channelName: app.globalData.channelType,
      channelType: app.globalData.channelType,
      brandId: app.globalData.brandId,
      goodsId: this.data.goodsId,
      goodsNum: this.data.confirmNum,
      remark: this.data.confirmRemark,
      storeId: app.globalData.storeId,
    }, {}).then(res => {
      if (res.code != 0) {
        wx.showModal({
          title:'提示',
          content:res.msg,
        })
        return
      }
      wx.showToast({
        title: '成功',
      })
      console.log(res)
    })

  },

  getGoodsDetail() {
    api.post("/scrm-points-service/front/pointsDomain/goods/detail", {
      goodsId: this.data.goodsId
    }, {

    }).then(res => {
      if (res.httpStatus >= 550) {}
      this.setData({
        goodsDetail: res.data
      })
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