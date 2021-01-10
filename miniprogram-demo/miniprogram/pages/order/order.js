// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product: { 
      product_id: "001",
      product_name: "一日龄出壳苗 大种白番鸭苗", 
      product_img: "../../pages/index/images/003.png", 
      product_price: "5", 
      product_unit: "/只",
      birth_time: "2020/07/12", 
      supplier_name: "蒋国强孵化厂", 
      supplier_address: "铅山/上饶/江西",
      sales_details: "10000人已付款"
    },
    payment_deposit: 1,
    payment_full: 2,
    numbers: 1,
    payment_mode: 2,
    userInfo : {
      uid : "001",
      nickName : "001"
    }
  },

  numberReduce: function(e) {
    console.log("numberReduce")
    var value = this.data.numbers
    if (value > 0) {
      value -= 1
      this.setData({
        numbers: value
      })
    }
  },

  numberPlus: function(e) {
    console.log("numberPlus")
    var value = this.data.numbers
    value += 1
    this.setData({
      numbers: value
    })
  },

  numberInput: function(e) {
    var value = e.detail.value
    console.log("numberInput", value)
    this.setData({
      numbers: value
    })
  },

  paymentChage: function(e) {
    console.log("paymentChage", e.detail.value)
    this.setData({
      payment_mode: e.detail.value
    })
  },

  placeOrder: function(e) {
    console.log("placeOrder")
    wx.cloud.callFunction({
      name: "OrderInfoApi",
      data: {
        "action" : "addOrderInfo",
        "pid" : this.data.product.product_id,
        "uid" : this.data.userInfo.uid
      },
    }).then(res => {
      console.log("callFunction OrderInfoApi addOrderInfo:", res)
      var object = Object()
      object.pid = this.data.product.product_id
      object.uid = this.data.userInfo.uid
      object.numbers = this.data.numbers
      object.product_name = this.data.product.product_name
      object.product_price = this.data.product.product_price
      object.supplier_name = this.data.product.supplier_name
      var orderInfo = JSON.stringify(object)
      wx.navigateTo({
        url: '../orderInfo/orderInfo?orderInfo=' + orderInfo,
      })
    }).catch(err => {
      console.log("callFunction OrderInfoApi addOrderInfo:", err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = options.productId
    console.log("value:", value)
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
    wx.cloud.callFunction({
      name: 'ProductInfoApi',
      data: {
        "action": "getProductInfoByPid",
        "pid": this.data.product_id
      },
    }).then(res => {
      console.log("callFunction ProductInfoApi getProductInfoByPid res:", res)
      if (res.result.data == undefined) {
        return
      }
      var data = res.result.data[0]
      console.log("data:", data)
      var object = Object()
      object.product_id = data.productId
      object.product_name = data.productDetail + " " + data.productName
      object.product_img = "../../pages/index/images/003.png"
      object.product_price = data.productPrice
      var curType = data.productType
      if (curType == "鸭苗") {
        object.product_unit = "/只"
      } else if(curType == "饲料") {
        object.product_unit = "/斤"
      } else if(curType == "禽具") {
        object.product_unit = ""
      }
      object.birth_time = data.birthTime
      object.supplier_name = data.supplierName
      object.supplier_address = data.supplierAddress
      object.sales_details = data.productStock
      this.setData({
        product: object
      })
      console.log("setProduct:", this.data.product)
    }).catch(err => {
      console.log("callFunction ProductInfoApi error:", err)
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