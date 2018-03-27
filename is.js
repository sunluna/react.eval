var sun=require("./type");

//IS 常用类型判别 @核心
(function (sun) {
    //检测对象是否是空对象
    sun.isEmptyObject = function (a) {
        if (!sun.isPlainObject(a)) { return false; }
        var b; for (b in a) return !1; return !0;
    };
    //判断对象是否是空数组
    sun.isEmptyArray = function (a) {
        return sun.isArray(a) && a.length == 0;
    };
    //检测对象是否是函数
    sun.isFunction = function (a) {
        return sun.test(a, "function");
    };
    //检测对象是否是普通对象
    sun.isPlainObject = function (a) {
        return sun.test(a, "object");
    };
    //检测对象是否是数组
    sun.isArray = function (a) {
        return sun.test(a, "array");
    };
})(sun);

module.exports=sun;
