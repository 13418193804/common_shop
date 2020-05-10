import api from "../../utils/http_request.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
    defaultAddress: 0,
    receiver: '',
    receiverAddress: '',
    receiverMobile: '',
    id: null,
  },

  receiverChange(e) {
    this.setData({
      receiver: e.detail.value
    })
  },

  receiverAddressChange(e) {
    this.setData({
      receiverAddress: e.detail.value
    })
  },



  receiverMobileChange(e) {
    this.setData({
      receiverMobile: e.detail.value
    })
  },
  defaultAddressChange(e) {
    this.setData({
      defaultAddress: e.detail.value
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  saveAddress() {

    if (
      (this.data.receiver || '') == ''
    ) {
      wx.showModal({
        title: '提示',
        content: '请输入联系人',
        showCancel: false
      })
      return
    }
    if (
      (this.data.receiverMobile || '') == ''
    ) {
      wx.showModal({
        title: '提示',
        content: '请输入联系号码',
        showCancel: false
      })
      return
    }
    if (
      (this.data.receiverAddress || '') == ''
    ) {
      wx.showModal({
        title: '提示',
        content: '请输入地址',
        showCancel: false
      })
      return
    }

    let url = "/scrm-user-service/user/address/add"
    if (this.data.id) {
      url = `/scrm-user-service/user/address/update`
    }
    api.post(url, {
      id: this.data.id,
      brandId: app.globalData.brandId,
      defaultAddress: this.data.defaultAddress,
      postalCode: "",
      receiver: this.data.receiver,
      receiverAddress: this.data.receiverAddress,
      receiverMobile: this.data.receiverMobile,
      region: this.data.region.join(' '),
      userId: app.globalData.userId
    }, {
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res.httpStatus >= 550) {}
      wx.showToast({
        title: '成功',
      })
      wx.navigateBack({
        complete: (res) => {},
      })
     
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
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
    if (this.data.id) {
      this.getAddressInfo()
    }
  },
  getAddressInfo() {
    api.post("/scrm-user-service/user/address/getUserAddressNotPage", {
      id: this.data.id,
      tableuserId: app.globalData.userId
    }, {}).then(res => {
      if (res.httpStatus >= 550) {}
      let data = res.list[0]
      this.setData({
        defaultAddress: data.defaultAddress,
        receiver: data.receiver,
        receiverAddress: data.receiverAddress,
        receiverMobile: data.receiverMobile,
        region: data.region.split(' ')
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