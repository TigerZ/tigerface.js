# tigerface.js

感谢你对 tigerface.js 感兴趣。

tigerface.js 的当前版本，正在加紧重构中，代码和文档每天都在变化中，希望很快会发布稳定正式版本。\[[更新日志](webroot/tutorials/log.md "更新日志")\]

新版本的网站正在建设，旧版网站：[[tigerfacejs.org](http://tigerfacejs.org "tigerfacejs.org")]

**tigerface.js 是什么？**

tigerface.js 是一个 javascript 的开发架构，
用于开发包含复杂交互的图形化界面。
适用的项目类型举例：
小型的动画片头、动画图表，
中型的产品原型、流程设计器，
大型的完整图形设计器、Web幻灯片制作工具、网页游戏。
包含可独立使用的多个部分，包括：事件、图形、绘制、显示、网络。

tigerface.js 架构代码用 es6 编写，使用 webpack + babel 编译。

目标使用者是有经验的前端开发人员。

**文档在哪里？**

[入门教程](tutorials.md) 在 tutorials/ 目录下。

API 参考文档需要自己生成。项目根目录里有个 mac 的执行文件叫 buildDoc.sh 用于生成 jsdoc 文档，windows 环境开发者可参考内部的命令。

**怎么开始？**

建议使用 tigerface-cli 工具搭建项目脚手架，先运行范例，看到效果后，再开始写自己的模块。
由于我的环境是 mac，如果你使用 windows 环境也基本类似。


1. 安装 tigerface-cli

    tigerface-cli 是一个工具，帮助搭建前端项目的脚手架，并快速运行 tigerface.js 的范例。需要 node.js 8.5 以上版本 

    ```commandline
    npm install -g tigerface-cli
    ```

1. 创建项目目录，然后进入此目录
    ```commandline
    mkdir example
    cd example
    ```

1. 初始化项目结构
    ```commandline
    tigerface init example
    ```

1. 安装依赖, 然后运行。
    ```commandline
    npm install
    npm start
    ```

1. 在浏览器中会显示运行效果：

[barChart](http://tigerz.github.io/html/barChart.html "tigerface-embed:barChart")
[pieChart](http://tigerz.github.io/html/pieChart.html "tigerface-embed:pieChart")
