## 事件

tigerface-event 包下的 EventDispatcher 类是事件分发器。
tigerface-display 包的顶级基类 DisplayObject 
显示对象正是从 EventDispatcher 继承而来的，
所以 tigerface-display 包下的每个类都是事件分发器。

开发时，任何显示对象都可以通过 addEventDispatcher 或 on 方法来注册事件侦听器。
舞台本身绑定了页面上的某个 Dom 对象。鼠标、触摸、键盘，等等，这些系统事件，
就是通过舞台的 Dom 对象触发，并由 DomEventAdapter 类转发进舞台类，再进入内部的事件体系，层层转发至
DomLayer、CanvasLayer、直到最顶层的 DomSprite 或 CanvasSprite。
开发者仅需要在自己关注的某个显示对象内部注册响应的事件侦听器，就可以实现交互。

### 事件侦听器

事件侦听器应该使用 ES6 语法里的箭头函数实现。因为事件触发侦听器函数的执行时，是没有 this 对象的，
如果需要使用 this 来找到相应的源对象，就需要开发者在注册侦听器函数时就已经绑定了 this。
了解了这点，开发者也可以根据自己的需要，用匿名函数、bind(this)、或者箭头函数。

### 侦听事件

注册事件侦听器的举例
```javascript
class MySprite extends CanvasSprite {
    constructor(opt) {
        super({
            // ...
        });
        this.assign(opt);
        // 上面是标准套路写法
        
        // 行内定义成员函数
        this.printClickPos = (e) => {
            this.logger.info(`鼠标单击！pos=(${e.pos.x},${e.pos.y})`);
        }
        this.addEventListener(Event.MouseEvent.CLICK, this.printClickPos);
        
        // 这个侦听器的写法是用箭头成员函数
        this.addEventListener(Event.MouseEvent.MOUSE_OVER, this.mouseIn);
        
        // 用匿名箭头函数做侦听器，内部执行成员函数.
        // 注意！！！这种用法，无法移除侦听器。因为怎么在移除时找到这个 function 呢？
        // 如果不需要移除，那就随便了
        this.addEventListener(Event.MouseEvent.MOUSE_OUT, (e) => this.mouseOut);
    }
    
    mouseIn = (e) => {
        this.logger.info('鼠标进入');
    };
    
    mouseOut(e) {
        this.logger.info('鼠标离开');
    }
    
}
```
上面代码中可以用 on 代替 addEventListener，on 是 EventEmitter 风格的注册方法，
与 addEventListener 完全一样。下面是在外部注册侦听器的写法。

```javascript
const sprite = new CanvasSprite();
sprite.addEventListener(Event.MouseEvent.CLICK, (e)=>{
    const { pos } = e;
    console.log('鼠标点击！pos = ', pos);
    // 注意: 这里虽然是箭头函数，但是 this 是外部上下文
});

```

### 发送事件
```javascript
// 侦听自定义事件
this.on('CustomEventName', (e) => {
    this.logger.info(`Hello ${e.msg}`);
});
// ...
// 发送自定义事件
this.dispatchEvent('CustomEventName', {msg:'World!'});


```
上面代码中可以用 emit 代替 dispatchEvent，emit 是 EventEmitter 风格的注册方法，
与 dispatchEvent 完全一样。

dispatchEvent 或 emit 在某些环境下执行会有问题，比如 angularjs 环境里有可能会报循环调用错误。
因为 dispatchEvent 和 emit 都是同步执行事件侦听器函数。
可以用 dispatchAsyncEvent 或 asyncEmit 发送异步事件。

[下一章 舞台](stage.md)