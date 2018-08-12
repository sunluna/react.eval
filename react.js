var sun = require("./base");
require('./mix');
require('./until');
require('./await');
require('./listen');
//---------先引用一波js，能引用的都引用了----------------
!function (sun) {
  //默认的空方法
  var defM = function () { };
  // 命令行输出
  var cmd = typeof console == 'undefined' ? { error: defM, log: defM } : console;
  // 随机种子的键
  var seedKey = '__kfgoid__';
  // 随机种子
  var seeds = function () {
    return Number(Number(Math.random().toString().replace("0.", "").substr(0, 9)));
  };
  // 当前种子
  var seed;
  // 搜索全局随机种子键
  if (!global[seedKey]) {
    // 没有就生成一个
    seed = global[seedKey] = seeds();
  }
  // 简易偏移算法
  var c = function (text, k) {
    text = text + "";
    k = k || (seedKey + sun.version + seed);
    k = k + "";
    var last = "";
    for (var i = 0; i < text.length; i++) {
      for (var j = 0; j < k.length; j++) {
        var tmpKey = k.charCodeAt(j);
        var text2 = text.charCodeAt(i) ^ tmpKey;
      }
      last += String.fromCharCode(text2);
    }
    return last;
  };
  // 缓存混淆结果
  var d = {};
  // 简易混淆字符的方法
  var enc = function (str) {
    if (react.isChunk) {
      // 如果已经被单独提取则不加密
      return str;
    }
    // 缓存混淆结果
    if (d[str]) {
      return d[str];
    }
    var r = c(encodeURIComponent([].slice.call(str + '').reverse().join('')));
    d[str] = r;
    return r;
  };
  //事件池键
  var aliass = enc(seed * 17).toLowerCase();
  //加载或渲染完成标记
  var done = "__done__";
  // 注册完成标记
  var inited = "__inited__";
  // 内存环境全局键
  var globalKey = "__reacte__";
  // 记录类name的键值，用于调试
  var namePropKey = "__name__";
  // 全局的实例池
  var pool = {};
  //全局基变量
  var b;
  if (sun.b) {
    //浏览器环境
    b = document.documentElement;
  } else {
    //其他环境直接使用全局变量
    b = global[globalKey] = global[globalKey] || {};
  }
  //数据仓库不存在就进行初始化
  b[aliass] = b[aliass] || {};
  // 检查观察者模式
  if (!sun.isFunction(b[aliass].on)) {
    //注册观察者模式属性
    sun.Listen(b[aliass], 1);
  }
  // 向事件池中注册方法
  b[aliass].on('init', function (that) {
    var key = enc(that.id);
    pool[key] = that;
  });
  // 删除属性
  var _dis = function (base, key) {
    try {
      delete base[key];
    } catch (e) {
      base[key] = undefined;
    }
  }
  // 清空对象
  var dis = function (base) {
    for (var key in base) {
      _dis(base, key);
    }
  };
  // 清除事件注册
  b[aliass].on('dispose', function (that) {
    var key = enc(that.id);
    // 移除实例
    _dis(pool, key);
    // 移除enc缓存
    _dis(d, that.id);
    // 清理实例
    dis(that);
    that = null;
  });
  // 检查执行方法
  var analysis = function (path) {
    path = path || "";
    var result = { done: false, method: defM };
    var ary = path.split('.');
    var id = ary[0];
    var encid = enc(id);
    // 检查 是否加载完成
    var check = pool[encid] && pool[encid][done];
    if (check) {
      //如果检查通过
      result.done = true;
      var key = ary[1];
      var args = [].slice.call(arguments, 1);
      result.method = function () {
        return pool[encid][key].apply(pool[encid], args);
      };
    }
    return result;
  };
  //配置属性中传递过来的方法
  var clearM = function (that, props) {
    var thatObj = {
      state: {}
    };
    props = props || that.props || {};
    that.state = that.state || {};
    for (var key in props) {
      if (key in that) {
        if (sun.isFunction(that[key])) {
          //如果是实例属性中的函数
          thatObj[key] = props[key].bind(that);
        } else {
          //如果是实例属性
          thatObj[key] = props[key];
        }
      } else if (key in that.state) {
        //如果是在state中存在的量
        thatObj.state[key] = props[key];
      }
    }
    //合并属性到实例,如果既不在实例中声明，也没有在state中声明，那就留在props里面好了
    sun.mix([1], that, thatObj);
  };

  var defMethod = function () {
    return {
      componentDidMount: function () {
        //初次加载完成后设置可以操作标记
        this[done] = 1;
      },
      shouldComponentUpdate: function (nextProps, nextState, parentContext) {
        //屏蔽外部调用
        this[done] = 0;
        //复制最新属性到实例
        clearM(this, nextProps);
        return true;
      },
      forceUpdate: function () {
        // 屏蔽外部调用
        this[done] = 0;
      },
      componentDidUpdate: function (prevProps, prevState, prevContext) {
        //完成控件更新后允许进行外部方法操作
        this[done] = 1;
      },
      componentWillUnmount: function () {
        // 移除事件
        b[aliass].fire('dispose', this);
      }
    };
  };
  // 全能分流函数
  function react() {
    var target = arguments[0];
    if (sun.isFunction(target)) {
      // 执行deco
      return react.deco(target);
    } else if (sun.isPlainObject(target) && target || target.render) {
      // 执行init
      return react.init(target);
    } else if (sun.test(target, 'string')) {
      target = target || "";
      if (target.indexOf('.') != -1) {
        // 执行eval
        return react.eval.apply(null, [].slice.call(arguments, 0));
      } else {
        // 直接获取实例
        return react.get(target);
      }
    }
  };
  // 装饰器函数
  react.deco = function (target) {
    var newTarget;
    newTarget = function () {
      var that = this;
      var args = [].slice.call(arguments, 0);
      // 执行默认的构造函数
      var tmpResult = target.apply(that, args);
      // 执行完默认的构造函数后执行注册到全局
      react.init(that);
      return tmpResult;
    };
    // 复制原型链欺骗继承检测
    newTarget.prototype = target.prototype;
    // 复制静态属性
    for (var key in target) {
      newTarget[key] = target[key];
    }
    if (!newTarget.__orgMethod) {
      // 备份原来的constructor
      newTarget.__orgMethod = target;
      newTarget[namePropKey] = target.name;
    }
    return newTarget;
  };
  /**
   * 初始化方法（渲染默认生命周期）
   * @param {any} that
   * @param {any} key
   * @param {any} def
   */
  var _init = function (that, key, def) {
    var org = that[key];
    if (that[key] && that[key].__orgMethod) {
      //如果是已经注册过的方法
      org = that[key].__orgMethod;
    }
    var newMethod = function () {
      var args = [].slice.call(arguments, 0);
      //自定义方法执行
      var newFunc = function () {
        if (!org) {
          //如果没有自定义方法
          return undefined;
        }
        return org.apply(that, args);
      };
      //默认方法执行
      var defFunc = function () {
        return def[key].apply(that, args);
      };
      //声明结果
      var defResult, newResult;
      if (key === "componentWillUnmount") {
        //组件卸载的默认方法放在最后执行，防止因为变量属性删除导致自定义方法无法访问实例
        newResult = newFunc();
        defResult = defFunc();
      } else {
        //其他场景先执行默认方法，后执行自定义方法
        defResult = defFunc();
        newResult = newFunc();
      }
      newResult = (newResult === undefined) ? defResult : newResult;
      if (newResult === false && key == "shouldComponentUpdate") {
        //如果不允许刷新，则标记为完成
        that[done] = 1;
      }
      return newResult;
    };
    //记录原始方法
    newMethod.__orgMethod = org;
    //覆盖到实例中
    that[key] = newMethod;
  };
  /**
     * 注册控件实例 react.init(this)
     * @param that 控件实例
     */
  react.init = function (that) {
    if (that[inited]) {
      cmd.error(that.id + ':inited');
      return;
    }
    var props = that.props || {};
    var def = defMethod();
    //覆盖属性中的方法到实例
    clearM(that, props);
    //如果没有id就生成一个 //2018-03-23 如果内部自己指定了一个id，就需要使用指定的id，不再生成随机字符串
    that.id = that.id || props.id || (seeds());
    //标记禁止外部函数操作
    that[done] = 0;
    that[namePropKey] = that.constructor.name;
    //注册方法
    for (var key in def) {
      _init(that, key, def);
    }
    // 注册事件监听
    b[aliass].fire('init',that);
    that[inited] = 1;
  };
  // 防止某些组件正处于不可修改状态的时候被调用方法
  var _check = function (path) {
    var result = analysis(path);
    result.method = defM;
    return result.done;
  };
  // 执行控件方法
  var _do = function (path) {
    return analysis.apply(null, [].slice.call(arguments, 0)).method();
  };
  // 内部执行的方法
  var _eval = _do.until({
    when: _check,//35毫秒检查一次
    retry: 35,
    //最多等待3秒
    timeout: 3000
  }).await();
  /**
      * 执行指定控件的方法  react.eval("id.test",参数1，参数2,...)
      * @param path String id.方法名
      * @returns 方法返回值 // 跟踪到最深层的Promise
      */
  react.eval = function (path) {
    var timeout = 0;
    var that = this;
    var args = [].slice.call(arguments, 0);
    var p = new Promise(function (y, n) {
      timeout = setTimeout(function () {
        // 按照原来的方法调用
        _eval.apply(that, args).then(y, n);
      }, 0);
    });
    // 某些方法并不会修改状态，而是为了获取数据，使用此方法可以立刻执行控件对应方法
    var tmp = function () {
      // 清除延时，防止重复执行
      clearTimeout(timeout);
      if (_check(path)) {
        // 如果可以被立刻调用，则直接返回结果
        return _do.apply(that, args);
      } else {
        cmd.error(path + ' access denied');
      }
    };
    // 伪造相关属性
    tmp.then = function (x, y) { return p.then(x, y); };
    tmp.catch = function (x) { return p.catch(x); };
    // 返回伪装
    return tmp;
  };
  // 直接根据id获取某组件的实例（无延迟）
  react.get = function (id) {
    return pool[enc(id)];
  };
  /*
  react.eval 默认把事件池注册到公共变量中，这是因为某些项目是按需加载，并且react.eval不在chunk配置中
  如果react.eval被配置了chunk，只会被加载一次，此时把事件池放到局部变量里就可以了
  也可以用此方法转移react.eval事件池位置
  */
  react.chunk = function (newBase) {
    newBase = newBase || {};
    var p = b[aliass];
    // 删除全局事件池
    _dis(b, aliass);
    // 删除全局随机种子
    _dis(global, seedKey);
    if (!(aliass in newBase)) {
      // 已经存在的情况下只改变引用
      newBase[aliass] = p;
    }
    b = newBase;
    // 标记被单独提取
    react.isChunk = 1;
    return react;
  };
  // 判别是否已经提取过
  react.isChunk = 0;
  // 占用ref和react两个别名
  sun.ref = sun.react = react;
  // 代理引用，如果支持Proxy
  var refs;
  if (typeof Proxy === 'function') {
    refs = new Proxy({}, {
      get: function (obj, key) {
        return react.get(key);
      }
    });
    // 注册引用实例的代理，占用refs别名
    sun.refs = refs;
  }
}(sun);
//--------注册全局--------------------- 
module.exports = sun;
