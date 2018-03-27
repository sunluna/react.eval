var sun = require("./base");
//Type 类型判别 @核心
(function (sun) {
    //@判定是否继续执行业务,判断对象是否是指定的类型
    sun.test = function (obj, target) {
        if (target == undefined) {
            if (obj == undefined) {
                return false;
            } else {
                return true;
            }
        }
        if (sun.type(obj) == target) {
            //如果属性符合指定类型，则为真
            return true;
        } else {
            return false;
        }
    };
    //判断某个对象的确切类型
    sun.type = function (o) {
        if (o === undefined) {
            return "undefined";
        } else if (o === null) {//在低版本浏览器下，null会被认为是object
            return "null";
        }
        if (o.jquery !== undefined) {
            //禁止复制jquery对象
            return "jquery";
        }
        var s = Object.prototype.toString.call(o);
        return s.substring(8, s.length - 1).toLowerCase();
    };
})(sun);

module.exports=sun;
