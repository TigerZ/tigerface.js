## 架构代码风格说明

tigerface.js 架构整体使用 ECMAScript 6 语法编写，部分地方使用了 stage-1 阶段语法。

架构的源代码依赖 babel 进行转码。使用 tigerface-cli 工具初始化的范例项目结构，
就是tigerface.js 的标准开发项目，开发者可以查看项目里的 .babelrc 配置文件。
在调试和发布时，架构使用 webpack 进行打包和压缩，请查看项目里的 webpack.config.js 文件。

架构采用面向对象的设计方法，底层基类实现基本的公共属性和方法，并通过多次继承实现对象的多样性。
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

ES6 终于带给 JavaScript 形式上的 Class，现在可以比较优雅的实现类和继承，但在使用过程中还是有不少坑。
所以在 tigerface-display 包下的类，有一套惯用的结构。
基于约定优于配置的原则，请开发者采用相同的习惯。在其它的文档里，也会有一些使用习惯或约束，请注意。

### tigerface.js 的类
```javascript
export default class DisplayObject extends EventDispatcher {

    // 静态 Logger，用于记录架构中的调试信息，例如：消息的分发，更详细
    // 但不建议开发者使用，此类信息过于详细，偏向底层，开发时可以屏蔽，以突出应用调试信息
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
在构造器里采用二次初始化参数的方式，首先 `super(props);` 初始化类本身的缺省值，
然后再通过语句 `this.assign(options);` 接受传入的参数。
这样做是为了避免参数间依赖，例如：传入参数里可能包含样式，但 dom 节点需要首先初始化。
`this.logger` 是提供给开发者使用的日志工具，参见相关文档。


### 属性

以 DisplayObject 的属性为例：
```javascript
// ... 其他代码

    /**
     * X 轴坐标
     * @member {number}
     */
    set x(x) {
        // 还是调用 pos 的 set 方法
        this.pos = {x};
    }

    get x() {
        return this.pos.x;
    }

    /**
     * Y 轴坐标
     * @member {number}
     */
    set y(y) {
        // 还是调用 pos 的 set 方法
        this.pos = {y};
    }

    get y() {
        return this.pos.y;
    }

    /**
     * 设置坐标
     * @member {module:tigerface-shape.Point|{x:number,y:number}}
     */
    set pos(pos) {
        if (T.assignEqual(this.pos, pos)) return;
        // 合并属性
        Object.assign(this.state.pos, pos);
        // 状态改变
        this._onPosChanged_();
        this.postChange('pos', this.pos);
    }

    get pos() {
        return this.state.pos;
    }

    /**
     * _onXXXX_ 命名的内部方法用于给子类覆盖，实现多态，这样能保持方法调用顺序。
     * **开发者不应该覆盖此类方法，应该使用事件侦听器**
     * @package
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

    /**
    * 状态改变时调用
    * @package
    */
    _onStateChanged_() {
        // 发布 Event.STATUS_CHANGED 事件
        this.dispatchEvent(Event.STAT_CHANGED);
    }

// 其他代码
```
tigerface.js 架构使用了很多 ES6 的 setter/getter 语法，方便隐藏属性，和执行相关方法，例如：设置状态相关属性后，自动设置状态改变，发布相关事件。
从上面的代码可见，架构为了方便开发者，同一属性提供了多种赋值，允许部分赋值。


### 注释
tigerface.js 架构使用 jsdoc + markdown-plugin 的注释风格，为使用 jsdoc 生成 API 文档。
项目根目录里有个 mac 的执行文件叫 buildDoc.sh 用于生成 jsdoc 文档，window 环境开发者可参考内部的命令。

### 代码检查
tigerface.js 架构使用 eslint 做代码检查，部分执行 eslint-config-airbnb 规则（有些不习惯的规则被部分或全局屏蔽，比如：缩进 2 空格）。
我使用 IDEA 作为开发工具，部分 eslint 代码风格在 IDEA 里配置，开发者请自行配置。

### 纯 JavaScript 或 React

tigerface.js 架构是纯 JavaScript 架构，仅在 dom 节点的 css 操作中使用了 jquery（在后续版本里会去掉 jquery 依赖）。
对于使用 React 架构的前端项目，tigerface.js 也提供了 React 接口方便用于整合。
在范例中会看到这两种方式的实现。

