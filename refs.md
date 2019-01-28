<!DOCTYPE html>
<html>
<body>

# 调用已知id的组件方法

## 1、推荐做法 （使用refs引用实例id）

```
import { refs } from 'react.eval';

...
    refs.toast.show();
...
```

## 2、使用ref获得组件的实例

```
import { ref } from 'react.eval';

...
    const toast = ref('toast');
    toast.show();
...
```

## 3、使用ref调用组件的方法\(id.methodName\)

```
import { ref } from 'react.eval';

...
    ref('toast.show');
...
```

Q：如何传参？

A:

如果已经使用ref\('toast'\)或 refs.toast 方式获得组件实例，则按照正常方式传参即可

```
refs.toast.show(参数1,参数2,参数3)
或
const toast = ref('toast');
toast.show(参数1,参数2,参数3);
```

如果使用 ref\('id.methodName'\)

```
ref('toast.show',参数1,参数2,参数3);
```


</body>
</html>

