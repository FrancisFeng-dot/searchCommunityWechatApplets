// pages/index/choicelabel.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labelcontent: '',//输入框内容
    masklayer: true,//遮罩层默认关闭
    labelgroup: [],//群标签
    uptodategroup: []//最新发布
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://qmzq.boc7.net/v2_groupTag',
      method: 'post',
      data: {},//字符串转成json对象
      success: function (res) {
        var value = app.decrypt(res.data);
        console.log(value);
        if (value.code == 0) {
          that.setData({
            labelgroup: value.data
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
  },

  /**
   * 用户关闭弹框
   */
  focusinput: function (e) {
    console.log(e);
    var that = this;
    var data = {};
    if (e.detail.value) {
      console.log(1);
      data = { key: e.detail.value };//token字符串转成对象
    } else if (e.currentTarget.dataset && e.currentTarget.dataset.content >= 0) {
      console.log(2);
      that.setData({
        labelcontent: that.data.labelgroup[e.currentTarget.dataset.content].tag_name
      });
      data = { tag_id: that.data.labelgroup[e.currentTarget.dataset.content].id };//token字符串转成对象
      console.log(data);
    } else if (that.data.labelcontent) {
      console.log(3);
      console.log(that.data.labelcontent);
      data = { key: that.data.labelcontent };//token字符串转成对象
    }
    if(data){
      data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzq.boc7.net/v2_groupSearch',
        method: 'post',
        data: { data: data },//字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code == 0) {
            that.setData({
              uptodategroup: value.data.group
            });
          } else {
            wx.showToast({
              title: value.msg,
              icon: 'none',
              duration: 2000
            });
            // try {
            //   wx.clearStorageSync();
            //   wx.redirectTo({
            //     url: '/pages/login/login'
            //   })
            // } catch (e) {
            //   console.log('Do something when catch error');
            // }
          }
        }
      });
    }else{
      wx.showToast({
        title: '请输入搜索词',
        icon:'none',
        duration:2000
      })
    }
  },

  /**
   * 记录输入内容
   */
  getscan: function (e) {
    console.log(e);
    this.setData({
      labelcontent: e.detail.value
    });
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