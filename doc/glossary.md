# 基础知识

* [ES6、类和属性](##es6-类和属性)
* 事件
* 舞台、重绘引擎、帧引擎、系统事件接口
* 层、DomLayer、CanvasLayer
* 显示对象、容器、精灵、CanvasSprite、DomSprite
* 绘制
* 状态改变
* 坐标系、原点
* 边界
* 交互（鼠标事件和触摸事件）
* 动画（重绘事件和帧事件）
* 补间

##ES6、类和属性

tigerface.js 架构整体使用 ECMAScript 6 语法编写，部分地方使用了更新的
stage-1 阶段语法。

架构的源代码依赖 babel 进行转码。使用 tigerface-cli 工具最新版本初始化的范例项目结构，
就是tigerface.js 的标准开发项目，开发者可以查看项目里的 .babelrc 配置文件。
在调试和发布时，架构使用 webpack 进行打包和压缩，请查看项目里的 webpack.config.js 文件。

架构采用面向对象方式的设计方法，底层基类实现基本的公共属性和方法，并通过多次继承实现对象的多样性。
tigerface.js 的早期版本，还是用 JavaScript 早期的版本实现，类似这样的语法：
```javascript
var Person = Class.extend({
  init: function(isDancing){
    this.dancing = isDancing;
  },
  dance: function(){
    return this.dancing;
  }
});
```
感兴趣的请参考： https://johnresig.com/blog/simple-javascript-inheritance/

ES6 终于带给 JavaScript 形式上的 Class，现在可以像服务器端面向对象语言一样实现类和继承。
但在使用过程中还是有不少坑，所以基于约定优于配置的原则，
尤其在 tigerface-display 包下的类，有一套惯用的结构。

### tigerface.js 的类
```javascript
export default class DisplayObject extends EventDispatcher {

    // 静态 Logger，多用于记录架构中的调试信息，例如：消息的分发，更低层和详细，但方便屏蔽
    static logger = Logger.getLogger(DisplayObject.name);

    // 第一参数用于传入可选参数
    constructor(options) {

        // 属性缺省值
        const props = {

            // clazzName用于记录类名
            clazzName: DisplayObject.name,

            // 其他属性...
        };

        // 调用基类方法，初始化对象
        super(props);

        // 接受传入的可选参数
        this.assign(options);

        // 其他初始化代码...

        // 实例 logger，用于记录开发中调试信息
        this.logger.debug('初始化完成');
    }

    // 其他代码...
}
```
tigerface-display 包里每个类都接收一个选项参数，用于传入用户参数。

### 属性

以 DisplayObject 的属性为例：
```javascript
// ... 其他代码

    /**
     * 设置 x 坐标
     * @param x {number}
     */
    set x(x) {
        // 还是调用 pos 的 set 方法
        this.pos = {x};
    }

    /**
     * 获取 x 坐标
     * @return {number}
     */
    get x() {
        return this.pos.x;
    }

    /**
     * 设置 y 坐标
     * @param y {number}
     */
    set y(y) {
        // 还是调用 pos 的 set 方法
        this.pos = {y};
    }

    /**
     * 获取 y 坐标
     * @return {number}
     */
    get y() {
        return this.pos.y;
    }

    /**
     * 设置坐标
     * @param pos {Point|{x:*,y:*}}
     */
    set pos(pos) {
        if (T.assignEqual(this.pos, pos)) return;
        // 合并属性
        Object.assign(this.state.pos, pos);
        // 状态改变
        this._onPosChanged_();
        this.postChange('pos', this.pos);
    }

    /**
     * 获取坐标
     * @return {Point|{x:*,y:*}}
     */
    get pos() {
        return this.state.pos;
    }

    /**
     * _onXXXX_ 命名的内部方法用于给子类覆盖，实现多态，这样能保持方法调用顺序。
     * 更松耦合的方式是事件侦听，但事件不保证同步。
     */
    _onPosChanged_() {
        // 发布 Event.MOVE 事件
        this.dispatchEvent(Event.MOVE);
    }

    /**
     * 提交状态改变
     * @param log {*} 状态改变原因，用于调试
     */
    postChange(...log) {
        if (log.length && log[0]) this.logger.debug('状态改变', ...log);

        if (this.isChanged) return;

        this._changed_ = true;

        this._onStateChanged_();
    }

    _onStateChanged_() {
        // 发布 Event.STATUS_CHANGED 事件
        this.dispatchEvent(Event.STATUS_CHANGED);
    }

// 其他代码
```
从上面的代码可见，为了开发方便，DisplayObject 的位置属性，同时提供 x, y, pos，多种赋值方式，
利用 ES6 的 setter 语法，通过属性赋值的形式执行方法体，存取同一属性，设置状态改变，发布事件。
