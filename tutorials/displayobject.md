### 显示对象

显示对象是 tigerface-display 包的最底层基类。
舞台、层、画布、以及画布上绘制的任何元素都从显示对象衍生。

显示对象的职责是：
1. 定义基本显示属性
1. 确定重绘模式
1. 状态改变

## 显示属性

显示对象具有以下基本显示属性：位置 pos (x, y)，原点 origin (originX, originY)，
尺寸 size (width, height)，缩放 scale (scaleX, scaleY)，旋转 rotation，透明度 alpha，可见性 visible。

**位置 pos**：是显示对象在**父坐标系**中的坐标。

**原点 origin**：原点就是每个显示对象内部坐标系的原点。关于原点：

1. 对象的位置 pos 是指从父坐标系的原点起始的坐标

1. 对象中与的父坐标系 pos 坐标对齐的是显示对象自身的原点

1. 对象的旋转中心点是自身的原点

原点的初始值为 (x:0, y:0), 即：左上角。偏移后，内部子对象的显示位置随之偏移。
注意：偏移后，本对象位置也会反向偏移，因为与父坐标系位置坐标对齐的点，也是原点。

**尺寸 size**：
尺寸定义了基本的 width 和 height 属性，形成最基本的外接矩形。DomSprite 子类用此属性形成 DOM 的外观，
在子类 Sprite 里，边界由多个图形组成，外接矩形会随之变化，参考"精灵"章节。

**缩放 scale**：
缩放就是缩放比例，取值为 1 时没变化。

**旋转 rotation**：
旋转是指旋转角度（注意：单位是度），取值范围是 0 - 360，超范围内部也重新计算 rotation % 360。

### 属性赋值
这些属性可以用多种方式赋值，开发者可根据需要任意使用。以位置举例（其他属性类似）：

* 初始值

    ```javascript
    let do = new DisplayObject({
        pos:{x:100, y:50}
    });
    ```

* 对象赋值

    ```javascript
    let do = new DisplayObject();
    do.pos = {x:100, y:50};
    ```

* 单独赋值

    ```javascript
    let do = new DisplayObject();
    do.x = 100;
    do.y = 50;
    ```
属性值变化后会触发"状态改变"，并引发重绘。
    
[下一章 绘制](paint.md)