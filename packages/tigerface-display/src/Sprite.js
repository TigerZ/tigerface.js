/* eslint-disable class-methods-use-this */

import { Logger, Utilities as T } from 'tigerface-common';
import { Event } from 'tigerface-event';
import { Rectangle, Polygon } from 'tigerface-shape';

import DisplayObjectContainer from './DisplayObjectContainer';

/**
 * 精灵类，有交互能力的显示对象
 *
 * @extends module:tigerface-display.DisplayObjectContainer
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class Sprite extends DisplayObjectContainer {
    static logger = Logger.getLogger(Sprite.name);

    /**
     * @param [options] {object} 可选初始属性，属性缺省值
     *  {
     *      activeMouseCheck: true, // sprite 状态变化时是否主动监测鼠标，在鼠标指针静止时，也会触发 MouseOver MouseOut MouseMove 等事件
     *  }
     */
    constructor(options) {
        const props = {
            clazzName: Sprite.name,
            activeMouseCheck: false,
            _bounds_: [],
        };

        super(props);

        this.assign(options);

        this.dragging = false;

        this.on(Event.APPEND_TO_STAGE, () => {
            // 拖拽时，移动设备的缺省触摸事件会干扰显示对象的移动，所以用下面侦听器，在拖拽时禁止缺省的 TOUCH_MOVE 事件传递。
            this.stage.on(Event.TouchEvent.TOUCH_MOVE, this._disableTouchMove_);
        });
    }

    /** *************************************************************************
     *
     * 边界
     *
     ************************************************************************* */

    /**
     * 添加边界多边形
     * 边界可由一个或多个多边形组成，bounds可以是一个shape对象或多个shape对象组成的数组
     *
     * @param shape {module:tigerface-shape.Shape} 边界多边形
     */
    addBound(shape) {
        this._bounds_.push(shape);
        this._createBoundingRect_();
        this.postChange('addBound');
        return this;
    }

    clearBounds() {
        this._bounds_ = [];
        this._createBoundingRect_();
        this.postChange('clearBounds');
        return this;
    }

    /**
     * 移除边界多边形
     * @param i {number} 边界多边形顺序
     */
    removeBound(i) {
        if (this._bounds_[i]) {
            this._bounds_.splice(i, 1);
            this._createBoundingRect_();
        }
        this.postChange('removeBound');
    }

    set bounds(v) {
        this.logger.error('不允许设置边界多边形容器');
    }

    /**
     * 边界多边形
     * @member {Array}
     */
    get bounds() {
        return this._bounds_;
    }

    /**
     * 获得外接矩形在舞台上的投影
     * @return {{pos, size: {width, height}, rotation: number, origin: {x, y}|*, scale: {x: number, y: number}}}
     * @package
     */
    getBoundRectShadow() {
        const p0 = this.getStagePos();
        const rect = this.boundingRect;
        return {
            pos: p0,
            size: { width: rect.width, height: rect.height },
            rotation: this._getStageRotation_(),
            origin: this._getStageOrigin_(),
            scale: this._getStageScale_(),
        };
    }

    /**
     * 创建边界多边形的外接矩形
     * @package
     */
    _createBoundingRect_() {
        let left = 100000;
        let top = 100000;
        let right = -100000;
        let bottom = -100000;
        let changed = false;

        this.bounds.forEach((bound) => {
            const rect = bound.getBoundingRect();
            rect.right = rect.left + rect.width;
            rect.bottom = rect.top + rect.height;

            left = rect.left < left ? rect.left : left;
            top = rect.top < top ? rect.top : top;
            right = rect.right > right ? rect.right : right;
            bottom = rect.bottom > bottom ? rect.bottom : bottom;
            changed = true;
        });

        const boundRect = changed ? {
            left,
            top,
            width: right - left,
            height: bottom - top,
        } : {
            left: 0,
            top: 0,
            width: this.width,
            height: this.height,
        };
        // console.log(this.name, rect);
        this.logger.debug('创建边界多边形的外接矩形', boundRect);
        this._boundingRect_ = new Rectangle(boundRect.left, boundRect.top, boundRect.width, boundRect.height);
        this._onBoundingRectChanged_();
    }

    /**
     * 获取外接矩形（缓存）
     * @member {module:tigerface-shape.Rectangle}
     */
    get boundingRect() {
        if (!this._boundingRect_) {
            this._createBoundingRect_();
        }
        return this._boundingRect_;
    }

    /**
     * 当尺寸改变时调用。覆盖超类方法，增加重新计算外接矩形
     * @package
     */
    _onSizeChanged_() {
        super._onSizeChanged_();
        this._createBoundingRect_();
    }

    /**
     * 当边界矩形改变时执行
     * @package
     */
    _onBoundingRectChanged_() {
        const { left, top, width, height } = this.boundingRect;
        this.emit(Event.BOUNDING_CHANGED, {
            boundingRect: { left, top, width, height },
        });
        this.postChange('bounding rect changed');
    }

    /** *************************************************************************
     *
     * 碰撞测试
     *
     ************************************************************************* */

    /**
     * 返回点与感应区的碰撞测试结果
     *
     * @param point {module:tigerface-shape.Point|{x:number,y:number}} 测试点
     * @returns {boolean} 测试结果
     * @package
     */
    _pointInBounds_(point) {
        // 先做外接矩形碰撞测试，排除远点
        if (this.boundingRect.hitTestPoint(point)) {
            // 如果没定义边界图形，那么说明 boundingRect 从孩子获取，直接返回true，主要用于图纸等用途
            // this.logger.debug('_pointInBounds_', this.boundingRect, point, this._bounds_.length);
            if (this._bounds_.length === 0) {
                return true;
            }
            for (let i = 0; i < this.bounds.length; i += 1) {
                if (this.bounds[i].hitTestPoint(point)) {
                    return true;
                }
            }
        }
        return false;
    }

    get mousePos() {
        return { x: this._mouseX_, y: this._mouseY_ };
    }

    /**
     * 鼠标坐标
     * @member {module:tigerface-shape.Point|{x:number,y:number}}
     */
    set mousePos(pos) {
        this._mouseX_ = pos.x;
        this._mouseY_ = pos.y;
    }

    /**
     * 鼠标 X 轴坐标
     * @member {number}
     */
    get mouseX() {
        return this._mouseX_;
    }

    /**
     * 鼠标 Y 轴坐标
     * @member {number}
     */
    get mouseY() {
        return this._mouseY_;
    }

    /**
     * 状态改变时执行，覆盖超类方法，增加主动读取鼠标坐标
     * @package
     */
    _onStateChanged_() {
        super._onStateChanged_();
        if (this.activeMouseCheck && this.parent) {
            this._onStageMouseMove_(this.parent.mousePos, 2);
        }
    }

    /**
     * 检测鼠标是否在范围内，内部会触发 MOUSE_OVER MOUSE_OUT 事件
     * @param pos {module:tigerface-shape.Point|{x:number,y:number} 外部位置坐标
     * @return {boolean} 是否在范围内
     * @package
     */
    _checkMouseMove_(bubble) {
        // 记录之前的状态，用来判断是否第一次进入
        const beforeInside = this._mouseInside_;

        // 如果之前在范围内，先发送一次移动事件
        if (beforeInside) {
            // 发送鼠标移动事件
            // this.logger.debug('鼠标指针移动', this.mousePos, this);
            if (bubble !== false) {
                bubble = this.dispatchEvent(Event.MouseEvent.MOUSE_MOVE, { pos: this.mousePos });
            }
        }

        // this.logger.debug('舞台指针移动', mouse, beforeInside, this._mouseInside_);
        // 根据边界形状，判断鼠标是否在本对象范围内
        this._mouseInside_ = this._pointInBounds_(this.mousePos);

        if (this._mouseInside_ && !beforeInside) {
            // 如果之前不在范围内, 现在鼠标在范围内，发送鼠标进入事件
            this.logger.debug('鼠标指针进入边界', { pos: this.mousePos });
            this.dispatchEvent(Event.MouseEvent.MOUSE_OVER, { pos: this.mousePos });

            // 发送鼠标移动事件
            // this.logger.debug('鼠标指针移动', this.mousePos, this);
            bubble = this.dispatchEvent(Event.MouseEvent.MOUSE_MOVE, { pos: this.mousePos });
        } else if (!this._mouseInside_ && beforeInside) {
            // 如果之前在范围内，现在鼠标不在范围内, 发送鼠标移出事件
            this.logger.debug('鼠标指针移出边界', this.mousePos);
            this.dispatchEvent(Event.MouseEvent.MOUSE_OUT, { pos: this.mousePos });
        }
        return bubble;
    }

    /**
     * 舞台有鼠标移动时调用
     * @param pos {module:tigerface-shape.Point|{x:number,y:number}}
     * @return {boolean} 是否继续冒泡
     * @package
     */
    _onStageMouseMove_(pos) {
        let bubble = true;
        this.mousePos = this.getInnerPos(pos, 2);
        if (this.disabled) return bubble;

        //* ************** 先自顶向下传播，最后触发本级事件 **************************
        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            const child = this.children[i];
            if (child instanceof Sprite) {
                bubble = child._onStageMouseMove_(this.mousePos);
                if (bubble === false) break;
            }
        }
        bubble = this._checkMouseMove_();
        //* **************************** end ***************************************
        return bubble;
    }

    /**
     * 舞台鼠标事件发生时调用
     * @param eventName 事件名，事件数据
     * @param data 事件数据，包含 pos
     * @return {boolean} 是否继续冒泡
     * @package
     */
    _onStageMouseEvents_(eventName, data) {
        let bubble = true;
        this.mousePos = this.getInnerPos(data.pos, 2);
        if (this.disabled) return bubble;

        // MOUSE_OUT 事件，需要自己恢复状态
        if (eventName === Event.MouseEvent.MOUSE_OUT) {
            this.logger.debug('鼠标移出舞台');
            this._mouseInside_ = false;
        }

        //* ************** 先自顶向下传播，最后触发本级事件 **************************
        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            const child = this.children[i];
            if (child instanceof Sprite) {
                if (bubble !== false) {
                    bubble = child._onStageMouseEvents_(eventName, { pos: this.mousePos });
                } else {
                    if (eventName !== 'mousemove' && eventName !== 'mousemoveunbounded') {
                        child.logger.debug('_onStageMouseEvents_', `${eventName} 事件未触发，因为被其它对象中止事件冒泡`);
                    }
                    break;
                }
            }
        }
        //* **************************** end ***************************************


        // 如果鼠标移出 stage，那么向全体下级推送 MOUSE_OUT 事件。因为 canvas 或 sprite 可能大于 stage。
        if (eventName.endsWith('unbounded') || eventName === Event.MouseEvent.MOUSE_OUT || this._pointInBounds_(this.mousePos)) {
            if (bubble !== false) {
                bubble = this.dispatchEvent(eventName, { pos: this.mousePos });
            } else {
                if (eventName !== 'mousemove' && eventName !== 'mousemoveunbounded') {
                    this.logger.debug('_onStageMouseEvents_', `${eventName} 事件未触发，因为被上层对象中止事件冒泡`);
                }
            }
        }

        return bubble;
    }

    _onStageKeyEvents_(e) {
        let bubble = true;
        if (this.disabled) return bubble;

        //* ************** 先自顶向下传播，最后触发本级事件 **************************
        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            const child = this.children[i];
            if (child instanceof Sprite) {
                bubble = child._onStageKeyEvents_(e);
                if (bubble === false) break;
            }
        }

        if (bubble !== false) {
            bubble = this.dispatchEvent(e.eventName, e);
        } else {
            this.logger.debug('_onStageMouseEvents_', `${e.eventName} 事件未触发，因为被上层对象中止事件冒泡`);
        }

        //* **************************** end ***************************************
        return bubble;
    }

    /** *************************************************************************
     *
     * 拖拽
     *
     ************************************************************************* */

    /**
     * 启用拖拽
     */
    enableDrag(unbounded = false) {
        this._unboundedDrag_ = unbounded;
        this.addEventListener(Event.MouseEvent.MOUSE_DOWN, this._startDrag_);
        this.addEventListener(Event.MouseEvent.MOUSE_UP_UNBOUNDED, this._endDrag_);
        if (!unbounded) this.addEventListener(Event.MouseEvent.MOUSE_OUT, this._endDrag_);
    }

    /**
     * 禁用拖拽
     */
    disableDrag() {
        this._endDrag_();
        this.removeEventListener(Event.MouseEvent.MOUSE_DOWN, this._startDrag_);
        this.removeEventListener(Event.MouseEvent.MOUSE_UP_UNBOUNDED, this._endDrag_);
        this.removeEventListener(Event.MouseEvent.MOUSE_OUT, this._endDrag_);
    }

    /**
     * 开始拖拽，鼠标按下事件侦听器
     * @package
     */
    _startDrag_ = (e) => {
        if (this.dragging) return;

        if (this._unboundedDrag_) {
            this.parent.addEventListener(Event.MouseEvent.MOUSE_MOVE_UNBOUNDED, this._move_);
        } else {
            this.parent.addEventListener(Event.MouseEvent.MOUSE_MOVE, this._move_);
        }

        this.logger.debug('开始拖拽 _startDrag_(): mousePos=', this.mousePos);
        this.dragging = true;
        const m = this.getOuterPos(this.mousePos);
        this._dragX_ = m.x - this.x;
        this._dragY_ = m.y - this.y;
        this.dispatchEvent(Event.MouseEvent.DRAG_START, { pos: Object.assign({}, this.pos) });
        e.cancelBubble();
    };

    /**
     * 停止拖拽，鼠标放开事件侦听器
     * @package
     */
    _endDrag_ = (e) => {
        if (!this.dragging) return;

        if (this._unboundedDrag_) {
            this.parent.removeEventListener(Event.MouseEvent.MOUSE_MOVE_UNBOUNDED, this._move_);
        } else {
            this.parent.removeEventListener(Event.MouseEvent.MOUSE_MOVE, this._move_);
        }

        this.logger.debug('停止拖拽 _endDrag_()');
        this.dragging = false;
        this.dispatchEvent(Event.MouseEvent.DRAG_END, { pos: Object.assign({}, this.pos) });
        if (e) e.cancelBubble();
    };

    /**
     * 拖拽移动，鼠标移动事件侦听器
     * @param e 事件
     * @package
     */
    _move_ = (e) => {
        if (!this.dragging) return;

        const last = { x: this.x, y: this.y };
        this.x = e.pos.x - this._dragX_;
        this.y = e.pos.y - this._dragY_;
        this.dispatchEvent(Event.MouseEvent.DRAG, {
            pos: { x: this.x, y: this.y },
            // offset: { x: this.x - last.x, y: this.y - last.y },
            offset: { x: this._dragX_, y: this._dragY_ },
        });
        e.cancelBubble();
    };

    /**
     * 禁止触摸移动事件，触摸移动事件侦听器
     * @return {boolean}
     * @package
     */
    _disableTouchMove_ = () => {
        if (this.dragging) return false;
        return true;
    };

    //* ******************************** Event *********************************

    /**
     * 失去焦点事件侦听器（添加）
     * @member {function}
     */
    set onBlur(func) {
        this.on(Event.BLUR, func);
    }

    /**
     * 获得焦点事件侦听器（添加）
     * @member {function}
     */
    set onFocus(func) {
        this.on(Event.FOCUS, func);
    }

    /**
     * 尺寸改变事件侦听器（添加）
     * @member {function}
     */
    set onResize(func) {
        this.on(Event.SIZE_CHANGED, func);
    }

    //* ******************************** Key Event *********************************

    /**
     * 键盘按下事件侦听器（添加）
     * @member {function}
     */
    set onKeyDown(func) {
        this.on(Event.KeyEvent.KEY_DOWN, func);
    }

    /**
     * 键盘松开事件侦听器（添加）
     * @member {function}
     */
    set onKeyUp(func) {
        this.on(Event.KeyEvent.KEY_UP, func);
    }

    /**
     * 键盘按住事件侦听器（添加）
     * @member {function}
     */
    set onKeyPress(func) {
        this.on(Event.KeyEvent.KEY_PRESS, func);
    }

    //* ******************************** Mouse Event *********************************

    /**
     * 鼠标按下事件侦听器（添加）
     * @member {function}
     */
    set onMouseDown(func) {
        this.on(Event.MouseEvent.MOUSE_DOWN, func);
    }

    /**
     * 鼠标放开事件侦听器（添加）
     * @member {function}
     */
    set onMouseUp(func) {
        this.on(Event.MouseEvent.MOUSE_UP, func);
    }

    /**
     * 鼠标移动事件侦听器（添加）
     * @member {function}
     */
    set onMouseMove(func) {
        this.on(Event.MouseEvent.MOUSE_MOVE, func);
    }

    /**
     * 鼠标移出事件侦听器（添加）
     * @member {function}
     */
    set onMouseOut(func) {
        this.on(Event.MouseEvent.MOUSE_OUT, func);
    }

    /**
     * 鼠标移入事件侦听器（添加）
     * @member {function}
     */
    set onMouseOver(func) {
        this.on(Event.MouseEvent.MOUSE_OVER, func);
    }

    /**
     * 鼠标单击事件侦听器（添加）
     * @member {function}
     */
    set onClick(func) {
        this.on(Event.MouseEvent.CLICK, func);
    }

    /**
     * 鼠标双击事件侦听器（添加）
     * @member {function}
     */
    set onDoubleClick(func) {
        this.on(Event.MouseEvent.DOUBLE_CLICK, func);
    }

    /**
     * 鼠标右键单击事件侦听器（添加）
     * @member {function}
     */
    set onContextMenu(func) {
        this.on(Event.MouseEvent.CONTEXT_MENU, func);
    }

    /**
     * 拖拽开始事件侦听器（添加）
     * @member {function}
     */
    set onDragStart(func) {
        this.on(Event.MouseEvent.DRAG_START, func);
    }

    /**
     * 拖拽结束事件侦听器（添加）
     * @member {function}
     */
    set onDragEnd(func) {
        this.on(Event.MouseEvent.DRAG_END, func);
    }

    /**
     * 拖拽移动事件侦听器（添加）
     * @member {function}
     */
    set onDrag(func) {
        this.on(Event.MouseEvent.DRAG, func);
    }

    //* ******************************** Touch Event *********************************

    /**
     * 触摸开始事件侦听器（添加）
     * @member {function}
     */
    set onTouchStart(func) {
        this.on(Event.TouchEvent.TOUCH_START, func);
    }

    /**
     * 触摸移动事件侦听器（添加）
     * @member {function}
     */
    set onTouchMove(func) {
        this.on(Event.TouchEvent.TOUCH_MOVE, func);
    }

    /**
     * 触摸结束事件侦听器（添加）
     * @member {function}
     */
    set onTouchEnd(func) {
        this.on(Event.TouchEvent.TOUCH_END, func);
    }

    /**
     * 触摸取消事件侦听器（添加）
     * @member {function}
     */
    set onTouchCancel(func) {
        this.on(Event.TouchEvent.TOUCH_CANCEL, func);
    }

    /**
     * 触摸"开始捏"事件侦听器（添加）
     * @member {function}
     */
    set onTouchStartPinch(func) {
        this.on(Event.TouchEvent.TOUCH_START_PINCH, func);
    }

    /**
     * 触摸"捏过程"事件侦听器（添加）
     * @member {function}
     */
    set onTouchMovePinch(func) {
        this.on(Event.TouchEvent.TOUCH_MOVE_PINCH, func);
    }

    //* ******************************** loop Event *********************************

    /**
     * 重绘事件侦听器（添加）
     * @member {function}
     */
    set onRedraw(func) {
        this.on(Event.REDRAW, func);
    }

    set onBeforeDraw(func) {
        this.on(Event.BEFORE_REDRAW, func);
    }

    set onAfterDraw(func) {
        this.on(Event.AFTER_REDRAW, func);
    }

    /**
     * 进入帧事件侦听器（添加）
     * @member {function}
     */
    set onEnterFrame(func) {
        this.on(Event.ENTER_FRAME, func);
    }

    //* ******************************** Append Event *********************************

    set onAppendToParent(func) {
        this.on(Event.APPEND_TO_PARENT, func);
    }

    set onAppendToLayer(func) {
        this.on(Event.APPEND_TO_LAYER, func);
    }

    set onAppendToStage(func) {
        this.on(Event.APPEND_TO_STAGE, func);
    }

    //* ******************************** Node Event *********************************

    set onChildAdded(func) {
        this.on(Event.NodeEvent.CHILD_ADDED, func);
    }

    set onChildRemoved(func) {
        this.on(Event.NodeEvent.CHILD_REMOVED, func);
    }

    set onChildrenChanged(func) {
        this.on(Event.NodeEvent.CHILDREN_CHANGED, func);
    }

    //* ******************************** end *********************************

    /**
     * 将感应区投影到全局坐标系
     */
    mirror() {
        const shadow = new Sprite();
        // 通过感应区的外边框的坐标变换，来计算投影的旋转和缩放

        this.bounds.forEach((bound) => {
            shadow.addBound(this._shapeToStage_(bound));
        });

        return shadow;
    }

    _shapeToStage_(shape) {
        const vertexes = shape.getVertexes();
        const points = [];

        vertexes.forEach((vertex) => {
            points.push(this.getStagePos(vertex));
        });

        if (Rectangle.isRectangle(points)) {
            return new Rectangle(points);
        }

        return new Polygon(points);
    }

    _shapeToLayer_(shape) {
        const vertexes = shape.getVertexes();
        const points = [];

        vertexes.forEach((vertex) => {
            points.push(this.getLayerPos(vertex));
        });

        if (Rectangle.isRectangle(points)) {
            return new Rectangle(points);
        }
        return new Polygon(points);
    }

    _shapeToOuter_(shape) {
        const vertexes = shape.getVertexes();
        const points = [];

        vertexes.forEach((vertex) => {
            points.push(this.getOuterPos(vertex));
        });

        return new Polygon(points);
    }

    /** *************************************************************************
     *
     * 碰撞
     *
     ************************************************************************* */

    /**
     * 点碰撞测试，用边界形状做碰撞测试。<br>
     *     注意：碰撞测试前，点坐标要转换为内部坐标
     * @param point 内部坐标
     * @returns {boolean}
     */
    hitTestPoint(point) {
        return this.mirror()._pointInBounds_(point);
    }

    /**
     * 对象碰撞测试，用两边界形状做碰撞测试。<br>
     *     碰撞测试前，需要把形状转换为同一坐标系
     * @param target
     * @returns {boolean}
     */
    hitTestObject(target) {
        const a = this.mirror();
        const b = target.mirror();

        if (a.boundingRect.hitTestRectangle(b.boundingRect)) {
            for (let i = 0; i < a.bounds.length; i += 1) {
                const shape1 = a.bounds[i];
                for (let j = 0; j < b.bounds.length; j += 1) {
                    const shape2 = b.bounds[j];
                    if (shape1.hitTestPolygon(shape2)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}

export default Sprite;
