# 1、refs对象

import { refs } from 'react.eval';

#### refs可以获取已经注册并且调用的组件的实例

`refs.toast.show();`

请确保调用时组件实例已存在并且id匹配

&lt;Toast id='toast'/&gt;

注: refs对象并不存在于全局对象上，而是分散在各处引用的闭包内部，通过发布订阅模式维持refs对象为最新的实例id引用集合。

# 2、ref函数

import { ref } from 'react.eval';

#### ref函数提供组件方法调用、注册组件实例、方法装饰器等多种功能\(全能方法\)

| 方法 | 参数（序号，类型，说明） | 描述 |
| :--- | :--- | :--- |
| ref\('id'\) | ①  String  实例的id | 等同于 ref.get\('id'\),                                用于获取指定id的react组件实例 |
| ref\('id.methodName'\) | ① String 实例id  .  方法名                      ② ③......方法其他参数 | 等同于  ref.eval\('id.methodName'\);         用于执行实例中的方法,                            返回值为Promise |
| ref\(this\) | ① Object  组件实例 | 等同于  ref.init\(this\) ,                                用于在constructor中注册组件实例到   refs引用 |
| ref\(Toast\) | ① Function React组件（有状态组件） | 等同于 ref.deco\(Toast\),                          HOC 用于装饰普通React组件,              使组件在实例化时可以被注册到refs对象上，在销毁时可以从refs对象上移除 |
| ref.chunk\(newBase\) | ① Object \| undefined                            事件池存放的新变量位置 | 迁移公共事件池位置到某个隐藏变量,       一般不用调用此方法,                               此方法仅针对某些有代码洁癖的人。      调用后，可将公共事件池从全局移除。 |

**需要注意的地方**

**1、ref\('id.methodName',参数1,参数2,参数3....\)这种用法，经过了特殊处理，返回值为Promise**

原因:

1\) 在某些使用了dva，redux的项目上，调用方法时，组件处于不能setState的状态，或者暂时不存在，

针对这种情况，解决措施为 拦截生命周期中的钩子，如果组件不可立即使用，则等待35毫秒后重试，最多等待3秒后放弃

因此返回值为Promise

2\) 很多情况下，被调用的方法本身也可能返回一个Promise，多层Promise很是烦人，因此 增加了类似 await一样的逻辑，对结果处理，Promise的最终结果为嵌套的最深层的Promise的结果

```
getContent=()=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve('最终结果');
    },500);
  });
} 
...
//另一个文件
const result= await ref('toast.getContent');
// result= '最终结果'
或
ref('toast.getContent').then((result)=>{
  console.log(result);
  // 最终结果
});
```

3\) 如果你对ref\('id.methodName'\)用法的返回值处理感到纠结和厌烦，建议使用refs.id 这种方式来调用组件实例，方法结果不会经过任何处理。

也可以 ref\('id.methodName'\)\(\)  ，就是在调用方法后追加一对小括号，这样就会立刻返回组件实例方法的结果，不经过任何处理。

**2、ref.chunk\(newBase\)**

此方法一般不必调用

调用此方法的前提是，必须将react.eval列入CommonChunk列表，即vendor列表，保证react.eval在打包出的js中只有一份。

此方法可以无参调用 ref.chunk\(\)

作用是彻底让react.eval从全局变量里消失，将公共事件池移动到闭包内，防止被找到。

调用位置是 webpack配置entry的入口文件，项目组件ReactDOM.render方法之前.

# 3、mix方法（辅助方法）

import { mix  } from 'react.eval';

#### mix方法类似于jQuery的extend方法，用于数据的递归合并，兼容$.extend的所有用法。

由于自带的Object.assign 方法很傻，只能浅表复制一层数据结构，因此mix方法还是有生存空间的

mix方法在实现了$.extend方法所有功能之外，还增强实现了不同的数据复制合并逻辑，同时优化了合并效率。

常见用法:

1、mix\(true,{a:1,b:2},{a:3,c:1}\);

输出  {a: 3, b: 2, c: 1}

覆盖同名项

2、mix\(false,{a:1,b:2},{a:3,c:1}\);

输出 {a: 1, b: 2, c: 1}

不覆盖同名项

3、mix\(null,{a:4,b:null},{a:null,b:9}\);

输出 {a: 4, b: 9}

输出非空项，覆盖同名项

4、以上为**深复制，对应的第一个参数分别为  true,false,null，浅表复制 对应的第一个参数分别为 1,0,undefined**

深复制与浅表复制相对应，

举例

var a={};

var b={x:\[1,2\]};

mix\(true,a,b\);

此时 a.x===b.x 不成立，因为a的x属性是深复制得到的

若

mix\(1,a,b\);

此时 a.x===b.x 成立，即 a.x属性是从b.x浅表复制的。

浅表复制效率高，递归次数少，但是会导致属性指向同一个对象

**5、表单复制，对应第一个参数为 \[true\],\[false\],\[null\],\[1\],\[0\],\[undefined\]**

此方式为从远端合并数据时使用，请注意以下示例

mix\(\[true\],\[1,3,4,5,6\],\[2,4\]\)

结果为：\[2, 4\]

而 mix\(true,\[1,3,4,5,6\],\[2,4\]\)

结果为: \[2, 4, 4, 5, 6\]

即，表单复制兼容之前的所有复制模式，并增加了特殊处理，如果 数据源 数组 比 复制的目标 数组短，则截断目标数组。

此模式通常应用于 select 的option选中功能，依照传统的数据复制，会得到多于需要的数据，

例:选项总共6个，A-F,原先选中了 A、C、F，从远端获得的数据是 B、D

直接合并的结果是 B、D、F，这样的结果显然不是我们想要的，

表单复制的结果  是  B、D，与需要的结果相同。

这时有人会问，为什么不直接取远端结果呢?

实际应用中，mix的原数据结构和远程结构很复杂,

mix\(\[true\],{a:1,b:\[1,2,3,4,5\],c:{x:1,y:2}},{b:\[5,6\],c:{x:3}}\);

既需要合并，又需要裁剪

最终需要的结果为

{a:1,b:\[5,6\],c:{x:3,y:2}}

另外，表单复制对复制效率进一步优化，如果目标对象是空数组或空对象，则直接覆盖

例如:

var a={x:{}};

var b={x:{a:1,b:2}};

若 mix\(1,a,b\)

此时 a.x===b.x不成立

若 mix\(\[1\],a,b\);

此时 a.x===b.x成立

# 4、listener

import { listener } from 'react.eval';

全局的监听事件池（发布订阅模式），具有以下方法

| 方法名 | 参数 | 描述 |
| :--- | :--- | :--- |
| listener.on | ① String,事件key；                               ②Function 事件方法 | 注册事件方法                                               listener.on\('init',\(\)=&gt;{console.log\(1\)}\) |
| listener.remove;别名listener.off | ① String,事件key； | 删除指定键值的事件下的所有方法            listener.remove\('init'\) |
| listener.fire,别名 listener.emit | ① String，事件key；②③④...方法参数 | 执行指定键值的事件                                  listener.fire\('init',参数1,参数2...\); |
| listener.one | 同listener.on | 注册事件，注册之前先清空同键值的其他事件 |
| listener.once | 同listener.on | 注册事件,被注册的方法执行一次以后就会从该键值的事件列表中移除 |

**注意事项：**

1、事件池通常用来做松耦合

2、listener.fire 方法有返回值，返回值为最后注册的方法的返回值，此处参考了C\#的委托delegate设计

3、listener.fire 内部使用了try catch处理，有错误不会被抛出，而是直接忽略掉，然后执行事件列表的下一个方法。设计如此。

