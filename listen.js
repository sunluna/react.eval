var sun = require("./base");
(function (sun) {
    //观察者模式
    sun.listen = function (__this) {
        var on, log, obj, one, remove, fire;
        obj = {};
        __this = __this || this;
        //注册监听事件
        on = function (key, eventfn) {
            var stack, _ref;  //stack是盒子
            stack = (_ref = obj[key]) != null ? _ref : obj[key] = [];
            return stack.push(eventfn);
        };
        //注册唯一监听事件
        one = function (key, eventfn) {
            remove(key);
            return on(key, eventfn);
        };
        //清除指定的所有事件
        remove = function (key) {
          var _ref= obj[key];
          (_ref) != null ? _ref.length = 0 : void 0;
          try {
            delete obj[key];
          } catch (e) {
            obj[key] = undefined;
          }
        };
        //触发事件
        fire = function () {
            var fn, stack, _i, _len, _ref, key, args;
            args = [].slice.call(arguments, 0)
            key = args.shift();
            stack = (_ref = obj[key]) != null ? _ref : obj[key] = [];
            var result;
            for (_i = 0, _len = stack.length; _i < _len; _i++) {
                fn = stack[_i];
                result = fn.apply(__this, args);
            }
            // 返回值为事件列表的最后一个结果
            return result;
        };
        //返回可执行的相关方法
        return {
            on: on,
            one: one,
            remove: remove,
            fire: fire
        };
    };
    //对指定的控制变量追加观察者模式的方法
    sun.Listen =function (that, full) {
        full = full === undefined ? false : (!!full);
        var result = sun.listen(that);
        if (full) {
            for (var key in result) {
                that[key] = result[key];
            }
        } else {
            //简单模式下只附加最关键的方法到控制变量
            that.on = result.on;
            that.fire = result.fire;
        }
        return that;
    };
})(sun);
module.exports=sun;
