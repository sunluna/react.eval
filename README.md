# react.eval

## React 组件间通信

### 不借助Context 和 redux

**调用组件内部方法，定点精准更新组件状态**

**制作易于重用并且自由交互的react组件**

### **安装**

`npm install react.eval --save`

### github:

[https://github.com/sunluna/react.eval](https://github.com/sunluna/react.eval)

### 示例（同级组件交互）

#### 组件B\(被调用\)

```
import React from 'react';
import { ref } from 'react.eval';

/*
如果安装了 babel-plugin-transform-decorators-legacy
https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy#readme
可以这样↓
*/
//@ref 
class BComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content : 'nothing'
    };
    /* 构造方法初始化实例
    如果使用了ES7 decorators，就不用在constructor初始化
    装饰器和constructor初始化任选一种，如果同时使用，则会抛出错误
      */
    ref(this);
  }
  // 提供给外界调用的方法
  changeContent = (str) => {
    console.log("changing"+str);
    this.setState({
      content:str
    });
  }
  render() {
    return <p>
      Component {this.id}:
      {this.state.content}
    </p>;
  }
}
export default BComponent;
```

#### 容器

```
import React from 'react';
import AComponent from './eva';
import BComponent from './evb';

class TEval extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    // 必须给被调用的组件设置一个全局唯一的id才能进行调用
    return (
      <div>
        <AComponent />
        <BComponent id="b"/>
      </div>
    );
  }
}
export default TEval;
```

#### 组件A\(调用者\)

```
import React from 'react';
import { ref } from 'react.eval';

class AComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <p>
      <button onClick={() => {
        /* 在事件方法中 使用 id.方法名 参数1、参数2...方式调用B组件提供的方法
        */
        ref('b.changeContent', Math.random());
      }}>changeOtherComponent</button>
    </p>;
  }
}
export default AComponent;
```

##### ![](/assets/t.gif)

### 步骤

##### 调用或初始化前需要添加引用

```
import { ref } from 'react.eval';
```

##### 需要被外部调用的组件必须在 constructor 中初始化或使用ES7的decorator标注，组件必须是有状态的

```
ref(this);
/* 如果项目中可以使用ES7的装饰器 
 babel-plugin-transform-decorators-legacy
 https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy#readme
 则不必在constructor中初始化
 在 class 上方声明  @ref
 */
```

##### 给需要被外部调用的组件配置id，id必须全局唯一

```
<BComponent id="b"/>
```

##### 调用已知id组件的方式.

```
ref.eval('id.方法名',参数1,参数2...)
// 可简化为 ref('id.方法名',参数1,参数2...)
```

##### **注意:**

**① 被@ref修饰或构造方法中ref\(this\) 的组件，即使不指定id，也会强制生成一个随机数作为id，this.id被占用。**

**②** **ref.eval 方法的返回值为 Promise对象，如果需要获取实际返回值，需要 ref.eval\(...\).then\(\(result\)=&gt;{console.dir\(result\);}\)**

**Q: 为什么ref.eval 返回Promise  而不是 实际返回值**

A: 在应用了dva、redux 等框架的项目中，dispatch会引发组件重新渲染，

在渲染过程中，ref.eval 要执行的方法所在的组件实例

1、有可能处于不允许setState的生命周期

2、组件实例本身可能不存在

因此 ref.eval 将会延迟到组件实例存在并且可以setState的时候执行。

另外，如果组件的方法本身返回一个Promise\(嵌套\)，ref.eval会一直等待最深层的Promise结束后才触发then下一步，类似ES7 await的等待效果。

**Q:如果我要立刻获得组件方法的返回值，怎么做**

A:对于某些需要立即返回数据，不会修改state，并且调用时组件实例必定存在的场景.

let result=ref.eval\(...\)**\(\)                                          //ref\(...\)\(\)**

在eval方法后再加一对小括号，就可以立刻返回未经处理的方法返回值，不必使用then取得Promise的返回结果

```
 let result= ref('b.changeContent','......')();
```

如果组件实例调用时一定存在，还可以直接获取组件实例，然后用组件实例调用指定方法

```
let result= ref('b').changeContent('......');
也可以 import {ref,refs} from 'react.eval';
let result=refs.b.changeContent('......');
refs是一个Proxy对象，可以方便地调用已初始化的实例对象
```

![](/assets/import.png)![](/assets/20180408133437.png)

![](/assets/imposrt.png)

![](/assets/20180408133126.png)

如果结果确实是异步返回结果，例如各种ajax,还可以使用** await/async **改造调用的方法

![](/assets/impaasddddort.png)

![](/assets/impozzrt.png)

**Q:ref.eval 在初始化时为什么要强制占用this.id**

A:为了组合组件方便。即使不指定id也会强制生成一个随机数作为id

下图 TCom 组件 组合了 You 和 Manager 组件，

TCom的id在没有指定的情况下可以自动生成随机数，这样调用多个TCom并且不指定 id 时  不会冲突。

如果指定了属性props的id，TCom的props.id会被复制到 this.id

![](/assets/20180420110421t.png)

![](/assets/20180420105241_.png)

You组件可以通过属性bossId获得同级组件Manager的id，从而调用Manager中的方法。

![](/assets/20180420105817.png)

**Q:ref.eval兼容性怎么样?**

A:兼容使用redux/dva的项目。ref_.eval对此专门进行了调整\(见:**为什么ref.eval 返回Promise  而不是 实际返回值**\)。 _

兼容 React\(15.x,16.x\)。

**Q:ref.eval的优势、适用范围**

A: ref.eval 实现组件传值调用，借鉴传统的jQuery组件设计风格，代码量少，

并且代码逻辑集中在被封装的组件单个js中，便于维护。

同一界面多处复用组件时，只需要指定不同的 id 即可准确调用指定组件内部的方法。

组件之间不受组件层级或位置制约，任意访问。

可以以搭积木的方式封装组合组件。API少，方法名好记。

可以做到像dva、redux一样的跨组件通信，只是更加简单直接。

注重局部组件沟通和状态递进。

调用有状态组件自身方法更新状态，状态是递进变化的。

不做统一的状态管理，状态不分离，只负责组件通信，不做状态回溯。

专门为有状态组件定制，让有状态组件除了自己能setState，还能调用别的有状态组件提供的方法。

希望组件除了负责界面，还要封装一些相对固定的业务逻辑，省掉多余的属性传递和事件回调。

只需要提供少量真正的业务方法，组件拿过来就是完整的一套功能 。

有状态组件组合起来不仅有界面，还可以内部填充被组合组件需要的属性和回调。

被组合组件之间可以直接通信，外部不用关注，组合组件整体需要外部提供的信息更少。

对于应用dva/redux 的项目，不建议同一组件混用两种不同的组件通信方式。

没有应用dva/redux 的项目，ref.eval 可以承担 所有 组件通信。

**Q:ref.eval 的原理**

A:Pub/Sub 发布订阅模式

组件实例创建时注册事件，组件实例销毁时撤销注册，需要调用组件内部方法时触发事件。

# 附言

组件应当为 程序员 服务，用极少的配置获取尽可能多的功能。

组件存在的意义是通过封装组合，尽最大可能不出bug，让经验得以积累，提高效率，降低成本。

**ref.eval 存在的价值是，允许定点精准更新目标组件，从而制作易于重用并且可以自由交互的react组件**

# [版本变更](/ban-ben-bian-geng.md)



