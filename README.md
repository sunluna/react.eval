<!DOCTYPE html>
<html>
<body>

# react.eval

## React 组件间通信\(调用指定id的react组件实例\)

#### 我们都知道 document.getElementById\('app'\) 可以用来获得 id 为 app 的dom元素<br/> 
`<div id="app"></div>`

#### 在react环境下，本组件提供获得指定id的react组件实例功能 `refs.toast`
 `<Toast id="toast" />`;

#### 使用本组件需要安装  babel-plugin-transform-decorators-legacy

\([https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy\#readme](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy#readme "如何安装?")\)

webpack1.x 配置=&gt;  webpack.config.js

```
...
module:{
    loaders:[
        {
            test:/.js[x]?$/,
            exclude: /node_modules/,
            loader:'babel-loader',
            query:{
                presets:['es2015','react','stage-0'],
                plugins:['transform-runtime','transform-decorators-legacy']
            }
        }
    ]
}
```

#### 快速开始：

1、注册组件\([相关](/init.md)\)

```
import React from 'react';
import { ref } from 'react.eval';

@ref
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
export default Toast;
```

2、引用组件\([相关](/ref.md)\)

```
...
<HomePage/>
<Toast id="toast" />
...
```

3、任意位置调用组件实例\([更多方式](/refs.md)\)

```
import { refs } from 'react.eval';

...
    somewhere(){

        refs.toast.show();

    }
...
```

# 更多信息请 查阅 [API](/api.md)

# 也可以查看 [原理](/yuan-li.md)

</body>
</html>

