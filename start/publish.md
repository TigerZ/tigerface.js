## 发布

我们通过了前面风车项目的开发测试，现在要把项目发布到正式环境了。

在发布前，还要修改 `webpack.config.js` 文件，这个是编译生产环境时使用的配置文件。
生产环境的配置文件，与开发配置文件 `webpack.config.div.js` 相比，没有了关于开发服务器，热替换之类的内容。
而且编译的环境变量为：`NODE_ENV = production`，这会关闭所有调试日志。

和开发配置文件一样，我们要加入一个入口
```javascript
const config = {
    entry: {
        // ...
        windmill: ['./src/windmill.js'],
        // ...
        },
    output: {
        path: path.resolve(__dirname, './assets'),
        // ...
```

执行编译
```shell
npm run build
```
编译完成后 assets 目录下会多出一个 windmill.js 文件，内容是经过编译和压缩的文本。
这个文件就是交付给页面合成的生产版本了。
在生产页面中做两件事情：
1. 在动画要插入的位置添加标识

    `<div id="windmill"></div>`

1. 在`</body>` 前插入

    `<script src="windmill.js"></script>`

### 后续

入门文档里我讲解了一个叫风车的小项目，希望你对 tigerface.js 有了个基本了解。

从 2014 年开始，tigerface.js 架构已经默默进化了几年，内容很多，我无法在入门文档里
都体现出来。请继续阅读 [教程](tutorials.html#code.md)。

在开发中，如果需要详细的 API 参考，请下载最新版源码，然后运行命令生成：
```shell
./buildDoc.sh
```
命令执行后，会创建 `apidoc` 目录，运行里面 `index.html` 文件，就可以看到 jsdoc 了。

#### 再次，感谢你对 tigerface.js 感兴趣，祝好运！

请持续关注：
* [tigerface.js](https://github.com/tigerz/tigerface.js)
* [https://tigerz.github.io](https://tigerz.github.io)
* [http://tigerfacejs.org](http://tigerfacejs.org)

我正在用 tigerface.js 开发完整的在线应用，希望得到你的帮助、建议、鼓励 ...