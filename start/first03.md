## 第一个项目

* 一个风车，在慢慢转动。
* 鼠标在风车上移动，风车会快速转动。
* 鼠标移出，风车会慢下来，恢复慢慢转动。

[windmill](https://tigerz.github.io/html/windmill.html "tigerface-embed:windmill")

### 事件

现在我们给风车加点风，让它转的更快。当鼠标在风车上移动时，风车就越转越快，
当鼠标离开时，风车就逐渐慢下来，恢复到慢慢转动的状态。

舞台从内部的 DOM 上接收系统事件，比如：鼠标移动、触摸等，然后按照容器层次传递。
tigerface-display 包里每个类都是 EventDispatcher 类的子类，都可以发布和侦听事件。
你按照需求，在任何对象上侦听相应的事件就可以了。

这个项目里，我们在风车上侦听鼠标移动（Event.MouseEvent.MOUSE_MOVE）事件，然后加快转速。
```javascript
let speed = 1;
class Windmill extends CanvasSprite {
    constructor() {
        //...
        this.onMouseMove = () => {
            if (speed < 35) speed += 1;
            this.postChange();
        };
    }
    // ...
}
```
如果现在直接运行测试，是不会有鼠标移动事件的，因为风车只是绘制的图形，并没有具体的形体边界，
系统怎么能知道鼠标是在风车上移动呢？所以我们还需要把之前绘制的叶片，变成风车的有形边界。
```javascript
class Windmill extends CanvasSprite {
    constructor() {
        super({
            clazzName: Windmill.name,
        });

        this.x = 100;
        this.y = 100;

        for (let i = 0; i < 6; i += 1) {
            this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(i * 60)));
        }

        this.onMouseMove = () => {
            if (speed < 35) speed += 1;
            this.postChange();
        };
    }

    paint(g) {
        this.bounds.forEach((shape) => {
            g.drawPolygon(shape, {
                fillStyle: 'skyblue',
            });
        });
        g.drawPoint(this.origin);
        this.rotation -= speed;
    }
}
```
现在可以运行测试了：

[windmill06](html/windmill06.html "tigerface-embed:windmill06")

鼠标进入，风车果然转快了，但是停不下来。我们在舞台上加上鼠标移出事件，让风扇能停下来：

```javascript
// ...
let mouseInStage = false;
stage.onMouseOver = () => {
    mouseInStage = true;
};
stage.onMouseOut = () => {
    mouseInStage = false;
};
// ...
class Windmill extends CanvasSprite {
    // ...
    paint(g) {
        // ...

        if (!mouseInStage && speed > 1) speed -= 0.2;

        this.rotation -= speed;
    }
}
```

[windmill07](html/windmill07.html "tigerface-embed:windmill07")

OK！功能完整了。