## 第一个项目

* 一个风车，在慢慢转动。
* 鼠标在风车上移动，风车会快速转动。
* 鼠标移出，风车会慢下来，恢复慢慢转动。

[windmill](html/windmill.html "tigerface-embed:windmill")

### 完善

风车功能已经实现了，但颜色太单调了。我们创建一个调色板，然后让每个叶片都是不同的颜色。

```javascript
const { colors } = new ColorPalette(6, {
    0: 'rgb(222,63,24)',
    0.3: 'rgb(254,212,90)',
    0.6: 'rgb(102,172,188)',
    0.9: 'rgb(161,240,158)',
    1.0: 'rgb(222,63,24)',
});
```
调色板是 tigerface-graphics 包里的一个工具类，它内部是一个线性渐变（LinearGradient）
填充的色条，使用时从这个色条上取色。第一个参数是色条的长度，合适的长度可以在取色时充分
利用色条上的全部颜色。第二个参数就是线性渐变的颜色，你可以参考 Canvas 线性渐变相关的文档。

colors 是个二维数组，一维是色带位置，二维长度为 4，就是 "rgba" (红、绿、蓝、透明度);

调色板有了，我们修改风车叶片的绘制方法：
```javascript
// ...
this.bounds.forEach((shape, idx) => {
    g.drawPolygon(shape, {
        fillStyle: `rgba(${colors[idx][0]},${colors[idx][1]},${colors[idx][2]},1)`,
    });
});
// ...
```

看看运行效果：

[windmill08](html/windmill08.html "tigerface-embed:windmill08")
现在我们有了个彩色的风车了。和成品还差个轴心，锦上添花，我们再认识个图形：六角形。
```javascript
new Hexagon(0, 0, 10)
```
好了，运行效果就是本页开始的风车了。

### 总结
我把风车源码加满了注释，就作为总结吧：
```javascript
// 导入舞台、画布层、和风车继承的画布精灵
import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';

// 导入叶片的三角形、轴心的六边形
import { Triangle, Hexagon } from 'tigerface-shape';

// 导入工具类，用于在旋转绘制叶片时把角度转换为弧度
import { Utilities as T } from 'tigerface-common';

// 导入给叶片和轴心上色的调色板
import { ColorPalette } from 'tigerface-graphics';

// 初始速度
let speed = 1;

// 创建舞台
const stage = new Stage({
    width: 200,
    height: 200,
    style: {
        'background-color': 'yellow',
    },
}, document.getElementById('windmill') || document.documentElement);

// 创建画布层
const layer = new CanvasLayer();

// 把画布层添加至舞台
stage.addLayer(layer);

// 侦听舞台的鼠标进入和移出事件，并记录状态
let mouseInStage = false;
stage.onMouseOver = () => {
    mouseInStage = true;
};
stage.onMouseOut = () => {
    mouseInStage = false;
};

// 创建调色板，6 个叶片和一个轴心，所以长度是 7
const { colors } = new ColorPalette(7, {
    0: 'rgb(222,63,24)',
    0.3: 'rgb(254,212,90)',
    0.6: 'rgb(102,172,188)',
    0.9: 'rgb(161,240,158)',
    1.0: 'rgb(222,63,24)',
});

// 定义风车类
class Windmill extends CanvasSprite {
    // 构造器
    constructor(opt) {
        super();

        // 标准的初始化选项套路，请保持这个习惯
        this.assign(opt);

        // 初始化 6 个叶片，因为要判断鼠标在叶片上移动，所以将叶片加为边界
        for (let i = 0; i < 6; i += 1) {
            this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(i * 60)));
        }

        // 六角形的轴心
        this.addBound(new Hexagon(0, 0, 10));

        // 侦听鼠标在风车上的移动
        this.onMouseMove = () => {

            // 如果速度没有达到极限，那就加速
            if (speed < 35) speed += 1;

            // 速度并不是状态属性，所以改变后，要手动提交状态改变！
            this.postChange();
        };
    }

    // 重绘方法，注意：只能使用传入的 graphics 实例 "g"
    paint(g) {
        // 绘制叶片和轴心，因为都是边界，那直接遍历边界绘制就是了
        this.bounds.forEach((shape, idx) => {

            // 绘制多边形，填充颜色是从调色板上取的
            g.drawPolygon(shape, {
                fillStyle: `rgba(${colors[idx][0]},${colors[idx][1]},${colors[idx][2]},1)`,
            });
        });

        // 判断鼠标离开舞台了，速度就减慢。放在风车的绘制方法里，仅仅是为了利用 redraw 事件
        if (!mouseInStage && speed > 1) speed -= 0.2;

        // 逆时针旋转
        this.rotation -= speed;
    }
}

// 实例化风车对象，位置在舞台中间
const windmill = new Windmill({ x: 100, y: 100 });

// 把风车放置在层上
layer.addChild(windmill);

// 希望你入门了，祝好运

```