// pages/releasegroup/releasegroup.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupnum:0,//群名称长度
    fontnum: 0,//群简介长度
    labelcount:0,//标签个数
    propagandaimg: [],//宣传图片组
    color1:1,//流程1
    color2: 0,//流程2
    color3: 0,//流程3
    region: [],//地址
    customItem: '',//无参数时显示？
    labelgroup:[],//标签组
    rule_agree:false,//是否同意规则
    masklayer:true,//遮罩层
    is_submit:false,//是否提交了结果
    skinheight:0,//屏幕高度
    coverimg: '',//群封面图
    groupqrimg: '',//群二维码
    themanqrimg:'',//群主二维码
    userinfo: { headimg: '', nickname: '' },//群主信息
    groupname:'',
    introduction:'',
    mantelphone:'',
    groupid:0,//群组id
    groupstatus:0//新提交0编辑1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(1);
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var groupid = wx.getStorageSync('groupid');
      if (!groupid) {
        wx.request({
          url: 'https://qmzq.boc7.net/v2_groupTag',
          method: 'post',
          data: {},//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            console.log(value);
            if (value.code == 0) {
              var arr = [];
              for (var i = 0; i < value.data.length; i++) {
                arr.push({ id: value.data[i].id, value: value.data[i].tag_name, select: 0 });
              }
              that.setData({
                labelgroup: arr
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
        wx.getUserInfo({
          success: res => {
            that.setData({
              userinfo: { headimg: res.userInfo.avatarUrl, nickname: res.userInfo.nickName }
            })
          }
        });
      }
    } else {
      wx.navigateTo({
        url: '../login/login',
      });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(3);
    var that = this;
    var token = wx.getStorageSync('token');
    if (token) {
      var groupid = wx.getStorageSync('groupid');
      if (groupid) {
        console.log(groupid);
        var data = { id: groupid };//token字符串转成对象
        wx.setStorageSync('groupid', '');
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: 'https://qmzq.boc7.net/v2_groupDetail',
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            console.log(value);
            if (value.code == 0) {
              var locarr = value.data.detail.location.split("，");
              that.setData({
                color1: 1,//流程1
                color2: 0,//流程2
                color3: 0,//流程3
                is_submit: false,//是否提交了结果
                groupnum: value.data.detail.group_name.length,//群名称长度
                fontnum: value.data.detail.group_desc.length,//群简介长度
                labelcount: 0,//标签个数
                labelgroup: value.data.detail.tag,//标签组先赋值给该变量之后处理
                region: [locarr[0], locarr[1], locarr[2]],//地址
                propagandaimg: value.data.detail.img,//宣传图片组
                coverimg: value.data.detail.group_logo,//群封面图
                groupqrimg: value.data.detail.group_qr1,//群二维码
                themanqrimg: value.data.detail.group_owner_qr,//群主二维码
                groupname: value.data.detail.group_name,
                introduction: value.data.detail.group_desc,
                mantelphone: value.data.detail.group_tel,
                groupid: value.data.detail.id,//群组id
                groupstatus: 1//新提交0编辑1
              });
              var arr = [];
              for (var i = 0; i < value.data.tags.length; i++) {
                var isornot_select = 0;
                for (var j = 0; j < value.data.detail.tag.length; j++) {
                  if (value.data.detail.tag[j].tag_id == value.data.tags[i].id) {
                    isornot_select = 1;
                    that.setData({
                      labelcount: that.data.labelcount + 1
                    });
                  }
                }
                if (isornot_select == 1) {
                  arr.push({ id: value.data.tags[i].id, value: value.data.tags[i].tag_name, select: 1 });
                } else {
                  arr.push({ id: value.data.tags[i].id, value: value.data.tags[i].tag_name, select: 0 });
                }
              }
              that.setData({
                labelgroup: arr
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
        wx.getUserInfo({
          success: res => {
            that.setData({
              userinfo: { headimg: res.userInfo.avatarUrl, nickname: res.userInfo.nickName }
            })
          }
        });
      }
    } else {
      wx.navigateTo({
        url: '../login/login',
      });
    }
  },

  /**
   * 改变标签页
   */
  changecolor: function (e) {
    console.log(e);
    if (e.currentTarget.dataset) {
      var valueindex = e.currentTarget.dataset.index;
      if (valueindex == 2 && this.data.groupnum==0) {
        wx.showToast({
          title: '请填写群名称',
          icon: 'none',
          duration: 2000
        });
      } else if (valueindex == 2 && this.data.fontnum == 0) {
        wx.showToast({
          title: '请填写群简介',
          icon: 'none',
          duration: 2000
        });
      } else if (valueindex == 2 && this.data.propagandaimg == '') {
        wx.showToast({
          title: '请上传群宣传图',
          icon: 'none',
          duration: 2000
        });
      } else if (valueindex == 2 && this.data.region.length == 0) {
        wx.showToast({
          title: '请选择群位置',
          icon: 'none',
          duration: 2000
        });
      } else if (valueindex == 2 && this.data.labelcount == 0) {
        wx.showToast({
          title: '请选择群标签',
          icon: 'none',
          duration: 2000
        });
      } else if (valueindex == 3 && this.data.groupqrimg == '') {
        wx.showToast({
          title: '请上传群二维码',
          icon: 'none',
          duration: 2000
        });
      } else if (valueindex == 3 && this.data.themanqrimg == '') {
        wx.showToast({
          title: '请上传群主二维码',
          icon: 'none',
          duration: 2000
        });
      }else{
        this.setData({
          color1: 0,
          color2: 0,
          color3: 0
        });
        var obj = {};
        obj['color' + valueindex] = 1;
        this.setData(obj);
      }
    };
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
   * 用户是否同意规则
   */
  agreerule: function (e) {
    this.setData({
      rule_agree: !this.data.rule_agree
    });
  },

  /**
   * 标签组切换
   */
  labelswitch: function (e) {
    console.log(e);
    if (this.data.labelcount==3){
      wx.showToast({
        title: '最多可选择3个标签',
        icon:'none',
        duration:2000
      })
    }else{
      var arr = this.data.labelgroup;
      if (arr[e.currentTarget.dataset.index].select == 0) {
        arr[e.currentTarget.dataset.index].select = 1;
        this.setData({
          labelcount: this.data.labelcount + 1
        });
      } else {
        arr[e.currentTarget.dataset.index].select = 0;
        this.setData({
          labelcount: this.data.labelcount - 1
        });
      }
      console.log(arr);
      this.setData({
        labelgroup: arr
      });
    }
  },

  /**
   * 用户提交群
   */
  submitaddgroup: function (e) {
    console.log(e);
    var that = this;
    if (that.data.rule_agree){
      var token = wx.getStorageSync('token');
      if (token) {
        var arr = [];
        for (var i = 0; i < that.data.labelgroup.length; i++) {
          if (that.data.labelgroup[i].select == 1) {
            arr.push(that.data.labelgroup[i].id);
          }
        }
        var data = { 
          token: token,
          formid: e.detail.formId,
          id: that.data.groupstatus == 0?0:that.data.groupid,
          group_name: e.detail.value.groupname,
          group_desc: e.detail.value.introduction,
          group_tel: e.detail.value.mantelphone,
          group_logo: that.data.coverimg,
          group_owner_qr: that.data.themanqrimg,
          group_qr1: that.data.groupqrimg,
          location: that.data.region[0] + '，' + that.data.region[1] + '，' + that.data.region[2],
          img: that.data.propagandaimg, 
          tag: arr 
        }
        var requesturl = that.data.groupstatus == 0 ? 'https://qmzq.boc7.net/v2_groupAdd':'https://qmzq.boc7.net/v2_groupEdit';
        console.log(data);
        data = app.encrypt(JSON.stringify(data));//对象转成字符串加密后
        wx.request({
          url: requesturl,
          method: 'post',
          data: { data: data },//字符串转成json对象
          success: function (res) {
            var value = app.decrypt(res.data);
            console.log(value);
            if (value.code == 0) {
              that.setData({
                is_submit: !that.data.is_submit,
                groupid: value.data.id
              });
              wx.getSystemInfo({
                success: function (res) {
                  var skinheight = (res.windowHeight - (res.windowWidth / 750) * 94 + 50) + "px";
                  that.setData({
                    skinheight: skinheight
                  });
                }
              });//获取屏幕高度设置排行榜高度
            } else {
              var value2 = app.decrypt(res.data);
              console.log(value2);
              wx.showToast({
                title: value2.msg,
                icon:'none',
                duration:2000
              })
            }
          }
        })
      }
    }else{
      wx.showToast({
        title: '请阅读并勾选同意全民找群发布规则',
        icon:'none',
        duration:2000
      })
    }
  },

  /**
   * 点击重置界面数据
   */
  reupload: function () {
    this.setData({
      groupnum: 0,//群名称长度
      fontnum: 0,//群简介长度
      labelcount: 0,//标签个数
      propagandaimg: [],//宣传图片组
      color1:1,//流程1
      color2: 0,//流程2
      color3: 0,//流程3
      region: [],//地址
      labelgroup: [],//标签组
      rule_agree:false,//是否同意规则
      masklayer:true,//遮罩层
      is_submit:false,//是否提交了结果
      skinheight:0,//屏幕高度
      coverimg: '',//群封面图
      groupqrimg: '',//群二维码
      themanqrimg:'',//群主二维码
      userinfo: { headimg: '', nickname: '' },//群主信息
      groupname: '',
      introduction: '',
      mantelphone: '',
      groupid: 0,//群组id
      groupstatus: 0//新提交0编辑1
    });
    this.onLoad();
  },

  /**
   * 预览图片
   */
  previewimg: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
    })
  },

  /**
   * 删除宣传图片
   */
  delpromotion: function (e) {
    var arr = [];
    for (var i = 0; i < this.data.propagandaimg.length; i++) {
      if (e.currentTarget.dataset.imgsrc != this.data.propagandaimg[i]) {
        arr.push(this.data.propagandaimg[i]);
      }
    }
    this.setData({
      propagandaimg: arr
    });
  },
  
  /**
   * 上传宣传图片
   */
  addimg: function (options) {
    var that = this;
    wx.chooseImage({
      count: 9,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var arr = that.data.propagandaimg;
        if (tempFilePaths.length > 0) {
          for (var i = 0; i < tempFilePaths.length; i++) {
            if (arr.length < 5) {
              console.log(tempFilePaths[i]);
              wx.uploadFile({
                url: 'https://qmzq.boc7.net/v2_groupImgUpload', //仅为示例，非真实的接口地址
                filePath: tempFilePaths[i],
                name: 'image',
                method: 'POST',
                success: function (res) {
                  console.log(res);
                  var value = JSON.parse(res.data);
                  console.log(value);
                  if (value.code == 0) {
                    arr.push(value.data.img_url);
                    that.setData({
                      propagandaimg: arr
                    });
                  }else{
                    wx.showToast({
                      title: value.msg,
                      icon:'none',
                      duration:2000
                    })
                  }
                }
              })
            }
          }
        }
      },
      fail: function (res) {
        console.log(res);
        // wx.showToast({
        //   title: res.errMsg,
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
  },

  /**
   * 删除群实体图片
   */
  delentity: function (e) {
    if (e.currentTarget.dataset.type == 'cover') {
      this.setData({
        coverimg: ''
      });
    } else if (e.currentTarget.dataset.type == 'groupqr') {
      this.setData({
        groupqrimg: ''
      });
    } else if (e.currentTarget.dataset.type == 'manqr') {
      this.setData({
        themanqrimg: ''
      });
    }
  },

  /**
   * 上传群实体图片
   */
  addgroupimg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res);
        wx.uploadFile({
          url: 'https://qmzq.boc7.net/v2_groupImgUpload', //仅为示例，非真实的接口地址
          filePath: res.tempFilePaths[0],
          name: 'image',
          method: 'POST',
          success: function (res) {
            console.log(res);
            var value = JSON.parse(res.data);
            console.log(value);
            if (value.code == 0) {
              if (e.currentTarget.dataset.type =='cover'){
                that.setData({
                  coverimg: value.data.img_url
                });
              } else if (e.currentTarget.dataset.type == 'groupqr'){
                that.setData({
                  groupqrimg: value.data.img_url
                });
              } else if (e.currentTarget.dataset.type == 'manqr'){
                that.setData({
                  themanqrimg: value.data.img_url
                });
              }
            }else{
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        });
      },
      fail: function (res) {
        console.log(res);
        // wx.showToast({
        //   title: res.errMsg,
        //   icon:'none',
        //   duration:2000
        // })
      }
    })
  },

  /**
   * 群名称计数
   */
  titlecount: function (e) {
    console.log(e);
    this.setData({
      groupnum: e.detail.cursor, 
      groupname: e.detail.value
    });
    if (e.detail.cursor == 16) {
      wx.showToast({
        title: '字数超过16，请重新排版内容',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 群简介计数
   */
  suggesttext: function (e) {
    this.setData({
      fontnum: e.detail.cursor,
      introduction: e.detail.value
    });
    if (e.detail.cursor == 300) {
      wx.showToast({
        title: '字数超过300，请重新排版内容',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 电话号码记录
   */
  recordtel: function (e) {
    this.setData({
      mantelphone: e.detail.value
    });
  },
  
  /**
   * 重新加载界面
   */
  navigatetopage: function (e) {
    this.reupload();
    if(e.currentTarget.dataset.navito=='index'){
      wx.switchTab({
        url: '../index/index',
      });
    }
    // else{
    //   this.onLoad();
    // }
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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