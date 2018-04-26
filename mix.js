var sun = require("./is");
//参数合并
(function (sun) {
  //@合并json数据2
  /**
   * 复制扩展,对于函数，只支持向function中合并对象object，不支持两个function合并
   * 深度复制(true:覆盖;false：不覆盖;null:保留非空项)；浅表复制(1:覆盖;0:不覆盖;undefined:保留非空项)
   * 表单复制(支持以上所有，但是模式应当设置为对应的 数组形式 [true],[false],[null],[1],[0],[undefined])
   * 可以使用新名称调用sun.mix
   * @param deep
   * @param des 
   * @param src
   * @returns
   */
  sun.mix = function (deep, des, src) {
    //使用类型校验
    var type = sun.type;
    //判断是否是form模式
    var isForm = sun.isArray(deep) && deep.length == 1;
    if (isForm) {deep = deep[0]; }
    //确定参数中是否包含deep
    var hasDeep = deep == true || deep == false || deep == null;
    //判断一下第一个参数是不是布尔值，数字，或者数组
    if (arguments.length == 2) {
      return sun.mix(true, deep, des);
    } else if (arguments.length == 1) {
      return sun.mix(true, sun, deep);
    } else if (arguments.length >= 3 && (!hasDeep)) {
      return sun.mix.apply(sun.mix, [true].concat([].slice.call(arguments, 0)));
    }
    //深度的字符串格式配置
    var deepType = deep + "";
    //判定是否是深复制模式
    var isDeep = /^(true|false|null)$/.test(deepType);
    //测试目标是否是对象或数组
    var objtest = /^(object|array)$/;
    //判断来源对象是否自带克隆函数，如果是，则使用克隆函数执行
    function clone(src) {
      if (sun.isFunction(src) && sun.isFunction(src.clone) && src.clone.length == 0) {//如果存在克隆函数，则执行
        try { return src.clone(); } catch (ex) { return src; }
      }
      return src;
    }
    //循环赋值
    function ext(targetSrc, i, des) {
      if (targetSrc === des || i == undefined || (isNaN(i) && sun.mix.skipKeys.indexOf(i) !== -1)) { return; }
      des[i] = inner(des[i], targetSrc);
    }
    var inner = function (des, src) {
      var flag = 0;
      var desType = type(des);
      desType = desType == "function" ? "object" : desType;
      var srcType = type(src);
      //测试来源是否是对象或数组
      var objtestsrc = objtest.test(srcType);
      if (des === src) {//1
        flag = 1;
      }//类型不一样或者合并来源不是object或array
      if (!flag && (srcType != desType || !objtestsrc)) {//2
        if (deep == true ||(deep == null &&src!=null)) {
          des = null; desType = "null";
        }
      }
      if (!flag && (des == null || (isForm && !isDeep && (sun.isEmptyArray(des) || sun.isEmptyObject(des))))) {//3
        if (isDeep && objtestsrc) {
          des = srcType == "object" ? {} : [];
          desType = srcType;
        } else {
          (deep == 0 && des !== undefined
            || deep == null && src === undefined)
            ||( des = clone(src));
          flag = 1;
        }
      }
      if (!flag && srcType == "array" && isForm && src.length < des.length) {//4
        des = des.slice(0, src.length);
      }
      if (!flag && isDeep && srcType == "array") {
        src = src.slice(0);//5
      }
      if (!flag) {//6
        for (var i in src) {
          try { ext(src[i], i, des); } catch (e) { continue; }
        }
      }
      return des;
    };
    des = inner(des, src);
    if (arguments.length > 3) {//7
      for (var i = 3; i < arguments.length; i++) {
        des = inner(des, arguments[i]);
      }
    }
    return des;
  };//需要跳过的属性
  sun.mix.skipKeys = [];
})(sun);
module.exports = sun;
