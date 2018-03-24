[返回目录](contents.md)

## 舞台 Stage

Stage 是一切的基础，每个项目都是从新建舞台开始。
舞台的职责是：
* 包含和管理多个 Layer 容器
* 嵌入页面，转发 Dom 事件
* 初始化重绘和帧引擎，转发重绘和帧事件

### 初始化舞台
下面代码初始化一个典型的舞台：
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

[下一章 层](layer.md)