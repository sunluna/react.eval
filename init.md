# 关于 decorators

本组件推荐 安装  babel-plugin-transform-decorators-legacy

如果由于某种原因不能安装 babel-plugin-transform-decorators-legacy

可以考虑如下两种方式注册组件

1、在constructor中声明

```
import React from 'react';
import { ref } from 'react.eval';

class Toast extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      show:false,
    };
    ref(this);
  }
  show=()=>{
    this.setState({
      show:true,
    });
  }
  render() {
    const { show } = this.state;
    return show && (
      <div>Hello world!!!</div>
    );
  }
}
export default Toast;
```

2、export之前使用 ref 包装,效果与使用 decorators 等同

```
import React from 'react';
import { ref } from 'react.eval';

class Toast extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      show:false,
    };
  }
  show=()=>{
    this.setState({
      show:true,
    });
  }
  render() {
    const { show } = this.state;
    return show && (
      <div>Hello world!!!</div>
    );
  }
}
export default ref(Toast);
```



