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
     * 构造器
     *
     * @param options 选项
     */
    constructor(options) {

        let props = {
            className : Sprite.name,
            _bounds_ : []
        }

        super(props);

        this.on(Event.APPEND_TO_STAGE, () => {

            // 拖拽时，移动设备的缺省触摸事件会干扰显示对象的移动，所以用下面侦听器，在拖拽时禁止缺省的 TOUCH_MOVE 事件传递。
            this.stage.on(Event.TouchEvent.TOUCH_MOVE, this._disableTouchMove_)

        });

        this._dragging_ = false;

        this.assign(options);
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
     * @param shape 边界多边形
     */
    addBound(shape) {
        this._bounds_.push(shape);
        this._boundingRect_ = this._createBoundingRect_();
        this.postChange('addBound');
        return this;
    }

    removeBound(i) {
        if (this._bounds_[i]) {
            this._bounds_.splice(i, 1);
            this._boundingRect_ = this._createBoundingRect_();
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
        let left = 100000, top = 100000, right = -100000, bottom = -100000;
        let changed = false;
        for (let i = 0; i < this.bounds.length; i++) {
            let rect = this.bounds[i].getBoundingRect();
            rect.right = rect.left + rect.width;
            rect.bottom = rect.top + rect.height;

            left = rect.left < left ? rect.left : left;
            top = rect.top < top ? rect.top : top;
            right = rect.right > right ? rect.right : right;
            bottom = rect.bottom > bottom ? rect.bottom : bottom;
            changed = true;
        }
        let boundRect = changed ? {
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
        this.logger.debug("_createBoundingRect_()", this.name, boundRect);
        return new Rectangle(boundRect.left, boundRect.top, boundRect.width, boundRect.height);
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
            this.logger.debug(`_startDrag_(): mousePos=`, this.getMousePos());
            this._dragging_ = true;
            let m = this.getOuterPos(this.getMousePos());
            this._dragX_ = m.x - this.x;
            this._dragY_ = m.y - this.y;
            this.dispatchEvent(Event.MouseEvent.DRAG_START);
            return true;
        }
    };

    _endDrag_ = () => {
        if (this._dragging_) {
            this.logger.debug(`_endDrag_()`);
            this._dragging_ = false;
            this.dispatchEvent(Event.MouseEvent.DRAG_END);
            return true;
        }
    };

    _move_ = (e) => {
        // this.logger.debug(`_move_()`);
        if (this._dragging_) {
            let last = {x: this.x, y: this.y};
            this.x = e.pos.x - this._dragX_;
            this.y = e.pos.y - this._dragY_;
            this.dispatchEvent(Event.MouseEvent.DRAG, {
                pos: {x: this.x, y: this.y},
                offset: {x: this.x - last.x, y: this.y - last.y}
            });
        }
    };

    _disableTouchMove_ = () => {
        if (this._dragging_) return false;
    }
}
