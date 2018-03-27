var sun = require("./mix");
/**
    * 确保函数在一定的时间内只能执行一次,并且方法不会被重叠调用,仅适用于不需要返回值的函数
    * @param {function} func 需要执行延时的函数
    * @param {int} delay 延时
    * @param {boolean} keep 函数调用结束后,是否继续锁定防止其他函数调用,默认为false.
    * @param {boolean} race 是否采用竞速模式,race遵循先到先执行(在规定的时间内只会执行一次).如果设置为false 则等到延时结束后才执行并且按照最新的参数执行
    * @param {boolean} block,当到达delay规定的时间时,立即执行函数.默认为false,延迟0毫秒之后执行
    * @returns {function} 经过改造后的函数 
    */
sun.lock = function (func, delay, keep, race, block) {
    //空值处理
    func = func || function () { };
    //参数控制:默认延时10毫秒，不使用竞速模式，
    var def = { delay: 10, race: true, keep: false, block: false };
    if (sun.isPlainObject(delay)) {
        //兼容多种参数传递方式
        race = delay.race;
        keep = delay.keep;
        block = delay.block;
        delay = delay.delay;
    }
    //经过处理后的参数
    var param = sun.mix(undefined, def, {
        delay: delay, race: race, keep: keep, block: block
    });
    //----------------------------------------------------
    var fixFunc;
    fixFunc = function () {
        var that = this;
        var args = [].slice.call(arguments, 0);
        var p = new Promise(function (y, n) {
            var now = new Date();
            var expire = new Date(now - 0 + param.delay);
            //如果函数已经锁定，则直接返回
            if (fixFunc._lock) {
                n({});
                return that;
            }
            //延时后执行
            var finish = function (delay) {
                delay = delay || false;
                //先对函数执行锁定操作
                fixFunc._lock = true;
                var done = function () {
                    try {//这里设定延时是为了让紧跟在后面的函数扑个空直接返回
                        y(func.apply(that, args));
                        //内部方法至少传递一个参数，不能是undefined
                        fixFunc.unlock(null);
                    } catch (e) {
                        //将错误信息传递给解锁函数
                        fixFunc.unlock(e);
                        n(e);
                    }
                };
                if (delay) {
                    fixFunc._timeout = setTimeout(done, 0);
                } else {
                    done();
                }
            };
            if (param.race) {
                //判定是否发生了延时
                fixFunc.overtime();
                if (fixFunc._busy) {
                    //竞速模式下，如果遇到计时开始，也直接返回
                    n({});
                    return that;
                }
                //如果采用竞速规则,先到先执行
                //立刻将忙碌标志设置为true
                fixFunc._busy = true;
                //设定函数的超时时间
                fixFunc._time = expire;
                //延时0秒观察是否还有请求
                finish(param.block ? false : true);
            } else {
                //如果需要在指定的时间之内取最后的参数进行执行
                if (!fixFunc._busy) {
                    //如果没有开始计时，则设置计时开始
                    fixFunc._busy = true;
                    //设定过期时间
                    fixFunc._time = expire;
                } else {
                    //如果计时已经开始，遵循后来者居上的规则，清除之前设置的计时器
                    clearTimeout(fixFunc._timeout);
                }
                //设定自己在规定的时间后执行
                var lastTime = fixFunc._time - now;
                lastTime = lastTime < 0 ? 0 : lastTime;
                if (param.block && lastTime == 0) {
                    //重置时间延后
                    fixFunc._time = expire;
                    finish(false);
                } else {
                    fixFunc._timeout = setTimeout(finish, lastTime);
                }
            }
            return that;
        });
        return p;
    };
    //锁定时间的标记(可能是计时开始)
    fixFunc._busy = false;
    //函数锁定的标记(通常是因为函数正在执行)
    fixFunc._lock = false;
    //函数执行到期时间
    fixFunc._time = new Date();
    //保留的计时器
    fixFunc._timeout = 0;
    //储存当前的函数
    fixFunc.__base = func;
    //储存当前的配置
    fixFunc.__config = param;
    //判断延时的处理操作
    fixFunc.overtime = function () {
        var date = new Date();
        //检测一下是否超时
        var isOverTime = (date - fixFunc._time) > 0;
        if (isOverTime) {
            //如果发生了超时，则设定_busy为false
            fixFunc._busy = false;
            fixFunc._time = date;
        }
    };
    //函数的解锁方法
    fixFunc.unlock = function (e) {
        if (e === undefined || (e && e.message)) {
            //如果出现错误或未定义,则全部解锁
            fixFunc._busy = false;
            fixFunc._lock = false;
            fixFunc._time = new Date();
        } else {
            //竞速模式下，首先要看是否需要保持锁定状态
            if (!param.keep) {
                //如果不需要保持锁定
                fixFunc._lock = false;
            }
            //判断是否发生了延时
            fixFunc.overtime();
        }
    };
    //函数的执行中状态
    fixFunc.state = function () {
        if (param.race) {
            //忙碌状态或者锁定状态都属于执行中状态
            return (fixFunc._busy || fixFunc._lock);
        } else {
            //非竞速状态下只有锁定的时候才算执行中
            return fixFunc._lock;
        }
    };
    //函数的克隆方法
    fixFunc.clone = function () {
        var newFunc = func;
        if (func.clone) {
            newFunc = func.clone();
        }
        return sun.lock.call(null, func, delay, keep, race, block);
    };
    //储存原始的函数
    fixFunc.base = function () {
        var newFunc = func;
        if (func.base && sun.isFunction(func.base)) {
            newFunc = func.base();
        }
        return newFunc;
    };
    return fixFunc;
};
//简化版本的lock函数
Function.prototype.lock = function (delay, keep, race, block) {
    var that = this;
    var args = [that].concat([].slice.call(arguments, 0));
    return sun.lock.apply(that, args);
};
module.exports=sun;
