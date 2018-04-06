### 绘制

显示对象通过绘制展现形象，而每次状态发生变化后，就需要重新绘制，这个过程，称为重绘。

tigerface.js 架构的重绘是舞台对象通过 FrameEventGenerator 类实现对浏览器 animationstart 或 setTimeout 的封装。

重绘就像轮询一样，按照每秒 60 帧的速率不停执行。在架构内部，重绘分为绘制前、绘制、绘制后三个阶段进行。

## 实现绘制
开发者实现绘制有多种方法：
* 继承类内部实现 paint 方法

    ```javascript

    class MySprite extends CanvasSprite {
        constructor(opt) {
            super();
            this.assign(opt);
        }

        paint() {
            const g = this.graphics;
            g.fillStyle = 'rgba(255,0,0,0.8)';
            g.textAlign = 'center';
            g.textBaseline = 'bottom';
            g.drawText('Hello World! ', { x: 200, y: 200 }, '12px monaco', g.DrawStyle.FILL);
        }
    }
    ```

* 外部事件侦听
```javascript
const sprite = new CanvasSprite();
sprite.on(Event.REDRAW, (g)=>{
    g.fillStyle = 'rgba(255,0,0,0.8)';
    g.textAlign = 'center';
    g.textBaseline = 'bottom';
    g.drawText('Hello World! ', { x: 200, y: 200 }, '12px monaco', g.DrawStyle.FILL);
});
// 或者
sprite.onRedraw = (e)=>{
    const g = e.graphics;
    g.fillStyle = 'rgba(255,0,0,0.8)';
    g.textAlign = 'center';
    g.textBaseline = 'bottom';
    g.drawText('Hello World! ', { x: 200, y: 200 }, '12px monaco', g.DrawStyle.FILL);
};
```

## 画笔
html5 中通过 canvas.getContext('2d') 获得绘图上下文对象 Context。
tigerface.js 架构中的 Graphics 类在兼容 Context 的基础上对 Context 进行了增强。
支持更多的图形绘制、组件绘制。比如：Graphics 可绘制
tigerface-shape 包里的各种图形，可绘制虚线、箭头、曲线、扇形、任意圆角多边形。

##绘制相关重要注意事项：
1. 画笔的调用，只能出现在 paint 方法中。
paint 方法的绘图上下文是经过多层的容器，多次执行坐标变换、透明度调整、缩放等操作后的瞬时上下文。
如果在 paint 方法外面调用画笔，将会导致显示对象绘制错误。
1. paint 方法内部，只允许同步调用绘制方法。如果异步执行，也会脱离 paint 当前的上下文环境，导致绘图错误。
所以，例如预加载图片之类的异步操作。正确的做法是外部仅执行异步加载，并 paint 方法内部，不停检查资源是否加载完成，
未完成就不执行绘制，还要调用 postChange 通知显示对象不要停止重绘。如果已完成，就用画笔直接绘制，不再调用 postChange。


[下一章 状态](state.md)