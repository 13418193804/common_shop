// PersonalContract/index/index.js
import api from "../../utils/http_request.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrayTmplIds:[],
    totalUsageBalance: 0,
    windowWidth: 0,
    goodsList: [],
    capsuleTop: 0,
    customBar: 0,
    capsuleHeight: 0,
    userInfo: '',
    accountBalance: '',
    loginName: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    token: null,
    user: {},
    menuList: [{
      icon: 'icon-shangcheng1',
      name: '积分商城',
      color: '#333333',
      url: ''
    }, {
      icon: 'icon-liwu',
      name: '互动活动',
      color: '#333333',
      url: '/Activity/activity_list/index'
    }, {
      icon: 'icon-shoucang',
      name: '我的收藏',
      color: '#333333',
      url: ''
    }, {
      icon: 'icon-dingdan',
      name: '我的订单',
      color: '#333333',
      url: '/Contract/order_list/index'
    }, ]
  },

  requestSubscribeMessage() {
 
    wx.requestSubscribeMessage({
      tmplIds: ['d_E_g0ANZt4CLvGUESwL7u4e3poX2Ptxtzz8I8Q2u9M'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
      success(res) {
        console.log(res) //'accept'表示用户接受；'reject'表示用户拒绝；'ban'表示已被后台封禁

      },
      fail(res) {
        console.log(res)
      }
    })
},

goMenu(e) {
  let url = e.currentTarget.dataset.url

  if ((url || '') == '') {
    wx.showToast({
      title: '敬请期待...',
      icon: 'none'
    })
  }
  wx.navigateTo({
    url: url,
  })

},
/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
  // this.initInfo()
  const _self = this
  wx.getSystemInfo({
    success(res) {
      let obj = wx.getMenuButtonBoundingClientRect()
      _self.setData({
        capsuleTop: obj.top,
        capsuleHeight: obj.height, //胶囊宽度
        customBar: obj.bottom + obj.top - res.statusBarHeight,
        windowWidth: res.windowWidth
      })
    }
  })


},
goGoodsDetail(e) {
  let goodsId = e.currentTarget.dataset.goodsid
  wx.navigateTo({
    url: `/Goods/goods_detail/index?goodsId=${goodsId}`,
  })
},

initInfo() {
  if (app.globalData.userInfo) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
  }
  if (wx.getStorageSync("loginName")) {
    this.setData({
      loginName: wx.getStorageSync("loginName")
    })
  }
  this.setData({
    token: wx.getStorageSync("token") ? wx.getStorageSync("token") : ''
  })
},
/**
 * 生命周期函数--监听页面初次渲染完成
 */
onReady: function () {


},
goWallet(){
  wx.navigateTo({
    url: '/Contract/wallet/index',
  })
},
/**
 * 生命周期函数--监听页面显示
 */
onShow: function () {
  const user = wx.getStorageSync("user") ? wx.getStorageSync("user") : {};
  const _self = this
  this.setData({
    user: user
  })
  this.getGoodsList()
  this.getWallet()
  this.getTemplate()
},

getTemplate(){
  api.post("/scrm-user-service/PYgenerate/Backstage/SettingMiniappTemplateByappidView/getSettingMiniappTemplateByappidViewNotPage", {
    appid: app.globalData.appId
  }, {}).then((res) => {
     this.setData({
      arrayTmplIds:res.data.list.map(e=>e.templateId)
     })
    }
  )
},
getWallet() {
  const _self = this

  api.post("/scrm-payment-service/payment/wallet/portal", {
    brandId: app.globalData.brandId,
    userId: app.globalData.userId
  }, {}).then(res => {

    if (res.httpStatus >= 550) {}
    console.log(res)
    this.setData({
      totalUsageBalance: res.data.wallet.totalUsageBalance
    })
  })


},
getGoodsList() {
  api.post("/scrm-points-service/front/pointsDomain/goods/list", {
    brandId: app.globalData.brandId,
    pageNo: 0,
    pageSize: 10
  }, {

  }).then(res => {
    if (res.httpStatus >= 550) {}
    this.setData({
      goodsList: res.data.list,
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


goRechargeList: function () {
  wx.navigateTo({
    url: '/PersonalContract/recharge_list/index'
  })
},
goBuyList: function () {
  wx.navigateTo({
    url: '/PersonalContract/buy_list/index'
  })
},
goOrderList: function () {
  wx.navigateTo({
    url: '/PersonalContract/order_list/index'
  })
},
goRecharge: function () {
  wx.navigateTo({
    url: '/PersonalContract/recharge/index'
  })
},
neverLoad() {
  wx.showToast({
    title: "敬请期待！",
    icon: 'none',
    duration: 3000,
  })
},
goInvite: function () {
  wx.navigateTo({
    url: '/PersonalContract/invite/index'
  })
},
goExchange: function () {
  wx.navigateTo({
    url: '/PersonalContract/exchange/index'
  })
},

goStationList: function () {
  wx.navigateTo({
    url: '/PersonalContract/station_list/index'
  })
},

querybyuserid: function () {
  api.post("/front/user/wallet/query", {}).then(res => {
    this.setData({
      accountBalance: res.accountBalance
    })
  }).catch(e => {
    console.log(e)
  })
},
doLogin(code, encryptedData, iv) {
  let parm = {}
  parm.appId = 'wxbb171a4508d8980e';
  parm.code = code;
  parm.encryptedData = encryptedData;
  parm.iv = iv;
  if (app.globalData.userInfo) {
    parm.nickName = app.globalData.userInfo.nickName;
    parm.avatarUrl = app.globalData.userInfo.avatarUrl;
    parm.sex = app.globalData.userInfo.gender;
  }
  api.post("/front/user/user/login", parm, {
    header: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }).then(res => {
    console.log(res)
    wx.setStorageSync('token', res.token)
    wx.setStorageSync('userId', res.userId)
    wx.setStorageSync('loginName', res.loginName)
    this.initInfo()
  }).catch(e => {
    console.log(e)
  })
},

getPhoneNumber(e) {
  let self = this
  let encryptedData = e.detail.encryptedData
  let iv = e.detail.iv
  // 登录
  wx.login({
    success: loginRes => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      self.doLogin(loginRes.code, encryptedData, iv)
    }
  })
},
})