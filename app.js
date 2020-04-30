//app.js
import api from "./utils/http_request.js"
// let livePlayer = requirePlugin('live-player-plugin')

// 引入SDK核心类
// var QQMapWX = require('./libs/qqmap-wx-jssdk.min.js');

// 实例化API核心类
// var qqmapsdk = new QQMapWX({
//   key: 'QKUBZ-MDHLF-DOVJU-N4ERM-6JSGE-P3BKQ' // 必填
// });


App({

  getUserInfo() {

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {

              let iv = res.iv
              let encryptedData = res.encryptedData
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }




            }
          })
        }
      }
    })

  },

  onShow: function (options) {
    const _self = this
    wx.login({
      success: ({
        code
      }) => {
        if (code) {
          _self.globalData.code = code
          _self.authThird();
        }
      }
    })
  },
  getServerUserInfo(callback) {
    api.get("/user/info", {}).then(res => {
      callback(res)
      console.log('用户信息', res)
    })
  },
  invitationBind() {
    let userid = wx.getStorageSync("userId") || '';
    let reUserCode = wx.getStorageSync("reUserCode") || '';
    if (userid != '' && reUserCode != '') {
      setTimeout(() => {
        api.post("/user/invitation/bind", {
          "invitationCode": reUserCode
        }).then(res => {
          console.log('绑定关系', res)
        })
      }, 1000)
    }

  },
  authThird() {

    // scrm-points-service/
    const urlSortGoods = 'goodsapi'
    const urlSortOrder = 'orderapi'
    const urlSortUser = 'crmapi'
    const urlSortMarket = 'marketingapi'
    api.post("/scrm-user-service/user/wechat/authThird", {
      code: this.globalData.code,
      appId: 'wx142d8ad7fe57a30c'
    }, {
      loading: true
    }).then(res => {
      let {
        user,
        fans,
        SellerAuthWxAttr,
        openid
      } = res.data
      // const user = wx.getStorageSync("token") ? wx.getStorageSync("token") : '';
      wx.setStorageSync('user', user)
      wx.setStorageSync('SellerAuthWxAttr', SellerAuthWxAttr)
      wx.setStorageSync('fans', fans)
      
      if (fans) {
        this.globalData.fansId = fans.id
      }
      if(SellerAuthWxAttr){
        this.globalData.brandId =  SellerAuthWxAttr.brandId
        this.globalData.companyId =  SellerAuthWxAttr.companyId
        this.globalData.storeId =  SellerAuthWxAttr.storeId
        
      }
      if (!user) {
        // wx.reLaunch({
        //   url: '/Auth/member_card/index',
        // })
      }
    }).catch(e => {
      console.log(e)
    })
  },
  onLaunch: function (options) {
    const token = wx.getStorageSync("token") ? wx.getStorageSync("token") : '';
    this.getUserInfo()
  },

  globalData: {
    brandId:null,
companyId:null,
storeId:null,
    fansId:null,
    code: null,
    token: null,
    userId: null,
    userInfo: null
  }
})