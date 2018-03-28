[返回目录](readme.md)

## 绘制

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
sprite.on(Event.REDRAW, ()=>{
    const g = this.graphics;
    g.fillStyle = 'rgba(255,0,0,0.8)';
    g.textAlign = 'center';
    g.textBaseline = 'bottom';
    g.drawText('Hello World! ', { x: 200, y: 200 }, '12px monaco', g.DrawStyle.FILL);
});
// 或者
sprite.onRedraw = ()=>{
    const g = this.graphics;
    g.fillStyle = 'rgba(255,0,0,0.8)';
    g.textAlign = 'center';
    g.textBaseline = 'bottom';
    g.drawText('Hello World! ', { x: 200, y: 200 }, '12px monaco', g.DrawStyle.FILL);
};
```

## 画笔
html5 中通过 canvas.getContext('2d') 获得绘图上下文对象 Context。
tigerface.js 架构中的 Graphics 类对 html5 的绘图上下文进行增强。
首先，Graphics 类完全兼容 Context，这部分功能参考 html5 的相关文档就可以。
Graphcis 通过插件的方式支持更多的图形绘制、组件绘制。

[下一章 状态](state.md)