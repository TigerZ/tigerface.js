/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 14:16.
 */
import DisplayObjectContainer from "./DisplayObjectContainer";
import {Logger} from 'tigerface-common';
import {Event} from 'tigerface-event';
import {Rectangle} from 'tigerface-shape';

export default class Sprite extends DisplayObjectContainer {
    static logger = Logger.getLogger(Sprite.name);

    /**
     * 初始化舞台
     *
     * @param wrapper Dom节点
     * @param options 选项
     */
    constructor(options) {

        super(options);

        // 基本信息
        this.className = Sprite.name;

        this.on(Event.APPEND_TO_STAGE, (e) => {

            // 拖拽时，移动设备的缺省触摸事件会干扰显示对象的移动，所以用下面侦听器，在拖拽时禁止缺省的 TOUCH_MOVE 事件传递。
            this.stage.on(Event.TouchEvent.TOUCH_MOVE, this._disableTouchMove_)

        });

        this._dragging_ = false;

        // 边界图形数组
        this._bounds_ = [];

    }

    /***************************************************************************
     *
     * 边界
     *
     **************************************************************************/

    /**
     * 添加边界多边形<br>
     *     边界可由一个或多个多边形组成，bounds可以是一个shape对象或多个shape对象组成的数组
     *
     * @param x 此边界多边形的X坐标
     * @param y 此边界多边形的Y坐标
     * @param shape 边界多边形
     */
    addBound(shape) {
        this._bounds_.push(shape);
        this._boundingRect_ = this._createBoundingRect_();
        this.postChange("addBound");
        return this;
    }

    removeBound(i) {
        if (this._bounds_[i]) {
            this._bounds_.splice(i, 1);
            this._boundingRect_ = this._createBoundingRect_();
        }
        this.postChange("removeBound");
    }

    get bounds() {
        return this._bounds_;
    }

    /**
     * 获取边界多边形的外接矩形
     * @private
     */
    _createBoundingRect_() {
        var left = 100000, top = 100000, right = -100000, bottom = -100000;
        var changed = false;
        for (var i = 0; i < this.bounds.length; i++) {
            var rect = this.bounds[i].getBoundingRect();
            rect.right = rect.left + rect.width;
            rect.bottom = rect.top + rect.height;

            left = rect.left < left ? rect.left : left;
            top = rect.top < top ? rect.top : top;
            right = rect.right > right ? rect.right : right;
            bottom = rect.bottom > bottom ? rect.bottom : bottom;
            changed = true;
        }
        var rect = changed ? {
            left: left,
            top: top,
            width: right - left,
            height: bottom - top
        } : {
            left: 0,
            top: 0,
            width: 0,
            height: 0
        };
        //console.log(this.name, rect);
        Sprite.logger.debug("_createBoundingRect_()", this.name, rect);
        return new Rectangle(rect.left, rect.top, rect.width, rect.height);
    }

    /**
     * 获取边界多边形的外接矩形（缓存）
     */
    get boundingRect() {
        if (!this._boundingRect_)
            this._boundingRect_ = this._createBoundingRect_();
        return this._boundingRect_;
    }

    /***************************************************************************
     *
     * 拖拽
     *
     **************************************************************************/

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
            Sprite.logger.debug(`_startDrag_(): mousePos=`, this.getMousePos());
            this._dragging_ = true;
            var m = this.getOuterPos(this.getMousePos());
            this._dragX_ = m.x - this.x;
            this._dragY_ = m.y - this.y;
            this.dispatchEvent(Event.MouseEvent.DRAG_START);
            return true;
        }
    }

    _endDrag_ = () => {
        if (this._dragging_) {
            Sprite.logger.debug(`_endDrag_()`);
            this._dragging_ = false;
            this.dispatchEvent(Event.MouseEvent.DRAG_END);
            return true;
        }
    }

    _move_ = (e) => {
        // Sprite.logger.debug(`[${this.className}]:_move_()`);
        if (this._dragging_) {
            var last = {x: this.x, y: this.y};
            this.x = e.pos.x - this._dragX_;
            this.y = e.pos.y - this._dragY_;
            this.dispatchEvent(Event.MouseEvent.DRAG, {
                pos: {x: this.x, y: this.y},
                offset: {x: this.x - last.x, y: this.y - last.y}
            });
        }
    }

    _disableTouchMove_ = () => {
        if (this._dragging_) return false;
    }
}
