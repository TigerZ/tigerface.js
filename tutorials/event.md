## 事件

事件机制是 tigerface.js 架构的核心。
对象间通信、逻辑控制、用户交互、甚至与服务器间通信，都是通过事件机制完成。

### tigerface-event 包
tigerface-event 包含事件相关类：

* Event 对象定义了架构中用到的事件
* EventDispatcher 是事件分发器类
* DomEventAdapter 是 DOM 事件适配器类，负责将 DOM 事件转化为内部事件
* FrameEventGenerator 是重绘和帧事件引擎

tigerface-display 包的基类显示对象类 DisplayObject 是从 EventDispatcher 继承而来的，
所以 tigerface-display 包下的每个类都是事件分发器。

开发时，任何显示对象都可以通过 addEventDispatcher 或 on 方法来注册事件侦听器。
舞台内部包含一个 DOM 对象。鼠标、触摸、键盘，等等，这些系统事件，
就是通过舞台的 DOM 对象触发，并由 DomEventAdapter 类转发进舞台类，
再进入内部的事件体系，层层转发至
DomLayer、CanvasLayer、直到最顶层的 DomSprite 或 CanvasSprite。
开发者仅需要在自己关注的某个显示对象上注册事件侦听器，就可以实现交互响应。

### 事件侦听器

所谓事件侦听器就是一个函数。
所谓侦听事件就是告诉事件分发器，自己订阅某个事件。
在某个事件发布时，事件分发器会找到已经订阅此事件的全部函数，
逐一执行。

事件侦听器建议使用 ES6 语法里的箭头函数实现。因为事件发布而调用侦听器函数的执行时，是没有 this 对象的，
如果需要使用 this 来找到相应的源对象，就需要开发者在注册侦听器函数时就已经绑定了 this。
了解了这点，开发者也可以根据自己的需要，用匿名函数、bind(this)、或者箭头函数。

### 侦听事件

注册事件侦听器的举例，我故意用了多种方法定义侦听函数
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
        // 注意！如果需要移除的事件侦听器，不能用匿名函数
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
可以用 on 代替 addEventListener，on 是 EventEmitter 风格的注册方法，
与 addEventListener 完全一样。下面是更多写法：

```javascript
const sprite = new CanvasSprite();
sprite.addEventListener(Event.MouseEvent.CLICK, (e)=>{
    const { pos } = e;
    console.log('鼠标点击！pos = ', pos);
    // 注意: 这里虽然是箭头函数，但是 this 是外部上下文
});

```
或者
```javascript
const sprite = new CanvasSprite();
sprite.onClick = (e)=>{
    const { pos } = e;
    console.log('鼠标点击！pos = ', pos);
    // 注意: 这里虽然是箭头函数，但是 this 是外部上下文
};

```
Sprite 类把交互事件、拖拽、重绘、帧，这些常用事件定义为类属性，可以直接把事件侦听函数按属性赋值的方式注册。
### 发送事件
除侦听系统事件外，我建议任何对象、组件间通信都通过发布和侦听自定义事件的方式，而不是直接互相调用。
自定义事件与系统事件没有什么区别：
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

[下一章 tigerface-display 包](package.md)