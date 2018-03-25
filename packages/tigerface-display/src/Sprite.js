/* eslint-disable class-methods-use-this */

import { Logger } from 'tigerface-common';
import { Event } from 'tigerface-event';
import { Rectangle } from 'tigerface-shape';
import DisplayObjectContainer from './DisplayObjectContainer';

/**
 * 精灵类，有交互能力的显示对象
 *
 * @extends DisplayObjectContainer
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class Sprite extends DisplayObjectContainer {
    static logger = Logger.getLogger(Sprite.name);

    /**
     * 构造器
     *
     * @param options 选项
     */
    constructor(options = undefined) {
        const props = {
            clazzName: Sprite.name,
            _bounds_: [],
        };

        super(props);

        this.on(Event.APPEND_TO_STAGE, () => {
            // 拖拽时，移动设备的缺省触摸事件会干扰显示对象的移动，所以用下面侦听器，在拖拽时禁止缺省的 TOUCH_MOVE 事件传递。
            this.stage.on(Event.TouchEvent.TOUCH_MOVE, this._disableTouchMove_);
        });

        this._dragging_ = false;

        this.assign(options);
    }

    /** *************************************************************************
     *
     * 边界
     *
     ************************************************************************* */

    /**
     * 添加边界多边形<br>
     *     边界可由一个或多个多边形组成，bounds可以是一个shape对象或多个shape对象组成的数组
     *
     * @param shape 边界多边形
     */
    addBound(shape) {
        this._bounds_.push(shape);
        this._createBoundingRect_();
        this.postChange('addBound');
        return this;
    }

    removeBound(i) {
        if (this._bounds_[i]) {
            this._bounds_.splice(i, 1);
            this._createBoundingRect_();
        }
        this.postChange('removeBound');
    }

    get bounds() {
        return this._bounds_;
    }

    /**
     * 获取边界多边形的外接矩形
     * @private
     */
    _createBoundingRect_() {
        let left = 100000;
        let top = 100000;
        let right = -100000;
        let bottom = -100000;
        let changed = false;
        for (let i = 0; i < this.bounds.length; i += 1) {
            const rect = this.bounds[i].getBoundingRect();
            rect.right = rect.left + rect.width;
            rect.bottom = rect.top + rect.height;

            left = rect.left < left ? rect.left : left;
            top = rect.top < top ? rect.top : top;
            right = rect.right > right ? rect.right : right;
            bottom = rect.bottom > bottom ? rect.bottom : bottom;
            changed = true;
        }
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
        this.logger.debug('_createBoundingRect_()', this.name, boundRect);
        this._boundingRect_ = new Rectangle(boundRect.left, boundRect.top, boundRect.width, boundRect.height);
        this._onBoundingRectChanged_();
    }

    /**
     * 获取边界多边形的外接矩形（缓存）
     */
    get boundingRect() {
        if (!this._boundingRect_) {
            this._createBoundingRect_();
        }
        return this._boundingRect_;
    }

    _onSizeChanged_() {
        super._onSizeChanged_();
        this._createBoundingRect_();
    }

    _onBoundingRectChanged_() {
    }

    /** *************************************************************************
     *
     * 碰撞测试
     *
     ************************************************************************* */

    /**
     * 返回点与感应区的碰撞测试结果
     *
     * @param point 测试点
     * @returns boolean 测试结果
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

    /**
     * 获得鼠标坐标
     * @returns {Point|{x: *, y: *}}
     */
    get mousePos() {
        return { x: this._mouseX_, y: this._mouseY_ };
    }

    /**
     *
     * @param pos {Point|{x: *, y: *}}
     */
    set mousePos(pos) {
        this._mouseX_ = pos.x;
        this._mouseY_ = pos.y;
    }

    get mouseX() {
        return this._mouseX_;
    }

    get mouseY() {
        return this._mouseY_;
    }

    _onStateChanged_() {
        super._onStateChanged_();
        if (this.parent) {
            this._onStageMouseMove_(this.parent.mousePos, 2);
        }
    }

    _checkMouseInside_(pos, digits) {
        const mouse = this.getInnerPos(pos, digits);
        this.mousePos = mouse;
        // 记录之前的状态，用来判断是否第一次进入
        const beforeInside = this._mouseInside_;
        // this.logger.debug('舞台指针移动', mouse, beforeInside, this._mouseInside_);
        // 根据边界形状，判断鼠标是否在本对象范围内
        this._mouseInside_ = this._pointInBounds_(mouse);

        if (this._mouseInside_) {
            // 当前鼠标在范围内
            if (!beforeInside) {
                // 如果之前不在范围内，发送鼠标进入事件
                this.logger.debug('鼠标指针进入边界');
                this.dispatchEvent(Event.MouseEvent.MOUSE_OVER);
            }
            return true;
        } else if (beforeInside) {
            // 当前鼠标不在范围内, 如果之前在范围内，发送鼠标移出事件
            this.logger.debug('鼠标指针移出边界', mouse);
            this.dispatchEvent(Event.MouseEvent.MOUSE_OUT);
        }
        return false;
    }

    _onStageMouseMove_(pos, digits = 2) {
        if (this._checkMouseInside_(pos, digits)) {
            // 发送鼠标移动事件
            // this.logger.debug('鼠标指针移动', this.mousePos, this);
            this.dispatchEvent(Event.MouseEvent.MOUSE_MOVE, { pos: this.mousePos });
        }

        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            const child = this.children[i];
            if (child instanceof Sprite) {
                child._onStageMouseMove_(this.mousePos, 2);
            }
        }
    }

    _onStageMouseEvents_(eventName, data) {
        // 如果鼠标移出 stage，那么向全体下级推送 MOUSE_OUT 事件。因为 canvas 或 sprite 可能大于 stage。
        if (eventName === Event.MouseEvent.MOUSE_OUT || data.pos === undefined || this._checkMouseInside_(data.pos, 2)) {
            // 上级推送的 MOUSE_OUT 事件，需要自己恢复状态
            if (eventName === Event.MouseEvent.MOUSE_OUT) {
                this.logger.debug('鼠标移出舞台');
                this.mousePos = { x: -1, y: -1 };
                this._mouseInside_ = false;
            }

            // 本级事件转发
            this.dispatchEvent(eventName, { pos: this.mousePos });

            // 向下级传播
            for (let i = this.children.length - 1; i >= 0; i -= 1) {
                const child = this.children[i];
                if (child instanceof Sprite) {
                    this.logger.debug('_onStageMouseEvents_', eventName, data.pos, child);
                    child._onStageMouseEvents_(eventName, { pos: this.mousePos });
                }
            }
        }
    }

    /** *************************************************************************
     *
     * 拖拽
     *
     ************************************************************************* */

    enableDrag() {
        this.addEventListener(Event.MouseEvent.MOUSE_DOWN, this._startDrag_);
        this.addEventListener(Event.MouseEvent.MOUSE_UP, this._endDrag_);
    }

    disableDrag() {
        this.removeEventListener(Event.MouseEvent.MOUSE_DOWN, this._startDrag_);
        this.removeEventListener(Event.MouseEvent.MOUSE_UP, this._endDrag_);
    }

    _startDrag_ = () => {
        this.parent.addEventListener(Event.MouseEvent.MOUSE_MOVE, this._move_);

        if (!this._dragging_) {
            this.logger.debug('开始拖拽 _startDrag_(): mousePos=', this.mousePos);
            this._dragging_ = true;
            const m = this.getOuterPos(this.mousePos);
            this._dragX_ = m.x - this.x;
            this._dragY_ = m.y - this.y;
            this.dispatchEvent(Event.MouseEvent.DRAG_START);
            return true;
        }

        return false;
    };

    _endDrag_ = () => {
        if (this._dragging_) {
            this.logger.debug('停止拖拽 _endDrag_()');
            this._dragging_ = false;
            this.dispatchEvent(Event.MouseEvent.DRAG_END);
            return true;
        }
        return false;
    };

    _move_ = (e) => {
        // this.logger.debug(`_move_()`);
        if (this._dragging_) {
            const last = { x: this.x, y: this.y };
            this.x = e.pos.x - this._dragX_;
            this.y = e.pos.y - this._dragY_;
            this.dispatchEvent(Event.MouseEvent.DRAG, {
                pos: { x: this.x, y: this.y },
                offset: { x: this.x - last.x, y: this.y - last.y },
            });
        }
    };

    _disableTouchMove_ = () => {
        if (this._dragging_) return false;
        return true;
    };

    //* ******************************** Event *********************************

    set onBlur(func) {
        this.on(Event.BLUR, func);
    }

    set onFocus(func) {
        this.on(Event.FOCUS, func);
    }

    set onResize(func) {
        this.on(Event.SIZE_CHANGED, func);
    }

    //* ******************************** Key Event *********************************

    set onKeyDown(func) {
        this.on(Event.KeyEvent.KEY_DOWN, func);
    }

    set onKeyUp(func) {
        this.on(Event.KeyEvent.KEY_UP, func);
    }

    set onKeyPress(func) {
        this.on(Event.KeyEvent.KEY_PRESS, func);
    }

    //* ******************************** Mouse Event *********************************

    set onMouseDown(func) {
        this.on(Event.MouseEvent.MOUSE_DOWN, func);
    }

    set onMouseUp(func) {
        this.on(Event.MouseEvent.MOUSE_UP, func);
    }

    set onMouseMove(func) {
        this.on(Event.MouseEvent.MOUSE_MOVE, func);
    }

    set onMouseOut(func) {
        this.on(Event.MouseEvent.MOUSE_OUT, func);
    }

    set onMouseOver(func) {
        this.on(Event.MouseEvent.MOUSE_OVER, func);
    }

    set onClick(func) {
        this.on(Event.MouseEvent.CLICK, func);
    }

    set onDoubleClick(func) {
        this.on(Event.MouseEvent.DOUBLE_CLICK, func);
    }

    set onContextMenu(func) {
        this.on(Event.MouseEvent.CONTEXT_MENU, func);
    }

    set onDragStart(func) {
        this.on(Event.MouseEvent.DRAG_START, func);
    }

    set onDragEnd(func) {
        this.on(Event.MouseEvent.DRAG_END, func);
    }

    set onDrag(func) {
        this.on(Event.MouseEvent.DRAG, func);
    }

    //* ******************************** Touch Event *********************************

    set onTouchStart(func) {
        this.on(Event.TouchEvent.TOUCH_START, func);
    }

    set onTouchMove(func) {
        this.on(Event.TouchEvent.TOUCH_MOVE, func);
    }

    set onTouchEnd(func) {
        this.on(Event.TouchEvent.TOUCH_END, func);
    }

    set onTouchCancel(func) {
        this.on(Event.TouchEvent.TOUCH_CANCEL, func);
    }

    set onTouchStartPinch(func) {
        this.on(Event.TouchEvent.TOUCH_START_PINCH, func);
    }

    set onTouchMovePinch(func) {
        this.on(Event.TouchEvent.TOUCH_MOVE_PINCH, func);
    }
}

export default Sprite;
