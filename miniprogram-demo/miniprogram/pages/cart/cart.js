// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    varieties : "麻鸭",
    ageDay : 0,
    breedNumber : 0,
    deathNumber : 0,
    images_viscera : [],
    images_fecal : [],
    images_exter : [],
    images_medica : [],
  },

  varietiesBindblur: function(e){
    this.setData({
      varieties : e.detail.value
    })
  },

  ageAayBindblur: function(e) {
    this.setData({
      ageDay : e.detail.value
    })
  },

  breedNumberBindblur: function(e) {
    this.setData({
      breedNumber : e.detail.value
    })
  },

  deathNumberBindblur: function(e) {
    this.setData({
      deathNumber : e.detail.value
    })
  },

  // 心、肝、脾、胰、胸腺、有变化的肠子内外解剖照片
  uploader_viscera: function(e) {
    console.log('uploader_viscera ......')
    this.chooseImageTap(this.data.images_viscera)
    console.log(this.data.images_viscera)
  },

  // 粪便情况照片 
  uploader_fecal: function(e) {
    this.chooseImageTap(this.data.images_fecal)
  },

  // 外在表现照片
  uploader_exter: function(e) {
    this.chooseImageTap(this.data.images_exter)
  },

  // 用药照片
  uploader_medica: function(e) {
    this.chooseImageTap(this.data.images_medica)
  },

  chooseImageTap: function(list) {
    var that = this
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage(list, 'album')
          } else if (res.tapIndex == 1) {
            that.chooseWxImage(list, 'camera')
          }
        }
      }
    })
  },

  // 图片本地路径
  chooseWxImage: function(list, type) {
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        var imgPaths = res.tempFilePaths
        for(var j = 0, len = imgPaths.length; j < len; j++) {
          var imgPath = imgPaths[j]
          console.log(imgPath)
          list.push(imgPath)
        }
      }
    })
  },

  formSubmit: function(e) {
    
    console.log("function formSubmit......")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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