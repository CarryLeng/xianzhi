// pages/index/index.js
import { IndexModel } from "../../models/IndexModel.js"
let indexModel = new IndexModel()

// 数据库
const db = wx.cloud.database({
  //这个是环境ID不是环境名称
  env:'nirvanaluffy-zwa7i'
  })

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //自动轮播
    interval: 3000, // 自动切换时间间隔
    duration: 1000, // 滑动动画时长
    circular: true,//是否采用衔接滑动 
    themes: [
      { theme_icon: '../../images/index/theme@1.png', theme_name: '鸭苗', theme_type: 1 },
      { theme_icon: '../../images/index/theme@2.png', theme_name: '饲料', theme_type: 2 },
      { theme_icon: '../../images/index/theme@3.png', theme_name: '禽具', theme_type: 3 },
    ],
    banners: [
      { image: "../../images/index/001.png", product_id: 1},
      { image: "../../images/index/002.png", product_id: 2}
    ],
    products: [
      { 
        product_id: 1,
        product_name: "一日龄出壳苗 大种白番鸭苗", 
        product_img: "../../images/index//003.png", 
        product_price: "5", 
        product_unit: "/只",
        birth_time: "2020/07/12", 
        supplier_name: "蒋国强孵化厂", 
        supplier_address: "铅山/上饶/江西",
        sales_details: "10000人已付款"
      },
      { 
        product_id: 2,
        product_name: "一日龄出壳苗 麻鸭苗", 
        product_img: "../../images/index/003.png", 
        product_price: "10", 
        product_unit: "/只",
        birth_time: "2020/07/17", 
        supplier_name: "蒋国强孵化厂", 
        supplier_address: "铅山/上饶/江西",
        sales_details: "10000人已付款"
      }
    ],
    serverData: [],
    showType: "鸭苗"
  },
    // 数据库查询示例
    queryData: function() {
      // 查询当前用户的所有order信息
      db.collection('order').get({
            success: res => {
            console.log('[数据库] [查询记录] 成功 zth order res: ', res)
      },
           fail: err => {
           wx.showToast({icon: 'none', title: '查询记录失败'})
           console.error('[数据库] [查询记录] 失败：', err)
      }
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._init()
    wx.getUserInfo({
      success:(data)=>{
        console.log(data)
        this.onLoadInfo(options)
      },
      fail(){
        console.log("failed to get usersinfo")
        wx.navigateTo({
          url: '../login/login',
        })
      }
    });
    
    
  },

  onLoadInfo: function(options) {
    //var _this = this
      // 查询当前用户的所有order信息
      /*
      db.collection('order').get({
        success: res => {
        console.log('[数据库] [查询记录] 成功 zth order res: ', res)
      },
       fail: err => {
       wx.showToast({icon: 'none', title: '查询记录失败'})
       console.error('[数据库] [查询记录] 失败：', err)
      }
     });
     */
      // add 当前用户的一条order信息
      /*
      db.collection('order').add({
        data: {
          buyId: "111",
          createTime: new Date("2020-10-02"),
          orderStatus: 0,
          orderTotalPrice: 2015,
          orderUnitPrice: 5856,
          productId: 8970,
          productNum: 9098,
          updateTime: new Date("2020-10-02")
        }
      }).then(res=>{
          console.log(res);
      });*/
      // update 当前用户的一条order信息
      /*
      db.collection('order').doc("d81cd5415f76d36d00ce5a815bc70b08").update({
        data:{
          buyId: "88888"
        }
      }).then(res=>{
          console.log(res);
      });
      */
       // delete 当前用户的一条order信息
       /*
       db.collection('order').doc("d81cd5415f76d36d00ce5a815bc70b08").remove({
         
      }).then(res=>{
          console.log(res);
      }); */         
      wx.cloud.callFunction({
        // 云函数名称
        name: 'UserInfoApi',
        // 传给云函数的参数
        data: {
          "action": "getUserInfoByUid",
          "uid": "18680333650"
        },
      })
      .then(res => {
        console.log("callFunction UserInfoApi getUserInfoByUid res:", res) 
      })
      .catch(err => {
        console.log("callFunction...error", err)
      })     
      this.updateData()
  },

  updateData: function() {
    if (this.data.serverData.length <= 0) {
      wx.cloud.callFunction({
        name: 'ProductInfoApi',
        data: {
          "action": "getAllProductInfo"
        },
      }).then(res => {
        console.log("callFunction ProductInfoApi getAllProductInfo res:", res)
        var datas = res.result.data
        this.setData({
          serverData: datas
        })
        this.filterData(datas)
      }).catch(err => {
        console.log("callFunction ProductInfoApi error:", err)
      })
    } else {
      this.filterData(this.data.serverData)
    }
  },

  filterData: function(datas) {
    var tmpArr = []
    var curType = this.data.showType
    for (var j = 0, len = datas.length; j < len; j++) {
      var data = datas[j]
      console.log("item", data)
      if (curType != data.productType) {
        continue
      }
      var object = Object()
      object.product_id = data.productId
      object.product_name = data.productDetail + " " + data.productName
      object.product_img = "../../images/index/003.png"
      object.product_price = data.productPrice
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
      tmpArr.push.apply(tmpArr, [object])
    }
    console.log("tmpArr", tmpArr)
    this.setData({
      products: tmpArr
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

  },
  themeNavigation: function (event) {
    let theme_type = indexModel.getDataSet(event, "themetype")
    console.log("themeNavigation", theme_type)
    switch (theme_type) {
      case 1: {
        this.setData({
          showType: "鸭苗"
        })
        break
      }
      case 2: {
        this.setData({
          showType: "饲料"
        })
        break
      }
      case 3: {
        this.setData({
          showType: "禽具"
        })
        break
      }
      default: {
        this.setData({
          showType: "鸭苗"
        })
        break
      }
    }
    console.log("showType", this.data.showType)
    this.updateData()
  },
  _init: function () {
    //轮播图
    indexModel.getBanner(res => {
      this.setData({
        banners: res.result.data.data
      })
    })
    // 主题
    indexModel.getTheme(res => {
      this.setData({
        themes: res.result.data.data
      })
    })
    // 最新商品
    indexModel.getProductNew(res => {
      this.setData({
        products: res.result.data.data
      })
    })
  },
  // 跳转商品详情
  productDetails: function (event) {
    let product_id = event.currentTarget.dataset.productid
    console.log("productDetails", product_id)
    this._navProductDetail(product_id)
  },
  productBanner: function (event) {
    let product_id = indexModel.getDataSet(event, "productid")
    this._navProductDetail(product_id)
  },
  // 跳转详情
  _navProductDetail: function (product_id) {
    wx.navigateTo({
      url: '/pages/product/product?product_id=' + product_id,
    })
  }
})