import api from "../../utils/http_request.js"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    detail:{},
    orderStatusEnum: {
      'WAIT_SEND': '待发货',
      'SEND': '待收货',
      'CONFIRM_RECEIPT': '已完成',
      OVER: '已完成'
    },
  },
  getDetail() {


    api.post("/scrm-points-service/front/pointsDomain/exchange/record/detail", {
      rerordId: this.data.id,

    }, {

    }).then(res => {
      if (res.httpStatus >= 550) {}
      console.log(res)
      this.setData({
        detail:res.data
      })
    })

  },
  doReavc(e){
    wx.showModal({
      title:'提示',
      content:'是否确认收货？',
      success:(es)=>{
        if(es.confirm){
          
        let id = e.currentTarget.dataset.id
        api.post("/scrm-points-service/front/pointsDomain/exchange/points/transaction/confirmreceipt", {
          orderId: id,
          userId: app.globalData.userId
        }, {
         
        }).then(res => {
          if (res.httpStatus >= 550) {}
          this.getOrderList()
    
        })
        }  
      }
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
    this.getDetail()
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