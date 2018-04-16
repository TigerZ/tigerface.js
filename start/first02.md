## 第一个项目

* 一个风车，在慢慢转动。
* 鼠标移入，风车会快速转动。
* 鼠标移出，风车会慢下来，恢复慢慢转动。

[windmill](https://tigerz.github.io/html/windmill.html "tigerface-embed:windmill")

### 绘制

舞台上首先要放置层，层有两种： DomLayer（Dom层）和 CanvasLayer （画布层）；
DomLayer 是 DomSprite 的容器，CanvasLayer 是 CanvasSprite 画布精灵的容器。
因为风车是绘制的，所以我们使用 CanvasLayer 和 CanvasSprite。

绘制风车，需要导入 tigerface-shape 图形包。
图形包里包含各种基本图形类，比如：Point、Line、Circle、Rectangle、Polygon。

Point、Line是基础类。多个点和直线构成曲线，闭合起来就构成了多边形。
曲线、二次三次曲线都可以转化为 Line 数组，而多数图形，都可以转化为多边形（包括圆形、扇形）。
所以 tigerface-graphics 包里的 drawPolygon 方法几乎可以绘制所有图形。

1. 导入 CanvasLayer 类和 CanvasSprite 类
   ```javascript
   import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
   ```
1. 在舞台上添加画布层 CanvasLayer
    ```javascript
    const layer = new CanvasLayer();
    stage.addLayer(layer);
    ```
1. 导入 "tigerface-shape" 包。
    ```javascript
    import { Triangle } from 'tigerface-shape';
    ```
    我们使用三角形来绘制风车的叶片。
1. 定义风车类，先绘制一个叶片
    ```javascript
    class Windmill extends CanvasSprite {
        constructor() {
            super({
                clazzName: Windmill.name,
            });

            this.x = 100;
            this.y = 100;
        }

        paint(g) {
            const shape = new Triangle(0, 0, 50, 50, 120);
            g.drawPolygon(shape, {
                fillStyle: 'skyblue',
            });
            g.drawPoint(this.origin);
        }
    }
    const windmill = new Windmill();
    layer.addChild(windmill);
    ```
1. 看看运行的效果：

    [windmill02](https://tigerz.github.io/html/windmill02.html "tigerface-embed:windmill02")

    叶片的样子不对？为更直观看到原点，我绘制了一个点在原点位置。三角形的位置确实不对。
    我们调整一下三角形的位置。
    ```javascript
    const shape = new Triangle(0, 0, 50, 50, 120).move(-50, 0);
    ```
    [windmill03](https://tigerz.github.io/html/windmill03.html "tigerface-embed:windmill03")

    现在像一个叶片了。我们这样共绘制 6 片，每两片之间旋转 60 度，就完整了。
    ```javascript
    for (let i = 0; i < 6; i += 1) {
        g.drawPolygon(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(i * 60)), {
            fillStyle: 'skyblue',
        });
    }
    ```
    这里用到了另一个类方法 `T.degreeToRadian(...)`。这是工具类 `Utilities` 的方法，用于将角度转为弧度。
    所以还要导入 `Utilities` 类。

    ```javascript
    import { Utilities as T } from 'tigerface-common';
    ```

    [windmill04](https://tigerz.github.io/html/windmill04.html "tigerface-embed:windmill04")


