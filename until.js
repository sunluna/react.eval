var sun = require("./mix");
/**
     * 当满足某个条件的时候才会执行的函数
     * 如果条件满足,函数会立即执行。
     * 如果条件不满足,函数会在指定的时间间隔后重试
     * @param {function} func 需要执行判断的函数
     * @param {function} when 函数执行前进行的判断函数,返回true或false
     * @param {int} retry 如果条件不满足,需要等待的时间(毫秒)
     * @param {int} max 函数最大执行次数,如果为-1 表示不限制最大执行次数
     * @param {int} timeout 超时时间长度(默认不超时，单位是毫秒)
     * @returns {Promise} 
     */
sun.until = function (func, when, retry, max, timeout) {
    //空值处理
    func = func || function () { };
    //默认直接执行,延迟10毫秒,允许执行多次
    var def = { when: true, retry: 10, max: -1, timeout: Number.MAX_VALUE }
    if (sun.isPlainObject(when)) {
        retry = when.retry;
        max = when.max;
        timeout = when.timeout;
        when = when.when;
    }
    var param = sun.mix(null, def, { when: when, retry: retry, max: max, timeout: timeout });
    var fixFunc;
    fixFunc = function () {
        var that = this;
        var args = [].slice.call(arguments, 0);
        var p = new Promise(function (y, n) {
            if (fixFunc._times >= param.max && param.max != -1) {
                n(new Error("times limited"));
                return that;
            }
            //记录最开始的函数执行时间
            fixFunc._time = new Date();
            //每次执行前，清除上一个函数遗留的延时判断函数,保证执行的是最新一次的代码
            fixFunc.clear();
            //内部循环执行的函数
            var innerFunc = function () {
              var check = (sun.test(param.when,"boolean")) ? param.when : param.when.apply(that, args);
                try {
                    if (check) {
                        //这里不允许调整次数增加和代码执行的上下顺序,在代码执行前即加一次代码执行次数屏蔽后续的代码执行
                        fixFunc._times = fixFunc._times + 1;
                        y(func.apply(that, args));
                    } else {
                        //记录当前的时间
                        var now = new Date();
                        //判断是否超时，如果超时，则引发错误
                        if (now - fixFunc._time > param.timeout) {
                            throw new Error("timeout");
                        }
                        //设定延时记录标记，可以用于再次启动时清除之前的延时检查
                        fixFunc._timeout = setTimeout(function () {
                            innerFunc();
                        }, param.retry);
                    }
                } catch (e) {
                    n(e);
                }
            };
            innerFunc();
            return that;
        });
        return p;
    };
    //函数的执行次数
    fixFunc._times = 0;
    //记录最开始的检查时间
    fixFunc._time = new Date();
    //记录上次错误的延时标记
    fixFunc._timeout = 0;
    //储存当前的函数
    fixFunc.__base = func;
    //储存当前的配置
    fixFunc.__config = param;
    //清除上次的错误检查
    fixFunc.clear = function () {
        //清除延时重试操作
        clearTimeout(fixFunc._timeout);
    };
    //储存原始的函数
    fixFunc.base = function () {
        var newFunc = func;
        if (func.base && sun.isFunction(func.base)) {
            newFunc = func.base();
        }
        return newFunc;
    };
    //函数的克隆方法
    fixFunc.clone = function () {
        var newFunc = func;
        if (func.clone) {
            newFunc = func.clone();
        }
        //转接调用
        return sun.until.call(null, newFunc, when, retry, max, timeout);
    };
    return fixFunc;
};
/**
 * 当满足某个条件的时候才会执行的函数
 * 如果条件满足,函数会立即执行。
 * 如果条件不满足,函数会在指定的时间间隔后重试
 * @param {function} when 函数执行前进行的判断函数,返回true或false
 * @param {int} retry 如果条件不满足,需要等待的时间(毫秒)
 * @param {int} max 函数最大执行次数,如果为-1 表示不限制最大执行次数
 * @returns {Promise} 
 */
Function.prototype.until = function (when, retry, max,timeout) {
    var that = this;
    var args = [that].concat([].slice.call(arguments, 0));
    return sun.until.apply(that, args);
};

module.exports=sun;
