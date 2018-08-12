var sun = require("./base");
(function (sun) {
    //观察者模式
    sun.listen = function (__this) {
      var listener;
      listener = {
        // 事件池
        pool: {},
        // 初始化
        _init: function (key) {
          if (!sun.isArray(listener.pool[key])) {
            listener.pool[key] = [];
          }
          return listener.pool[key];
        },
        // 注册监听
        on: function (key, func) {
          listener._init(key).push(func);
        },
        // 删除指定名称的监听池
        remove: function (key) {
          try {
            delete listener.pool[key];
          } catch (e) {
            listener.pool[key] = undefined;
          }
        },
        // 注册单一监听方法
        one: function (key, func) {
          listener.remove(key);
          listener.on(key, func);
        },
        // 注册单次监听器，方法使用一次就移出队列
        once: function (key, func) {
          var newFunc = function () {
            var that = this;
            var args = [].slice.call(arguments, 0);
            var result;
            try {
              result = func.apply(that, args);
            } catch (e) {
              //
            }
            var events = listener._init(key);
            var index = events.indexOf(newFunc);
            if (index !== -1) {
              // 删除事件方法
              events.splice(index, 1);
            }
            return result;
          };
          listener.on(key, newFunc);
        },
        // 触发监听事件 function写法才能获取arguments
        fire: function (key) {
          var that = __this;// 这里要越过第一个参数
          var args = [].slice.call(arguments, 1);
          var result;
          var events = listener._init(key);
          for (var i = 0; i < events.length; i++) {
            var x = events[i];
            if (x) {
              try { // 返回结果等于队列最后一个成功执行的方法返回值
                result = x.apply(that, args);
              } catch (e) {
                //
              }
            }
          }
          return result;
        }
      };
      return {
        on: listener.on,
        one: listener.one,
        once: listener.once,
        fire: listener.fire,
        remove: listener.remove
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
