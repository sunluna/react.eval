# 关于 id

引用组件时，推荐  &lt;Toast id="toast" /&gt; , 即使用 属性id 。

如果确定全局只有一个该组件，可以在实例中直接指定id，调用时可以省略id    **&lt;Toast /&gt;**

```
import React from 'react';
import { ref } from 'react.eval';

@ref
class Toast extends React.Component {

  id = 'toast';

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



