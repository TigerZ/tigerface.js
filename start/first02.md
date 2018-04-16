## 第一个项目

* 一个风车，在慢慢转动。
* 鼠标移入，风车会快速转动。
* 鼠标移出，风车会慢下来，恢复慢慢转动。

[windmill](https://tigerz.github.io/html/windmill.html "tigerface-embed:windmill")

### 绘制

绘制风车，需要导入 tigerface-shape 图形包。
图形包里包含各种基本图形类，比如：Point、Line、Circle、Rectangle、Polygon。

图形包里的 Shape 是接口类，用于通用基本方法。下一版本的 tigerface.js 可能会用
TypeScript 改写，这样会更直观。

Point、Line是基础类。多个节点和直线构成曲线，闭合起来就构成了多边形。
而其他多数图形，都可以转化为多边形（包括圆形、扇形）。tigerface-graphics 包里的
drawPolygon 方法几乎可以绘制所有图形。



