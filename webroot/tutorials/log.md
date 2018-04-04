# tigerface.js 重构日志

此项目正在进行完全重构。

旧版本运行效果见
[tigerfacejs.org](http://tigerfacejs.org)

进度：

2018/2/25 搭建新项目框架，升级依赖和工具版本。
* babel 弃用了 preset-latest，现在用 preset-env
* webpack.config.js 格式有变化
* react-hot-loader 还不能很好支持 webpack@4.x.x 以上的版本
* react 版本变化，导致之前写的 tigerfacejs 中 react 部分的实现废弃

2018/02/26 重构 tigerface 的类结构

2018/02/27 重构 Logger 类

2018/02/28 整合 mocha，开始重写测试用例，已完成 event.test.js

2018/03/01 开始重构 display 部分...

2018/03/05 引入 jsdom 和 canvas 模拟环境，用来完成非浏览器环境单元测试

2018/03/16 重构计划完成第一阶段，重写了 react 接口组件，改正了帧事件的重要 bug

2018/03/17 完成主要模块的独立发布，完成 tigerface-cli 工具的 "init example" 功能

2018/04/02 display 相关功能基本重构完成，还需要继续加注释、写文档、写范例