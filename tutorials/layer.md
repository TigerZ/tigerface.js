### 层

层是指放在舞台上的第一层对象，必须是 CanvasLayer 或者 DomLayer 的实例。
层有名称，用于在动画中快速找到层。

层最基本的作用是隔离动画中的不同场景，提高绘制效率。

比如老游戏魂斗罗，小人边走边开枪。其实只是背景在向左移动，就有小人不停向右走的感觉。
如果前景和背景在一个层里，哪怕只是一粒子弹在飞，也需要重绘全部背景。
如果前景和背景分离在不同的层里，那么背景完全可以是静态的，只需要在前景的小人做出走动的样子时，把背景向左移动一下而已。

### 在舞台上放置层
```javascript
const stage = new Stage();
const layer1 = new DomLayer();
const layer2 = new CanvasLayer();
stage.addLayer(layer1);
stage.addLayer(layer2, 'second');
```

如果只有一层，stage.addLayer 不用指定层名称，缺省的层名称为 "main"。

如果没有指定层名称，而层对象有 name 属性，那么此 name 就会当做层名称。

如果指定层名称，优先使用指定的层名称，而不是 name 属性。

从第二层开始，必须指定层名称，或者有 name 属性。

### Dom 层：DomLayer

### 画布层：CanvasLayer

CanvasLayer 是从 DomLayer 继承来的，其核心的 Dom 是一个 Canvas。
通过这个 Canvas 创建的画笔，是画布层上所有子对象的绘图上下文。


### 开发中的功能

* 遮罩

* 路径


[下一章 显示对象](displayobject.md)