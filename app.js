//app.js
var aldstat = require("./utils/ald-stat.js")
var CryptoJS = require('./vendor/crypto.js');
App({
  onLaunch: function (options) {

  },

  globaldata:{
    gametime:0
  },

  onShow: function (options) {
    this.globaldata.gametime = 1;
    console.log(this.globaldata);
  },

  onHide: function (options) {
    this.globaldata.gametime = 0;
    console.log(this.globaldata);
  },

  requesttoken: function (logincode,res) {
    var that = this;
    var data = {
      code: logincode,
      encryptedData: res.encryptedData,
      iv: res.iv
    };
    console.log(data);
    var sendDatas = that.encrypt(JSON.stringify(data));
    // 换取koken
    wx.request({
      url: 'https://qmzq.boc7.net/v1_login',
      data: { data: sendDatas },
      header: {
        'content-type': 'application/x-www-form-urlencoded'  // 默认值
      },
      method: "POST",
      success: function (res) {
        var value = that.decrypt(res.data);
        console.log(value);
        // 缓存token30天
        if (value.code == 0) {
          var timestamp = Date.parse(new Date());
          var expiration = timestamp + 2592000000;
          console.log('这是login的token' + value.token);
          wx.setStorageSync('token', value.token);
          wx.setStorageSync('index_data_expiration', expiration);
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      }, fail: function (res) {
        console.log('最外面的失败吧')
      }
    })
  },
  
  decrypt: function (str) {
    var Base64 = {
      // 转码表
      table: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
      ],
      UTF16ToUTF8: function (str) {
        var res = [], len = str.length;
        for (var i = 0; i < len; i++) {
          var code = str.charCodeAt(i);
          if (code > 0x0000 && code <= 0x007F) {
            // 单字节，这里并不考虑0x0000，因为它是空字节
            // U+00000000 – U+0000007F     0xxxxxxx
            res.push(str.charAt(i));
          } else if (code >= 0x0080 && code <= 0x07FF) {
            // 双字节
            // U+00000080 – U+000007FF     110xxxxx 10xxxxxx
            // 110xxxxx
            var byte1 = 0xC0 | ((code >> 6) & 0x1F);
            // 10xxxxxx
            var byte2 = 0x80 | (code & 0x3F);
            res.push(
              String.fromCharCode(byte1),
              String.fromCharCode(byte2)
            );
          } else if (code >= 0x0800 && code <= 0xFFFF) {
            // 三字节
            // U+00000800 – U+0000FFFF     1110xxxx 10xxxxxx 10xxxxxx
            // 1110xxxx
            var byte1 = 0xE0 | ((code >> 12) & 0x0F);
            // 10xxxxxx
            var byte2 = 0x80 | ((code >> 6) & 0x3F);
            // 10xxxxxx
            var byte3 = 0x80 | (code & 0x3F);
            res.push(
              String.fromCharCode(byte1),
              String.fromCharCode(byte2),
              String.fromCharCode(byte3)
            );
          } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
            // 四字节
            // U+00010000 – U+001FFFFF     11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
          } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
            // 五字节
            // U+00200000 – U+03FFFFFF     111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
          } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
            // 六字节
            // U+04000000 – U+7FFFFFFF     1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
          }
        }
        return res.join('');
      },
      UTF8ToUTF16: function (str) {
        var res = [], len = str.length;
        var i = 0;
        for (var i = 0; i < len; i++) {
          var code = str.charCodeAt(i);
          // 对第一个字节进行判断
          if (((code >> 7) & 0xFF) == 0x0) {
            // 单字节
            // 0xxxxxxx
            res.push(str.charAt(i));
          } else if (((code >> 5) & 0xFF) == 0x6) {
            // 双字节
            // 110xxxxx 10xxxxxx
            var code2 = str.charCodeAt(++i);
            var byte1 = (code & 0x1F) << 6;
            var byte2 = code2 & 0x3F;
            var utf16 = byte1 | byte2;
            res.push(Sting.fromCharCode(utf16));
          } else if (((code >> 4) & 0xFF) == 0xE) {
            // 三字节
            // 1110xxxx 10xxxxxx 10xxxxxx
            var code2 = str.charCodeAt(++i);
            var code3 = str.charCodeAt(++i);
            var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
            var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
            var utf16 = ((byte1 & 0x00FF) << 8) | byte2
            res.push(String.fromCharCode(utf16));
          } else if (((code >> 3) & 0xFF) == 0x1E) {
            // 四字节
            // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
          } else if (((code >> 2) & 0xFF) == 0x3E) {
            // 五字节
            // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
          } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
            // 六字节
            // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
          }
        }
        return res.join('');
      },
      encode: function (str) {
        if (!str) {
          return '';
        }
        var utf8 = this.UTF16ToUTF8(str); // 转成UTF8
        var i = 0; // 遍历索引
        var len = utf8.length;
        var res = [];
        while (i < len) {
          var c1 = utf8.charCodeAt(i++) & 0xFF;
          res.push(this.table[c1 >> 2]);
          // 需要补2个=
          if (i == len) {
            res.push(this.table[(c1 & 0x3) << 4]);
            res.push('==');
            break;
          }
          var c2 = utf8.charCodeAt(i++);
          // 需要补1个=
          if (i == len) {
            res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
            res.push(this.table[(c2 & 0x0F) << 2]);
            res.push('=');
            break;
          }
          var c3 = utf8.charCodeAt(i++);
          res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
          res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
          res.push(this.table[c3 & 0x3F]);
        }
        return res.join('');
      },
      decode: function (str) {
        if (!str) {
          return '';
        }
        var len = str.length;
        var i = 0;
        var res = [];
        while (i < len) {
          var code1 = this.table.indexOf(str.charAt(i++));
          var code2 = this.table.indexOf(str.charAt(i++));
          var code3 = this.table.indexOf(str.charAt(i++));
          var code4 = this.table.indexOf(str.charAt(i++));
          var c1 = (code1 << 2) | (code2 >> 4);
          var c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
          var c3 = ((code3 & 0x3) << 6) | code4;
          res.push(String.fromCharCode(c1));
          if (code3 != 64) {
            res.push(String.fromCharCode(c2));
          }
          if (code4 != 64) {
            res.push(String.fromCharCode(c3));
          }
        }
        return this.UTF8ToUTF16(res.join(''));
      }
    };
    return JSON.parse(this.hexCharCodeToStr(Base64.decode(str)));
  },
  hexCharCodeToStr: function (hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x"?trimedStr.substr(2):trimedStr;
    var len = rawStr.length;
    if (len % 2 !== 0) {
      alert("Illegal Format ASCII Code!");
      return "";
    }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
      resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
  },
  encrypt: function (text) {
    var key = CryptoJS.enc.Utf8.parse('1234567890654321'); //为了避免补位，直接用16位的秘钥
    var iv = CryptoJS.enc.Utf8.parse('1234567890123456'); //16位初始向量
    var encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });
    var hexStr = encrypted.ciphertext.toString().toUpperCase();
    var oldHexStr = CryptoJS.enc.Hex.parse(hexStr);
    var data = CryptoJS.enc.Base64.stringify(oldHexStr);
    return data;
  },

  /**
   * 时间戳转换
   */
  timestr: function (number,type) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var time = type == 'year' ? (Y + M + D) : (M + D);
    return time;
  },

  /**
   * 时间戳转换
   */
  datestr: function (number) {
    var date = new Date(number);
    var M = date.getMonth() + 1 + '月';
    var D = date.getDate() + '日';
    var time = (M + D);
    return time;
  }
})