var sun = require("./is");
//参数合并
(function (sun) {
    //@合并json数据1
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
    sun.mix =  function (deep, des, src) {
        //使用类型校验
        var type = sun.type;
        var desType = type(des);
        //如果是合并目标是函数，则按照对象来合并。拒绝合并来源对象是function，有严重的性能问题，而且没必要，来源是function时，十有八九是其他js库
        desType = desType == "function" ? "object" : desType;
        var srcType = type(src);
        //记录原始的deep形式
        var orgDeep = deep;
        //判断是否是form模式
        var isForm = sun.isArray(deep) && deep.length == 1;
        if (isForm) {
            deep = deep[0];
        }
        //确定参数中是否包含deep
        var hasDeep = deep == true || deep == false || deep == null;
        //---------------------------------------------------------------------------
        //判断一下第一个参数是不是布尔值，数字，或者数组
        if (arguments.length == 2) {
            return sun.mix(true, deep, des);
        } else if (arguments.length == 1) {
            return sun.mix(true, sun, deep);
        } else if (arguments.length >= 3 && (!hasDeep)) {
            return sun.mix.apply(sun.mix, [true].concat([].slice.call(arguments,0)));
        }
        //-----------------------------------------------------------------------------
        //步骤结束标记
        var endFlag = false;
        //深度的字符串格式配置
        var deepType = deep + "";
        //判定是否是深复制模式
        var isDeep = /^(true|false|null)$/.test(deepType);
        //测试目标是否是对象或数组
        var objtest = /^(object|array)$/;
        //测试来源是否是对象或数组
        var objtestsrc = objtest.test(srcType);
        //-----------------------------------------------------------------------------
        //如果来源对象和目标对象绝对相等，则不进行复制操作
        if (des === src) {
            endFlag = true;
        }
        //-----------------------------------------------------------------------------
        //如果目标为空，则不论什么情况，都应当赋值
        if (des == null && endFlag === false) {//1
            if (isDeep && objtestsrc) {
                des = srcType == "object" ? {} : [];
                desType = type(des);
            } else {
                (deep == 0 && des !== undefined) || (des = cloneFunc(src));
                endFlag = true;
            }
        }
        //---------------------------------------------------------------------------------
        //如果两者的类型不相同,或者来源数据类型不是对象和数组，则直接赋值
        if ((srcType != desType || (!objtestsrc)) && endFlag === false) {//2
            if (deep == true || (deep == null && src != null)) {//
                des = sun.mix(orgDeep, null, src);//类型不同的赋值兼容深度和浅表
            }
            endFlag = true;
        }
        //----------------------------------------------------------------------------------
        //特殊Form定制
        if (isForm && (!isDeep) && endFlag === false) {
            //如果不是深复制,并且目标对象是空对象或者空数组，则直接赋值
            if (sun.isEmptyArray(des) || sun.isEmptyObject(des)) {
                des = cloneFunc(src);
                endFlag = true;
            }
        }
        //------------------------------------------------------------------------------------
        //循环赋值
        function extFunc(targetSrc, i, des) {
            if (targetSrc === des || i == undefined) return;
            //无条件 2015/12/9
            des[i] = sun.mix(orgDeep, des[i], targetSrc);
        }
        //判断来源对象是否自带克隆函数，如果是，则使用克隆函数执行
        function cloneFunc(src) {
            //这里不可以无限扩大适用范围，仅针对function生效;对象Object中的该函数有可能是别的用途,数组用不到此功能
            if (sun.isFunction(src) && sun.isFunction(src.clone) && src.clone.length == 0) {
                //如果存在克隆函数，则执行
                try { return src.clone(); } catch (ex) { return src; }
            }
            return src;
        }
        if ((srcType == "array") && endFlag === false) {//4
            if (isForm && src.length < des.length) {
                //by:孙兴璐 2015-06-15 将判断条件拿出来，防止结果为空数组时不执行的bug
                //特殊定制，如果源的数组长度比较小，则截断
                des = des.slice(0, src.length);
            }
            for (var i = 0; i < src.length; i++) {
                try {
                    var targetSrc;
                    if (isDeep) {//专有逻辑，如果使用深复制，则使用新数组
                        targetSrc = src.slice(i, i + 1)[0];
                    } else {
                        targetSrc = src[i];
                    }
                    extFunc(targetSrc, i, des);
                } catch (e) {
                    continue;
                }
            }
            endFlag = true;
        }
        if ((srcType == "object") && endFlag === false) {//5
            for (var i in src) {
                //越过有坑的属性,可以动态改变
                if (sun.mix.skipKeys.indexOf(i) !== -1)
                    continue
                var targetSrc = src[i];
                try {
                    extFunc(targetSrc, i, des);
                } catch (e) {
                    continue;
                }
            }
            endFlag = true;
        }
        if (arguments.length > 3) {//6
            for (var i = 3; i < arguments.length; i++) {
                des = sun.mix(orgDeep, des, arguments[i]);
            }
        }
        return des;
    };
    //需要跳过的属性
    sun.mix.skipKeys =  [];
})(sun);
module.exports=sun;
