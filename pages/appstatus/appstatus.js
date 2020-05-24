// pages/appstatus/appstatus.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myselfgroup:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var data = { token: token,status:options.status };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzq.boc7.net/v2_groupStatus',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code == 0) {
            that.setData({
              myselfgroup: value.data.group
            });
          } else {
            try {
              wx.clearStorageSync();
              wx.redirectTo({
                url: '/pages/login/login'
              })
            } catch (e) {
              console.log('Do something when catch error');
            }
          }
        }
      });
    }else{
      wx.navigateTo({
        url: '../login/login',
      });
    }
  },

  /**
   * 跳转编辑
   */
  jumpedit: function (e) {
    if (e.currentTarget.dataset) {
      wx.setStorageSync('groupid', e.currentTarget.dataset.id);
      wx.switchTab({
        url: '../releasegroup/releasegroup'
      })
    }
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
    return {
      title: '微信群分享平台，免费找群、发布群~',
      path: 'pages/index/index',
      desc: '',
      imageUrl: ''
    }
  }
})