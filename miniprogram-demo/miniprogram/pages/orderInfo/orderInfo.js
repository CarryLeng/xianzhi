// pages/orderInfo/orderInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfos: [],
    userInfo : {
      uid : "001",
      nickName : "001"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderInfos = this.data.orderInfos
    var orderInfo = options.orderInfo
    if (orderInfo == null){
      orderInfos.push({
        uid: "001",
        pid: "001",
        factory: "蒋国强孵化厂",
        name: "一日龄出壳苗 大种白番鸭苗",
        price_total: 10000.00,
        price_unit: 5.00,
        numbers: 2000,
        state : "已完成"
      })
      wx.getUserInfo({
        success:(data)=>{
          console.log(data)
          var nickName = data.userInfo.nickName
          console.log("getUserInfo nickName:", nickName)
          wx.cloud.callFunction({
            name : "UserInfoApi",
            data : {
              "action" : "getUserInfoByNickName",
              "nickName" : nickName
            }
          }).then(res =>{
            console.log("callFunction UserInfoApi getUserInfoByNickName:", res)
            var data = res.result.data
            if (data != undefined &&  data.length > 0) {
              var userInfo = data[data.length - 1]
              this.setData({
                userInfo : {
                  uid : userInfo.uid,
                  nickName : userInfo.webChatNickName
                }
              })
              console.log("userInfo:", this.data.userInfo)
              this.requestOrderDetails(userInfo.uid)
            }
          }).catch(err => {
            console.log("callFunction UserInfoApi getUserInfoByNickName:", err)
          })
        },
        fail(){
          console.log("failed to get usersinfo")
          wx.navigateTo({
            url: '../login/login',
          })
        }
      })
    } else {
      console.log("onLoad orderInfo:", orderInfo)
      var object = JSON.parse(orderInfo)
      console.log("object:", object)
      var uid = object.uid
      var pid = object.pid
      var factory = object.supplier_name
      var name = object.product_name
      var numbers = object.numbers
      var price = object.product_price
      var total = price * numbers
      orderInfos.push({
        uid: uid,
        pid: pid,
        factory: factory,
        name: name,
        price_unit: price,
        numbers: numbers,
        price_total: total,
        state : "待付款"
      })
      console.log("uid:", uid)
      this.requestOrderDetails(uid)
    }
    this.setData({
      orderInfos : orderInfos
    })
  },

  requestOrderDetails: function(uid) {
    wx.cloud.callFunction({
      name : "OrderInfoApi",
      data : {
        "action" : "getOrderInfoByUid",
        "uid" : uid
      }
    }).then(res => {
      console.log("callFunction OrderInfoApi getOrderInfoByUid result:", res)
      var datas = res.result.data
      if (datas != undefined && datas.length > 0) {
        var details = JSON.stringify(datas)
        console.log("callFunction OrderInfoApi:", details)
      }
    }).catch(err => {
      console.log("callFunction OrderInfoApi getOrderInfoByUid error:", err)
    })
  },


  //退款明细
  refundDetails: function(e) {
    console.log("function->refundDetails......")
  },

  //再次购买
  buyAgain: function(e) {
    console.log("function->buyAgain......")
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