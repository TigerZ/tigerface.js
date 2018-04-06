### 日志

tigerface.js 自建了一个日志工具 Logger，用于在开发过程中打印调试信息。
Logger 可同时在浏览器或 node.js 环境下运行。在开发环境下支持 OFF、ERROR、WARN、
INFO、DEBUG 五个级别。在生产环境下，自动全局关闭。

### 开始使用 Logger
* 如果是使用 tigerface-display 包，那么包下的全部类都包含了可直接使用的 Logger 实例。
例如：
    ```javascript
    class Bar extends CanvasSprite {
        // ...
        foo(arg) {
            this.logger.debug('执行 foo() 方法, 参数：', arg);
        }
        // ...
    }
    ```
* 在自己的代码里使用 Logger，首先从 tigerface-common 里加载 Logger，然后初始化。
    ```javascript
    import { Logger } from 'tigerface-common';

    // ...
    
    // 静态初始化
    const logger = Logger.getLogger('类名');
  
    // 或类构造器里进行实例初始化
    this.logger = Logger.getLogger(this);
    ```
    实例初始化的 logger ，输出时如果有 name 属性，那么 name 会作为源名称，
否则用 clazzName 作为源名称，没有定义 clazzName，就使用基类的 clazzName 作为源名称。


输出:
![DEBUG 日志输出图例](https://raw.githubusercontent.com/TigerZ/tigerface.js/master/tutorials/img/debug.png "DEBUG 日志输出图例")



### 日志级别

Logger 有 5 种日志输出级别分别是：

| 级别 | 说明 |
| --- | --- |
| OFF | 关闭 |
| ERROR | 错误 |
| WARN | 警告 |
| INFO | 信息 |
| DEBUG | 调试 |

从上至下日志的输出量增大，每级都包含本级日志及上面各级日志。
日记级别既是日志类型又是输出控制级别。
例如：运行时日志级别设置为`WARN` 日志输出将包含全部的"警告"和"错误"。
如果设置为 `DEBUG` 将输出全部日志。

### 日志输出

Logger 输出直接使用对应的方法名：

```javascript
this.logger.debug('Hi, 这是蓝色的调试日志');
this.logger.info('Hi, 这是绿色的信息日志');
this.logger.warn('Hi, 这是橙色的警告日志');
this.logger.error('Hi, 这是红色的错误');
```
输出效果：

![Chrome 日志输出](https://raw.githubusercontent.com/TigerZ/tigerface.js/master/tutorials/img/chrome_log_color1.png "Chrome 日志输出")

注意：error 方法直接抛出错误异常，运行终止。如果不希望终止运行，需要 `try{...}catch(e){...};`
debug、info、warn 都支持多参数，第一参数 msg 是字符串的日志说明，后面随意添加任意多个要显示的对象。

### 日志的定位

在海量的日志里，寻找有效的信息可用以下几种方法：

* 在浏览器控制台里对输出进行级别过滤：

![Chrome 日志输出级别](https://raw.githubusercontent.com/TigerZ/tigerface.js/master/tutorials/img/chrome_log_level.png "Chrome 日志输出级别")

或者关键字过滤：
    
![Chrome 日志过滤](https://raw.githubusercontent.com/TigerZ/tigerface.js/master/tutorials/img/chrome_log_filter.png "Chrome 日志过滤")

### 配置 log-config.json 文件

log-config.json 是 Logger 的配置文件，放在项目根目录。编辑此文件，可以更精确的控制日志输出。

```json
{
  "log-level": "warn", 
  "class-log-level": {
    "EventDispatcher":"off",
    "CanvasLayer":"off",
    "CanvasSprite":"debug"
  },
  "exclude":[]
}
```
#### log-level

`log-level` 是全局日志级别。
例如：log-level:off 说明关闭全部日志（class-log-level 里单独指定的除外）。
如果不指定 `log-level`，缺省值为 ERROR。

```json
{
  "log-level": "off", 
  "class-log-level": {
    "CanvasSprite":"debug"
  },
  "exclude":[]
}
```
#### class-log-level

`class-log-level` 指定具体类的日志级别，优先级高于全局日志级别。例如：可以关闭全局日志，仅打印指定某类的日志。

如果没有指定自己的类名，日志会使用基类的类名，例如`CanvasSprite`。所以应该指定自己的类名，例如：
```javascript
class Bar extends CanvasSprite {
    constructor() {
        super({
            clazzName: Bar.name,
        });
        // ...
    }
}
```
`class-log-level` 配置文件里就可以用 "Bar" 作为类名来管理：
```json
{
  "log-level": "off", 
  "class-log-level": {
    "Bar":"debug"
  },
  "exclude":[]
}
```
输出也会改变：

![Chrome 日志输出](https://raw.githubusercontent.com/TigerZ/tigerface.js/master/tutorials/img/chrome_log_color2.png "Chrome 日志输出")

#### exclude

`exclude` 是要过滤的关键字。关键字可指定多个，支持正则表达式语法。
前面提的 Chrome 控制台提供的关键字过滤，为了仅显示匹配的日志。
exclude 正好相反，匹配关键字的日志将不显示。`exclude` 仅对各种级别日志的第一参数 msg 起作用。

### 环境变量设置

如果环境变量 NODE_ENV = "production" 即生产环境，那么全部日志关闭。

如果非生产环境，那么环境变量 LOG_LEVEL 决定最高权限级别，比如：

`LOG_LEVEL="WARN"`，那么 Logger 最高仅能输出至 WARN 级别，INFO 和 DEBUG 信息被屏蔽。

### 日志级别设置优先级顺序

环境变量 NODE_ENV > 环境变量 LOG_LEVEL > exclude > class-log-level > log-level

[下一章 事件](event.md)