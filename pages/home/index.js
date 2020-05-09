import api from "../../utils/http_request.js"


const app = getApp()
Page({
  data: {
    goodsList: [],
    activeCat: null,
    catList: [],
    capsuleHeight: 0,
    searchWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    windowHeight: 0,
    windowWidth: 0, //屏幕宽度
    capsuleWidth: 0, //胶囊宽度
    capsuleTop: 0,
    invitationReward: 0.00,
    invitationNum: 0.00,
    userId: null,
    openId: null,
    netWorkObj: {},
    vendorEnum: {
      CNPC: '中石油',
      SINOEPC: '中石化'
    },
    depositLimitCycleEnum: {
      'YEAR': '年',
      'MONTH': '月',
      'DAY': '天',
      'HOUR': '小时',
    },
    oilList: [],
    stationModel: false,
    selectCityModel: false,
    stationObjdect: {},
    stationEnvironmentEnum: {
      OUTDOOR: '露天',
      INDOOR: '室内'
    },
    rechargeModel: false,
    stationList: [],
    latitude: null,
    longitude: null,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    region: ['广东省', '广州市', '海珠区'],
    latitude: 23.099994,
    longitude: 113.324520,
    polylineList: [],
    city: '--',
    regionName: "--",
    cityList: [
      "新疆", "江苏", "广东", "江西"
    ],
    cityActiveId: 0,
    refuelModel: false,
    loginName: '',
    bindModel: false,
    oilCardId: '',
    currentSwiperIndex: 0,
    rechargeAmount: 100,
    rechargeObj: {},
    oilTypeEnum: {
      GASOLINE: '汽油',
      DIESEL: '柴油'
    },
  },
  replaceStr(str) {
    return str.replace(/(.{4})/g, '$1 ');
  },
  pushRechargeAmount(e) {
    if (this.data.rechargeAmount >= (this.data.oilList[this.data.currentSwiperIndex].canRechargeAmount) || 0) {
      wx.showToast({
        title: "可充金额不足",
        icon: 'none',
        duration: 1500,
      })
      return
    }
    this.setData({
      rechargeAmount: this.data.rechargeAmount += 100
    })
  },
  removeRechargeAmount(e) {
    if (this.data.rechargeAmount <= 100) {
      wx.showToast({
        title: "不能再少啦！",
        icon: 'none',
        duration: 1500,
      })
      return
    }
    this.setData({
      rechargeAmount: this.data.rechargeAmount -= 100
    })
  },
  inputOilCardId(e) {
    this.setData({
      oilCardId: e.detail.value.replace(/\s+/g, "")
    })
  },

  onSwiperChange(e) {
    let current = e.detail.current
    if (current != this.data.oilList.length) {
      this.setData({
        currentSwiperIndex: current
      })
      this.getRechargeCardData(this.data.currentSwiperIndex)
    }
  },
  openBindModel() {
    this.setData({
      bindModel: true,
      inputOilCardId: ''
    })
  },
  getPhoneNumber(e) {
    console.log(e)
    if ((e.detail.iv || '') == '' && (e.detail.encryptedData || '') == '') {
      wx.showToast({
        title: "授权失败",
        icon: 'none',
        duration: 1500,
      })
      return
    }
    const _self = this
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          console.log("code", res.code,
            "encryptedData", e.detail.encryptedData,
            "iv", e.detail.iv)
          // return
          api.post("/user/warrant/login", {
            "code": res.code,
            "encryptedData": e.detail.encryptedData,
            "iv": e.detail.iv
          }, {
            loading: true
          }).then(res => {
            if (res.status >= 550) {
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
            })
            console.log('授权res', res)
            wx.setStorageSync('token', res.token)
            wx.setStorageSync('invitationCode', res.invitationCode) //自己的code
            wx.setStorageSync('invitationReward', res.invitationReward) //推荐人的code
            wx.setStorageSync('openId', res.openId)
            wx.setStorageSync('userId', res.userId)
            wx.setStorageSync('loginName', res.loginName)
            _self.setData({
              userId: res.userId,
              openId: res.openId
            });
            _self.getOilCardList();
            app.invitationBind()


          }).catch(e => {
            console.log(e)
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  closeBindModel() {
    this.setData({
      bindModel: false,
      oilCardId: ''
    })
  },
  openRefuelModel() {
    this.setData({
      refuelModel: true
    })
  },

  closeRefuelModel() {
    this.setData({
      refuelModel: false
    })
  },

  closeSelectCityModel() {
    this.setData({
      selectCityModel: false
    })
  },
  closeRechargeModel() {
    this.setData({
      rechargeModel: false
    })
  },
  openRechargeModel(e) {

    let rulesId = e.currentTarget.dataset.id
    let rechargeObj = this.data.oilList[this.data.currentSwiperIndex].forSale.filter(es => {
      return es.rulesId == rulesId
    })[0]
    this.setData({
      rechargeModel: true,
      rechargeObj: rechargeObj
    })

    app.getServerUserInfo(u => {
      this.setData({
        invitationRewardStr: u.invitationReward.toFixed(2),
        invitationReward: u.invitationReward,
        invitationNum: u.invitationNum
      })
    })

  },
  selectCity(e) {
    this.setData({
      cityActiveId: e.currentTarget.dataset.activeid
    })
  },
  onReady: function (e) {







  },



  onShow: function () {
    const _self = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    _self.getCatList()

  },
  getCatList() {
    api.post("/scrm-points-service/front/pointsDomain/goods/category/list", {
      brandId: app.globalData.brandId
    }, {

    }).then(res => {
      if (res.httpStatus >= 550) {}
      this.setData({
        catList: res.data,
        activeCat: res.data[0] ? res.data[0].id : null
      })
      this.getGoodsList()
    })
  },
  changeTabs(e) {
    this.setData({
      activeCat: e.detail.name
    })
    this.getGoodsList()
  },
  getGoodsList() {
    api.post("/scrm-points-service/front/pointsDomain/goods/list", {
      brandId: app.globalData.brandId,
      categoryId: this.data.activeCat,
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
  getNetWorkList() {
    api.get("/network/list", {
      latitudeForm: app.globalData.lat,
      longitudeForm: app.globalData.lat
    }).then(res => {
      let result = res.list[1] || {}
      if (result.id) {
        result.oilPrice = result.oilPrice.toFixed(2)
      }
      this.setData({
        netWorkObj: result
      })

    }).catch(e => {
      console.log(e)
    })
  },
  getOilCardList() {
    if ((this.data.userId || '') != '') {
      api.get("/front/oilCard/list?status=Y", {}, {}).then(res => {
        console.log('---油卡列表', res)


        if (res.length > 0) {
          // this.setData({
          //   oilList: 
          // });

          this.getRechargeCardData(this.data.currentSwiperIndex, res);
        }
      }).catch(e => {
        console.log(e)
      })
    }

  },
  doRechargeCard() {
    api.post("/front/depositCard/recharge", {
      amount: this.data.rechargeAmount,
      "oilCardId": this.data.oilList[this.data.currentSwiperIndex].id,
    }).then(res => {
      if (res.status >= 550) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
        return
      }
      this.getOilCardList();
      // this.getRechargeCardData(this.data.currentSwiperIndex)
      this.closeRefuelModel();
      this.setData({
        rechargeAmount: 0
      })
      wx.showToast({
        title: '已提交充值，请在充值记录中查看状态',
        icon: "none",
        duration: 3000,
      })

    })
  },
  // 获取用户可充值数据
  getRechargeCardData(currentSwiperIndex, list = this.data.oilList) {
    api.get("/front/depositCard/my/data", {
      oilCardId: list[currentSwiperIndex].id
    }).then(res => {
      list[currentSwiperIndex].denominationObj = res.list
      console.log('获取用户可充值数据', list)
      return
    }).then(() => {
      api.get("/depositCard/forSale", {
        oilCardId: list[currentSwiperIndex].id
      }).then(res => {
        console.log('---可充值的列表', res)
        list[currentSwiperIndex].forSale = res
        this.setData({
          oilList: list
        })
      }).catch(e => {
        console.log(e)
      })
    }).catch(e => {
      console.log(e)
    })


  },
  getDepositList() {


  },

  doPay() {
    const _self = this
    api.post("/front/depositCard/buy", {
      depositCardId: this.data.rechargeObj.id,
      depositCardPreferencesRulesId: this.data.rechargeObj.rulesId,
      // priceActually: this.rechargeObj.denomination - this.rechargeObj.offerValue,
      priceActually: 1,
    }, {
      loading: true
    }).then(res => {
      if (res.status >= 550) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
        return
      }

      let orderId = res.id
      return orderId
    }).then((orderId) => {
      api.post("/front/weChat/miniPay", {
        "body": 'body',
        "openId": this.data.openId,
        orderId: orderId,
        orderType: 'RECHARGE_CARD'
      }).then(res => {
        if (res.status >= 550) {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500,
          })
          return
        }
        wx.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: 'MD5',
          paySign: res.paySign,
          success(res) {
            wx.showToast({
              title: "支付成功",
              duration: 2000,
            })
            _self.closeRechargeModel()
            _self.getOilCardList()
          },
          fail(res) {
            wx.showToast({
              title: "支付失败",
              icon: 'none',
              duration: 2000,
            })
          },
          complete(e) {
            console.log(e)
          }
        })
      }).catch(e => {
        console.log(e)
      })
    })

  },
  onLoad: function () {
    const _self = this
    wx.getSystemInfo({
      success(res) {
        let obj = wx.getMenuButtonBoundingClientRect()
        _self.setData({
          capsuleWidth: obj.width, //胶囊宽度
          capsuleHeight: obj.height, //胶囊宽度
          capsuleTop: obj.top,
          customBar: obj.bottom + obj.top - res.statusBarHeight,
          searchWidth: obj.left - 40,
          windowWidth: res.windowWidth,
          screenHeight: res.screenHeight,
          windowHeight: res.windowHeight
        })
      }
    })


    this.setData({
      userId: wx.getStorageSync("userId") ? wx.getStorageSync("userId") : null,
      openId: wx.getStorageSync("openId") ? wx.getStorageSync("openId") : null,
    })

    wx.showShareMenu({
      withShareTicket: true
    })


  },
  goGoodsDetail(e) {
    let goodsId = e.currentTarget.dataset.goodsid
    wx.navigateTo({
      url: `/Goods/goods_detail/index?goodsId=${goodsId}`,
    })
  },
  onShareAppMessage: function (res) {
    let invitationCode = wx.getStorageSync("invitationCode") || '';
    return {
      title: '车陆士',
      path: 'pages/home/index?invitationCode=' + invitationCode
    }
  },
  getUserInfo: function (e) {
    app.getUserInfo();
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    // this[e.currentTarget.dataset.nextmethodname]();
  },

  goChrage(e) {
    wx.navigateTo({
      url: '/ChrageProcess/station/index',
    })
  },

  goChrage(e) {
    wx.navigateTo({
      url: '/ChrageProcess/station/index',
    })
  },
  chengeSelectCityModel() {
    wx.navigateTo({
      url: '/ChrageProcess/select_city/index',
    })
  },

  goApplyCard() {
    wx.navigateTo({
      url: '/ChrageProcess/apply_card/index',
    })
  },
  goInvite: function () {
    wx.navigateTo({
      url: '/PersonalContract/invite/index'
    })
  },
  neverLoad() {
    wx.showToast({
      title: "敬请期待！",
      icon: 'none',
      duration: 1500,
    })
  },
  doBindCard() {


    if ((this.data.oilCardId || '') == '') {
      wx.showModal({
        title: '提示',
        content: '请输入卡号',
        showCancel: false,
      })
      return
    }

    api.post("/front/oilCard/bindUser", {
      "oilCardId": this.data.oilCardId,
    }).then(res => {
      if (res.status == 200) {
        this.closeBindModel()
        this.getOilCardList()
        wx.showToast({
          title: '添加成功',
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500,
        })
      }
    })
  }

})