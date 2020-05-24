// pages/login/login.js
//获取应用实例
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    color: 0,
    loadingHidden: false,
    loginCode:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.login({
      success: function (login) {
        if (login.code) {
          console.log('获取code', login.code);
          that.setData({
            loginCode:login.code,
            loadingHidden: true
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    var that = this;
    that.setData({
      color: 1
    });
    if (e.detail.encryptedData) {
      app.requesttoken(that.data.loginCode,e.detail);
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 100);
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