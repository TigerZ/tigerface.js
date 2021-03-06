# DisplayObject 显示对象（未完成）

显示对象 DisplayObject 是 tigerface-display 包的最底层基类。
舞台、层、画布、以及画布上绘制的任何元素都从显示对象衍生。
显示对象的职责是：
1. 定义基本显示属性
1. 确定重绘模式
1. 状态改变

## 显示属性

显示对象具有以下基本显示属性：位置 pos (x, y)，原点 (originX, originY)，
尺寸 size (width, height)，缩放 scale (scaleX, scaleY)，旋转 rotation，透明度 alpha，可见性 visible。

**位置**：是显示对象在**父坐标系**中的坐标。

**原点**：原点就是每个显示对象内部坐标系的原点。以下几句话理解原点：

1. 对象的位置 pos 是指从父坐标系的原点起始的坐标

1. 对象中与的父坐标系 pos 坐标对齐的是显示对象自身的原点

1. 对象的旋转中心点是自身的原点

原点的初始值为 (x:0, y:0), 即：左上角。偏移后，内部子对象的显示位置随之偏移。
注意：偏移后，本对象位置也会反向偏移，因为与父坐标系位置坐标对齐的点，也是原点。

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
## 重绘模式

显示对象通过绘制展现在舞台上。绘制一次展现的是当前的各种状态属性，但这些状态属性发生改变后，
就需要擦除之前的图形，再次绘制新的图形。这个过程称为重绘。动画就是通过不停的重绘来形成动态效果。

DisplayObject 对象内部将绘制过程分为绘制前、绘制、绘制后三个阶段。
绘制前和绘制后，系统会发送"

## 状态机制

显示对象并不是在不停重绘。当各显示属性稳定时，系统并不会进行重绘。当状态改变才会触发再次重绘。
所谓**状态**，就是会触发重绘的属性，架构内置的显示相关属性，都是状态属性。

postChange() 方法用来告诉系统，某对象的状态改变。系统就会在下一次重绘轮询中，执行重绘。
在架构内部，接受状态属性赋值时，会自动调用。比如：`do.x = 100`，这样的属性赋值，
会自动触发状态改变。用户也可以通过直接调用 postChange() 方法，强制系统重绘。

重绘后，所有状态改变都被复位，重绘随即停止。
如果开发者需要不停的重绘，需要在重绘方法内部给状态属性赋值，或者执行 postChange()。