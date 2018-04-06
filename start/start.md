## 开始

### 怎么开始？

空手搭建项目确实麻烦。你可以选择从 [首页](index.html) 下载项目压缩包，
或者访问 [GitHub](https://github.com/tigerz/tigerface.js) 上的项目资源。
因为 tigerface.js 本身就是完整开发项目，但是内容太多了，包含各种包的源码和范例。
所以，建议用 tigerface-cli 工具，生成空的项目架构。

### 安装 tigerface-cli 工具

由于我的环境是 mac，如果你使用 windows 环境，流程也类似。

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

1. 在浏览器中会显示类似这样的运行结果：

[barChart](http://tigerz.github.io/html/barChart.html "tigerface-embed:barChart")
[pieChart](http://tigerz.github.io/html/pieChart.html "tigerface-embed:pieChart")


