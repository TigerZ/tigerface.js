## 第一个项目

是时候开始写你的第一个项目了。需求是这样的：
* 一个风车，在慢慢转动。
* 鼠标移入，风车会快速转动。
* 鼠标移出，风车会慢下来，恢复慢慢转动。

[windmill](https://tigerz.github.io/html/windmill.html "tigerface-embed:windmill")

### 创建舞台

1. 创建项目，参考前面的文档吧，这里就不重复了。
1. 创建 HTML5 页面，在页面标识要插入风车的地方放个 `div` 作为容器：
   ```html
    <div id="windmill"></div>
   ```
1. 开始写代码吧，创建空白的 windmill.js 文件。首先开始定义舞台，舞台是一切的基础，是与页面的接口。

    导入舞台类：
    ```javascript
    import { Stage } from 'tigerface-display';
    ```
    tigerface.js 架构里的所有模块，都采用这样的加载方式：从包里用结构赋值的方法导入。后面会导入更多的类。

    定义舞台：
    ```javascript
    const stage = new Stage({
        fps: 16,
        width: 200,
        height: 200,
    }, document.getElementById('windmill'));
    ```
    这里传入两个参数，第一个是**配置选项**，第二个是**页面的位置 DOM**。

    配置选项是舞台的可选参数，每一项都有缺省值，这里传入了参数，可以覆盖缺省值：
    * `ftp: 16` 告诉舞台，每秒发送 16 帧`进入帧`事件，缺省为 60 帧。
    * `width: 200` 和 `height: 200` 告诉舞台`size`为 200px * 200px，缺省为 320px * 240px。
    舞台内部的画布层会按 100% 充满舞台，所以舞台的大小就是动画的实际大小。

    页面位置 DOM 是告诉舞台，动画放在这个 DOM 里面，注意是"里面"。
    `document.getElementById('windmill')` 找到开始时我们在页面插入的 DOM。我的范例里常用的写法是这样：
    ```javascript
    document.getElementById('windmill') || document.documentElement
    ```
    因为我用的是通用的测试页面，如果没有找到id，那么就直接放在`<body></body>`里。

1. 修改配置文件，测试时使用 "webpack.dev.config.js"。
    **添加入口**，这样会生成独立的 windmill.js 文件：
    ```javascript
    // ...
    entry: {
        // ...
        windmill: ['./example/src/windmill.js'],
        // ...
    }
    // ...
    ```
    * 添加测试页面，这样会生成一个对应的 HTML：
    ```javascript
    // ...
    plugins: [
        new HtmlWebpackPlugin({
            template: './template/index.template.html',
            title: 'tigerface.js',
            filename: 'windmill.html',
            chunks: ['windmill'],
        }),
    // ...
    ```
    如果用 `filename: index.html` 会方便些，但注意不要多个入口都用 index.html。
    这部分可以参考 HtmlWebpackPlugin 的相关文档。

1. 运行测试 `npm start`。看不到结果？因为舞台是透明的，看不到。我们给舞台加个底色：
    ```javascript
    const stage = new Stage({
        fps: 16,
        width: 200,
        height: 200,
        style: {
            'background-color': 'rgba(255,255,0,.5)',
        },
    }, document.getElementById('windmill') || document.documentElement);
    ```
    再运行：

[windmill01](https://tigerz.github.io/html/windmill01.html "tigerface-embed:windmill01")

