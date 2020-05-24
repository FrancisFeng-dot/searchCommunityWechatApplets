// pages/sharepng/sharepng.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    qr_code:'',
    group: {},
    loadingHidden: false,
    userinfo: { headimg: '', nickname: '' },//群主信息
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    if(options.id){
      var data = {
        id: options.id
      }; //token字符串转成对象
      wx.getUserInfo({
        success: res => {
          that.setData({
            userinfo: { headimg: res.userInfo.avatarUrl, nickname: res.userInfo.nickName }
          })
        }
      });
      data = app.encrypt(JSON.stringify(data)); //对象转成字符串加密后
      wx.request({
        url: 'https://qmzq.boc7.net/v2_groupDetail',
        method: 'post',
        data: {
          data: data
        }, //字符串转成json对象
        success: function (res) {
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code == 0) {
            that.setData({
              loadingHidden: true,
              group: value.data.detail
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
      var optionsid = { id: options.id };//token字符串转成对象
      optionsid = app.encrypt(JSON.stringify(optionsid));//对象转成字符串加密后
      wx.request({
        url: 'https://qmzq.boc7.net/v2_createQr',
        method: 'post',
        data: { data: optionsid },//字符串转成json对象
        success: function (res) {
          console.log(res);
          var value = app.decrypt(res.data);
          console.log(value);
          if (value.code == 0) {
            that.setData({
              qr_code: value.data.url
            });
          }
        },
        fail: function (res) {
          console.log('获取二维码失败');
        },
        complete: function (res) {
          console.log(res);
          var value2 = app.decrypt(res.data);
          console.log(value2);
          if (value2.code == 0) {
            wx.getImageInfo({
              src: value2.data.url,
              success: function (res2) {
                console.log(res2);
                var qr_img = res2.path;
                wx.getImageInfo({
                  src: that.data.userinfo.headimg,
                  success: function (res3) {
                    console.log(res3);
                    var is_headimg = res3.path;
                    wx.getImageInfo({
                      src: that.data.group.group_logo,
                      success: function (res4) {
                        console.log(res4);
                        var is_logo = res4.path;
                        wx.getImageInfo({
                          src: 'https://qmzgcdn.boc7.net/qmzq/posterback.png',
                          success: function (res5) {
                            console.log(res5);
                            var is_background = res5.path;
                            var ctx = wx.createCanvasContext('shareCanvas');
                            ctx.rect(0, 0, 345, 490);
                            ctx.setFillStyle('#ffffff');
                            ctx.fill();
                            ctx.drawImage(is_background, 0, 0, 345, 490);
                            ctx.setTextAlign('center');
                            ctx.setFillStyle('#ffffff');
                            ctx.font = "normal 14px MicrosoftYaHei";
                            ctx.fillText(that.data.userinfo.nickname, 168, 86);
                            ctx.font = "normal 16px MicrosoftYaHei";
                            ctx.fillText('向你推荐了一个群聊', 168, 112);
                            ctx.save();
                            ctx.beginPath();
                            ctx.rect(23, 150, 300, 140);
                            ctx.setFillStyle('#ffffff');
                            ctx.fill();
                            ctx.clip();
                            ctx.drawImage(is_logo, 45, 170, 80, 80);
                            ctx.closePath();
                            ctx.restore();
                            ctx.setFillStyle('#19191A');
                            ctx.font = "Regular 16px SourceHanSansCN";
                            ctx.fillText(that.data.group.group_name, 190, 190);
                            ctx.setFillStyle('#999999');
                            ctx.font = "Regular 13px SourceHanSansCN";
                            ctx.setTextAlign('left');
                            var chr = that.data.group.group_desc.split('');
                            var temp = '';
                            var row = [];
                            for (var a = 0; a < chr.length; a++) {
                              if (ctx.measureText(temp).width < 130) {
                                ;
                              } else {
                                row.push(temp);
                                temp = "";
                              }
                              temp += chr[a];
                            }
                            row.push(temp);
                            if (row.length<4){
                              if (chr.length>6){
                                for (var b = 0; b < row.length; b++) {
                                  ctx.fillText(row[b], 136, 200 + (b + 1) * 20);
                                }
                              }else{
                                for (var b = 0; b < row.length; b++) {
                                  ctx.fillText(row[b], 136, 200 + (b + 1) * 20);
                                }
                              }
                            }else{
                              for (var b = 0; b < 4; b++) {
                                ctx.fillText(row[b], 136, 190 + (b + 1) * 20);
                              }
                            }
                            ctx.setFillStyle('#EAF9FF');
                            ctx.font = "normal 12px MicrosoftYaHei";
                            ctx.setTextAlign('center');
                            ctx.fillText('长按扫码 一键进入群聊', 168, 424);
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(168, 40, 27, 0, 2 * Math.PI);
                            ctx.setFillStyle('#ffffff');
                            ctx.fill();
                            ctx.clip();
                            ctx.drawImage(is_headimg, 141, 13, 54, 54);
                            ctx.closePath();
                            ctx.restore();
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(168, 360, 36, 0, 2 * Math.PI);
                            ctx.setFillStyle('#ffffff');
                            ctx.fill();
                            ctx.clip();
                            ctx.drawImage(qr_img, 132, 324, 72, 72);
                            ctx.closePath();
                            ctx.restore();
                            ctx.draw();
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  saveimg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      fileType: 'jpg',
      success: function (res) {
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res2) {
            console.log(res2);
            wx.showToast({
              title: '二维码保存成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail: function (res2) {
            console.log(res2);
            wx.showToast({
              title: '请在设置中打开保存图片到本地权限',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
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