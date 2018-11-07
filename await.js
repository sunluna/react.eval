var sun = require("./is");
/**
 * 处理Promise后可能继续返回Promise的问题
 *包装后，将返回一个等待Promise链条结束后的Promise
 * @param func 待包装的函数
 * @returns
 */
sun.await = function (func) {
  var isThenLike = function (p) { return p && sun.isFunction(p.then);};
  func = func || function () { };
  var fixFunc;
  fixFunc = function () {
    var that = this;
    var args = [].slice.call(arguments, 0);
    var p = new Promise(function (y, n) {
      var check;
      check = function (tmp) {
        try {
          if (isThenLike(tmp)) {
            tmp.then(check, n);
          } else {
            y(tmp);
          }
        } catch (e) {
          n(e);
        };
      };
      check(func.apply(that, args));
    });
    return p;
  };
  fixFunc.__base = func;
  fixFunc.clone = function () {
    var newFunc = func;
    if (func.clone) {
      newFunc = func.clone();
    }
    return sun.await.call(null, func);
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
/**
 * 函数包装器
 *函数必须是一个返回Promise的函数
 * @returns
 */
Function.prototype.await = function () {
  var that = this;
  return sun.await(that);
};