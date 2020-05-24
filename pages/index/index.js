// pages/more/more.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hastoken:0,
    masklayer: true,//遮罩层默认关闭
    contactparams: '',//访问客服界面的参数
    recommendgroup:[],//群推荐
    uptodategroup:[],//最新发布
    getqrid:0//获取当前点击的群id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if(!token){
      token = '';
    }
    var data = { token: token };//token字符串转成对象
    data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
    wx.request({
      url: 'https://qmzq.boc7.net/v2_index',
      method: 'post',
      data: { data: data },//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          that.setData({
            recommendgroup: value.data.recommend_group,
            uptodategroup: value.data.recent_group,
            hastoken: token?1:0
          })
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
  },

  /**
   * 用户关闭弹框
   */
  closemask: function (e) {
    if (e.currentTarget.dataset && e.currentTarget.dataset.requestid>0){
      this.setData({
        masklayer: !this.data.masklayer,
        getqrid: e.currentTarget.dataset.requestid
      })
    }else{
      this.setData({
        masklayer: !this.data.masklayer
      })
    }
  },

  /**
   * 聚焦输入框跳转
   */
  focusinput: function (e) {
    console.log(e);
    wx.navigateTo({
      url: './choicelabel',
    })
  },

  /**
   * 跳转客服页面回复1
   */
  // joingroup: function (e) {
  //   console.log(e);
  //   if (e.currentTarget.dataset) {
  //     this.setData({
  //       masklayer: !this.data.masklayer,
  //       contactparams: e.currentTarget.dataset.params
  //     })
  //   }
  // },

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
    this.setData({
      hastoken: 0,
      // masklayer: true,//遮罩层默认关闭
      // contactparams: '',//访问客服界面的参数
      recommendgroup: [],//群推荐
      uptodategroup: [],//最新发布
      getqrid:0
    })
    this.onLoad();
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
    return {
      title: '微信群分享平台，免费找群、发布群~',
      path: 'pages/index/index',
      desc: '',
      imageUrl: ''
    }
  }
})