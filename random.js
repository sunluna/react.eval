var sun = require("./base");
(function (sun) {
  //Random 随机字符 @核心
  //@生成最长9位的int数据负值随机数
  sun.minus = function () {
    return -Number(Math.random().toString().replace("0.", "").substr(0, 9));
  };
  //生成仿制guid
  sun.guid = function () {
    var getGuidGenerator = function () {
      var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };
    return getGuidGenerator();
  };
  //生成随机id,一般用于给页面元素设置随机id
  sun.id = function () {
    return "_" + (-sun.minus());
  };
})(sun);
module.exports = sun;
