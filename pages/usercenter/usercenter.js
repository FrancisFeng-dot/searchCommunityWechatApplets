// pages/usercenter/usercenter.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    masklayer: true,//遮罩层默认关闭
    user: { headimg:'https://qmzgcdn.boc7.net/qmzq/userheadbackimg.png',nickname:'点此登录'},//用户信息
    hastoken:0,//是否授权
    haspublish:{num:0,haschange:0},
    pendreview: { num: 0, haschange: 0},
    didnotpass: { num: 0, haschange: 0}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      that.setData({
        hastoken: 1
      });
      wx.getUserInfo({
        success: res => {
          that.setData({
            user: { headimg: res.userInfo.avatarUrl, nickname: res.userInfo.nickName }
          })
        }
      });
      var data = { token: token };//token字符串转成对象
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzq.boc7.net/v2_userCenter',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code == 0) {
            that.setData({
              haspublish: { num: value.data.status.pass.count, haschange: value.data.status.pass.has_change },
              pendreview: { num: value.data.status.wait_pass.count, haschange: value.data.status.wait_pass.has_change },
              didnotpass: { num: value.data.status.no_pass.count, haschange: value.data.status.no_pass.has_change }
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
    }
  },

  /**
   * 用户关闭弹框
   */
  closemask: function (e) {
    this.setData({
      masklayer: !this.data.masklayer
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      user: { headimg: 'https://qmzgcdn.boc7.net/qmzq/userheadbackimg.png', nickname: '点此登录' },//用户信息
      hastoken: 0,//是否授权
      haspublish: { num: 0, haschange: 0 },
      pendreview: { num: 0, haschange: 0 },
      didnotpass: { num: 0, haschange: 0 }
    });
    this.onLoad();
    setTimeout(function () {
      wx.stopPullDownRefresh();
    }, 100);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '每天免费抽现金红包，各种大奖等你来拿!',
      path: 'pages/lottery/lottery',
      desc: '',
      imageUrl: 'https://qmzgcdn.boc7.net/welfare/free_game/share_lottery1.jpg'
    }
  }
})