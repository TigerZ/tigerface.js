[返回目录](readme.md)

## 舞台 Stage

舞台类 Stage 是一切显示对象的基础容器，每个项目都是从新建舞台开始。
舞台的职责是：
* 包含和管理多个 Layer 容器
* 嵌入页面，转发 Dom 事件
* 初始化重绘和帧引擎，转发重绘和帧事件

### 初始化舞台

初始化一个典型的舞台：

```javascript
const stage = new Stage({
    fps: 60,
    width: 200,
    height: 200,
    style: {
        'background-color': 'rgba(255,255,0,0.3)',
    },
}, dom);
```
Stage 也是显示对象的子类，第一个参数是初始化选项。
`fps` 是帧速率，用于控制帧引擎每秒发送多少帧事件。
width 和 height 与在 style 里设置 width 和 height 一样。
第二个参数`dom`是绑定现有的 DOM 对象。
如果不传入，Stage 会自己创建一个 DOM，可以用 `stage.dom` 获取。

参数里的 style 就是 css 样式，可以在这里定义 stage 的 css 外观。


[下一章 层](layer.md)