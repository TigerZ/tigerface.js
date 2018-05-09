# tigerface.js

感谢你对 tigerface.js 感兴趣。

tigerface.js 的当前版本，正在加紧重构中，代码和文档每天都在变化中，希望很快会发布稳定正式版本。\[[更新日志](log.md "更新日志")\]

新版本的网站正在建设：[[tigerz.github.io](https://tigerz.github.io "tigerz.github.io")]

旧版网站：[[tigerfacejs.org](http://tigerfacejs.org "tigerfacejs.org")]

**tigerface.js 是什么？**

tigerface.js 是一个前端开发架构，用于开发：基于事件的，全栈的，页面及图形混合的，
高度交互性的项目。例如：
* 小型的：动画片头、动画图表、页面小游戏...
* 中型的：产品原型、流程图或框图设计器...
* 大型的：各种图形化项目UI、完整图形动画设计器、Web幻灯片制作工具...

tigerface.js 架构代码用 es6 编写，使用 webpack + babel 编译。目标使用者是全栈或前端开发工程师。

tigerface.js 包含可独立使用的多个部分：

* 事件及网络

    事件驱动是 tigerface.js 的核心，可将事件机制用于界面组件间交互和数据驱动。
    tigerface-network 封装了 rest 和 websocket 通信接口，强调默认的接口规范。
    这部分我在多个企业项目中独立使用，适合用于全栈开发。可用于统一的服务器端接口，
    与不同的前端开发框架或UI间的适配，例如：React，VUE，Angularjs，或者比较老的 ExtJS 等。

* 显示对象类库、图形库、补间算法库

    tigerface.js 将 HTML DOM 对象和 Canvas 2D 绘制对象统一视作显示显示对象，
    只是不同的子类而已。可以使用统一的编程习惯，实现显示对象的动画或者交互控制。

    tigerface.js 内置一套 2D 图形库，包含例如：点、线、折线、曲线、箭头、三角形、
    矩形、圆形、椭圆、扇形、各种对称多边形、任意多边形等。可以应付基本的图形化 UI 开发需要。

    tigerface.js 内置一个增强的 2D 画笔类，在下一个版本中，将会引入 WebGL，但是会保持 2D 为主（仅使用 WebGL 绘制）。

    tigerface.js 强调默认的图形开发规范，即从精灵类继承、实现绘制方法、提交状态改变等。
    按照此规范，可以很简单的开发面向对象的，复杂且高效的图形动画 UI。

    tigerface.js 整合了基本的补间算法。不用开发者再自己引用。

**文档在哪里？**

教程在 tutorials/ 目录下，[访问网站](https://tigerz.github.io/tutorials.html)可以更直观的阅读

API 参考文档需要自己生成。项目根目录里有个 mac 的执行文件叫 buildDoc.sh 用于生成 jsdoc 文档，windows 环境开发者可参考内部的命令。

**怎么开始？**

建议使用 tigerface-cli 工具搭建项目脚手架，先运行范例，看到效果后，再开始写自己的模块。
由于我的环境是 mac，如果你使用 windows 环境也基本类似。


1. 安装 tigerface-cli

    tigerface-cli 是一个工具，帮助搭建前端项目的脚手架，并快速运行 tigerface.js 的范例。需要 node.js 8.5 以上版本 

    ```shell
    npm install -g tigerface-cli
    ```

1. 创建项目目录，然后进入此目录
    ```shell
    mkdir example
    cd example
    ```

1. 初始化项目结构
    ```shell
    tigerface init example
    ```

1. 安装依赖, 然后运行。
    ```shell
    npm install
    npm start
    ```

1. 在浏览器中会显示运行效果：

[barChart](https://tigerz.github.io/html/barChart.html "tigerface-embed:barChart")
[pieChart](https://tigerz.github.io/html/pieChart.html "tigerface-embed:pieChart")
