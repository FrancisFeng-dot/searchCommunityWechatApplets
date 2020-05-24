const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rule: '1、由于微信群的二维码有效期最长是7天，如果您扫描二维码时出现二维码已过期，请直接扫微信群主二维码，让群主拉你进入微信群。\n2、平台所有内容和二维码均为用户发布，本站无法审查其内部有无违法信息与真实性，请各位网民仔细辨别。',
    group: {},

    is_self: false,
    showGeneralize: true,
    showEdit: true,
    showCall: true,

    showAddDialog: true,
    showCallDialog: true,
    showShare: true,
    hastoken:0
  },

  /**
   * 弹出层函数
   */
  //显示加群弹窗
  showAddGroup: function() {
    this.setData({
      showAddDialog: false,

    })
  },

  /**
   * 显示拨号弹窗
   */
  showCall: function() {
    this.setData({
      showCallDialog: false
    })
  },

  /**
   * 显示分享弹窗
   */
  showShare: function() {
    this.setData({
      showShare: false
    })
  },


  //弹窗消失
  hide: function() {
    this.setData({
      showAddDialog: true,
      showCallDialog: true,
      showShare: true
    })
  },

  /**
   * 查看大图
   */
  showBigPhoto: function(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    // var imgList = event.currentTarget.dataset.list;//获取data-list
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [src]
      // urls: imgList // 需要预览的图片http链接列表
    })
  },

  /**
   * 确认拨号
   */
  calling: function() {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.group.group_tel,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },


  /**
   * 分享图片
   */
  shareImage: function(e) {
      console.log('分享大图')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var data = {id: options.id}; //token字符串转成对象
    data = app.encrypt(JSON.stringify(data)); //对象转成字符串加密后
    wx.request({
      url: 'https://qmzq.boc7.net/v2_groupDetail',
      method: 'post',
      data: {
        data: data
      }, //字符串转成json对象
      success: function(res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          that.setData({
            groupid: options.id,
            hastoken: token ? 1 : 0,
            group: value.data.detail,
            is_self: value.data.detail.is_self == 1,
            showGeneralize: value.data.detail.status == 2,
            showEdit: value.data.detail.status != 2,
            showCall: value.data.detail.group_tel == '',
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
    })
  },

  /**
   * 跳转编辑
   */
  jumpedit: function () {
    wx.setStorageSync('groupid', this.data.group.id);
    wx.switchTab({
      url: '../releasegroup/releasegroup'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '【有人@你】刚看到一个超赞的群，赶紧点击查看吧~',
      path: 'pages/index/index?id=' + this.data.groupid,
      desc: '',
      imageUrl: ''
    }
  }
})