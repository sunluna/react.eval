//基本声明
var sun = function (param) { return new sun.fn.init(param); };
sun.fn = sun.prototype = {
  //初始化函数
  init: function (param) {
    return this;
  }
};
//版本号
sun.version = "1.6.8-alpha0";
//合并原型
sun.fn.init.prototype = sun.fn;
//识别window
sun.w = typeof window !== 'undefined';
//识别document
sun.d = typeof document !== 'undefined';
//识别浏览器环境
sun.b = sun.w && sun.d;
//识别自动加载路径
(function (sun) {
  if (!sun.d) {
    //如果没有文档对象，则返回
    return;
  }
  //基础的加载路径
  sun.base = "";
  //基础js文件路径
  sun.baseSrc = "";
  //记录基础js的文件引用
  sun.baseScript = null;
  var scripts = document.getElementsByTagName('script');
  for (var i = 0; i < scripts.length; i++) {
    var item = scripts[i];
    var src = item.src;
    if (item.getAttribute("sun") == "") {
      //如果想要在没有src引用情况下强行使用sun变量就需要标注sun
      sun.baseScript = item;
    }
    if (!src) continue;
    var m = src.match(/\.?sun\.[\s\S]*?\.?js(?:\?[\s\S]+?)?$/i);
    var lastFslash = src.lastIndexOf("/");
    if (m) {//获得js运行的基本路径
      if (lastFslash != -1) {
        sun.base = src.substring(0, lastFslash + 1);
        sun.baseSrc = src;
        sun.baseScript = item;
      }
      break;
    }
  }
})(sun);
//处理命名冲突
(function (sun) {
  if (!!!sun.baseScript) {
    //如果没有发现主文件路径，则不注册全局变量
    return;
  }
  var _sun = window["sun"];
  var _P = window["_"];
  sun.noConflict = function (deep) {
    if (window["_"] === sun) {
      window["_"] = _P;
    }
    if (deep && window["sun"] === sun) {
      window["sun"] = _sun;
    }
    return sun;
  };
  //注册全局变量
  if (!_P) {
    //如果下划线没有被占用，则注册，否则不注册
    window["_"] = sun;
  }
  //强行注册sun名称
  window["sun"] = sun;
})(sun);
module.exports = sun;
