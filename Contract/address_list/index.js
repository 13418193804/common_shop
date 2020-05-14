import api from "../../utils/http_request.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirm: null,
    addressList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      confirm: options.confirm
    })
  },

  selectAddress(e) {
    if (!this.data.confirm) {

      return
    }
    let id = e.currentTarget.dataset.id
    app.globalData.confirmAddressId = id
    wx.navigateBack({
      complete: (res) => {},
    })


  },
  doDelete(e) {
    let id = e.currentTarget.dataset.id

    const _self = this
    wx.showModal({
      title: '提示',
      content: '确认删除该收获地址？',
      success: (e) => {
        if (e.confirm) {

          api.get("/scrm-user-service/user/address/del", {
            id: id,//参数
          }, {
            header: {
              'content-type': 'application/json'
            },//默认是字符类型  修改头为JSON类型 （选传）
          }).then(res => {
            if (res.httpStatus >= 550) {}
            wx.showToast({
              title: '成功',
            })
            _self.getAddressList()

          })


        }
      }

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  doEdit(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/Contract/address/index?id=${id}`,
    })
  },
  onChange(e) {
    let id = e.currentTarget.dataset.id
    api.get("/scrm-user-service/user/address/default", {
      id: id,
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
      this.getAddressList()

    })

  },
  doAdd() {
    wx.navigateTo({
      url: '/Contract/address/index',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAddressList()
  },
  getAddressList() {



    api.get("/scrm-user-service/user/address/get", {
      userId: app.globalData.userId
    }, {
      header: {
        'content-type': 'application/json'
      }
    }).then(res => {
      if (res.httpStatus >= 550) {}
      console.log(res)
      this.setData({
        addressList: res.data
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