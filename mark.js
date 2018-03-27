var sun = require("./random");
require("./is");
!function (sun) {
  //---------------------
  /*
  //随机标记验证，用于检验是否是最新请求,如果没有发生变更，则执行指定函数
  key 必填 字符串
  base 选填 
  */
  sun.mark = function (key, base) {
    base = base || sun.mark;
    if (!key) {
      throw new Error("必须定义字符串key");
    }
    //生成一个随机值
    var id = sun.id();
    //放入公共区域
    base[key] = id;
    return function (callback) {
      var that = this;
      //判断是否结果相等
      var result = (base[key] === id);
      if (callback) {
        if (result) {
          return callback.call(that);
        }
      } else {
        return result;
      }
    };
  };
  /**
  只能用于无返回值的函数
  */
  Function.prototype.mark = function (key, base) {
    var func = this;
    var wrap;
    var fixFunc = function () {
      var that = this;
      var args = [].slice.call(arguments, 0);
      return wrap(function () {
        return func.apply(that, args);
      });
    };
    wrap = sun.mark(key, base);
    //记录原始函数
    fixFunc.__base = func;
    fixFunc.__config = { key: key, base: base };
    fixFunc.clone = function () {
      var newFunc = func;
      if (func.clone) {
        newFunc = func.clone();
      }
      return newFunc.mark(key, base);
    };
    fixFunc.base = function () {
      var newFunc = func;
      if (func.base && sun.isFunction(func.base)) {
        newFunc = func.base();
      }
      return newFunc;
    };
    return fixFunc;
  };
  //----------------------
}(sun);
module.exports = sun;