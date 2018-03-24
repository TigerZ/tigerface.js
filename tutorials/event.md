[返回目录](contents.md)

## 事件

从前面的代码可以看到`class DisplayObject extends EventDispatcher`。
tigerface-display 包里每个类都是 EventDispatcher 的子类。EventDispatcher 是事件分发器类，
也就是说包里每个类都是事件分发器，可以通过 addEventDispatcher 或 on 方法来注册事件侦听器函数。

事件发布和事件侦听是观察者模式的一个简单实现，开发者将对象的各种变化发布为自定义事件，
然后侦听此事件，做响应的处理。这样使得对象间的代码依赖变得更松散。

EventDispatcher 属于 tigerface-event 包。包内还有 DomEventAdapter 类，用于转发系统交互事件；
FrameEventGenerator 类，用于生成重绘事件和帧事件。

[下一章 舞台](stage.md)