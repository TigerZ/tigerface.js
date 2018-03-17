/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */
import {EventDispatcher, Event} from 'tigerface-event';
import {Point} from 'tigerface-shape';
import {Utilities as T, Logger} from 'tigerface-common';


/**
 * DisplayObject 是最底层显示对象，是其他现实对象的超类。
 * 职责：
 * 1、定义显示相关基本属性，比如：坐标、尺寸、原点、缩放、旋转、透明度 ...
 * 2、实现 setState 和 postChange 机制
 * 3、由 _paint_ 主绘制方法串起来的 paint 方法组，子类通过覆盖各阶段方法实现多态，应用类仅实现 paint 方法
 * 4、基本的内外部坐标转换方法：getOuterPos 和 getInnerPos
 */
export default class DisplayObject extends EventDispatcher {
    static logger = Logger.getLogger(DisplayObject.name);

    /**
     * 构造器。
     * @param options {Object} 属性初始值，比如：pos，origin，size ...
     */
    constructor(options) {
        let props = {
            clazz: DisplayObject.name,
            uuid: T.uuid(),
        };

        super(props);

        // 基本状态属性
        this.state = {
            pos: {x: 0, y: 0},
            size: {width: 320, height: 240},
            scale: {x: 1, y: 1},
            origin: {x: 0, y: 0},
            alpha: 1,
            rotation: 0,
            visible: true,
        };

        // 基本信息
        this._parent_ = undefined;
        this.layer = undefined;
        this.stage = undefined;

        // 通过侦听 MOUSE_MOVE 事件，产生内部的 mouseX 和 mouseY 属性
        this.on(Event.MouseEvent.MOUSE_DOWN, e => this._onMouseDown_(e));
        this.on(Event.MouseEvent.MOUSE_MOVE, e => this._onMouseMove_(e));

        // 设置传入的初始值
        this.assign(options);
    }

    //*********************************** 坐标 **************************************

    set x(x) {
        this.pos = {x};
    }

    get x() {
        return this.pos.x;
    }

    set y(y) {
        this.pos = {y};
    }

    get y() {
        return this.pos.y;
    }

    set pos(pos) {
        Object.assign(this.state.pos, pos);
        this._onPosChanged_();
        this.postChange('pos');
    }

    get pos() {
        return this.state.pos;
    }

    _onPosChanged_() {
    }

    //*********************************** 缩放 **************************************

    set scaleX(x) {
        this.scale = {x};
    }

    get scaleX() {
        return this.scale.x;
    }

    set scaleY(y) {
        this.scale = {y};
    }

    get scaleY() {
        return this.scale.y;
    }

    set scale(scale) {
        Object.assign(this.state.scale, scale);
        this._onScaleChanged_();
        this.postChange('scale');
    }

    get scale() {
        return this.state.scale;
    }

    _onScaleChanged_() {
    }

    //*********************************** 透明度 **************************************

    set alpha(alpha) {
        this.state.alpha = alpha;
        this._onAlphaChanged_();
        this.postChange('setAlpha');
    }

    get alpha() {
        return this.state.alpha;
    }

    _onAlphaChanged_() {
    }

    //********************************** 旋转 ***************************************

    set rotation(rotation) {
        this.state.rotation = rotation % 360;
        this._onRotationChanged_();
        this.postChange('rotation');
    }

    get rotation() {
        return this.state.rotation;
    }

    _onRotationChanged_() {
    }

    //*********************************** 可见 **************************************

    set visible(visible) {
        this.state.visible = visible;
        this._onVisibleChanged_();
        this.postChange('visible');
    }

    get visible() {
        return this.state.visible;
    }

    _onVisibleChanged_() {
    }

    //*********************************** 原点 **************************************

    set originX(x) {
        this.origin = {x};
    }

    get originX() {
        return this.origin.x;
    }

    set originY(y) {
        this.origin = {y};
    }

    get originY() {
        return this.origin.y;
    }

    set origin(origin) {
        Object.assign(this.state.origin, origin);
        this._onOriginChanged_();
        this.postChange('origin');
    }

    get origin() {
        return this.state.origin;
    }

    _onOriginChanged_() {
    }

    //********************************** 大小 ***************************************

    set width(width) {
        this.size = {width};
    }

    get width() {
        return this.size.width;
    }

    set height(height) {
        this.size = {height};
    }

    get height() {
        return this.size.height;
    }

    set size(size) {
        const old = this.size;
        Object.assign(this.state.size, size);
        this._onSizeChanged_();
        this.postChange('size');
        if (this.state.size.width !== old.width || this.state.size.height !== old.height) {
            this.dispatchEvent(Event.SIZE_CHANGED);
        }
    }

    get size() {
        return this.state.size;
    }

    _onSizeChanged_() {
    }

    //********************************** 绘图上下文 ***************************************

    get graphics() {
        return this._graphics_;
    }

    set graphics(v) {
        this._graphics_ = v;
    }

    //********************************** 鼠标事件 ***************************************

    /**
     * 鼠标移动事件侦听
     * @param e
     */
    _onMouseMove_(e) {
        this._mouseX_ = e.pos.x;
        this._mouseY_ = e.pos.y;
        // this.logger.debug(`_onMouseMove_(): this._mouseX_=${this._mouseX_}, this._mouseY_=${this._mouseY_}`);
    }

    _onMouseDown_(e) {
        this._onMouseMove_(e);
    }

    /**
     * 获得鼠标坐标
     * @returns {{x: *, y: *}}
     */
    getMousePos() {
        return {x: this._mouseX_, y: this._mouseY_};
    }

    //********************************** 状态改变事件 ***************************************

    /**
     * 提交“已改变”状态
     * @param log
     */
    postChange(log) {
        this._changed_ = true;
        // this._change_log_ = log;
        this.dispatchEvent(Event.STATUS_CHANGED, {log});
    }

    update(options) {
        super.update(options);
        this.postChange('update');
    }

    /**
     * 清除“已改变”状态
     */
    clearChange() {
        this._changed_ = false;
        // this._change_log_ = undefined;
    }

    /**
     * 是否已改变
     * @returns {boolean|*|DisplayObject._changed_}
     */
    isChanged() {
        return this._changed_;
    }

    //********************************** 重绘事件 ***************************************

    /**
     * 重绘方法，需要被实现
     *
     */
    paint() {
    }

    /**
     * 绘制前准备环境：缩放、旋转
     *
     */
    _onBeforePaint_() {
    }

    _onAfterPaint_() {
    }

    /**
     * 完整绘制方法，此方法会被主循环调用
     *
     */
    _paint_() {
        let g = this.graphics;
        // this.logger.debug(`重绘...`);
        // 为最高效率，对象可见，才进入
        if (!this.visible) return;

        // 清除"状态已改变"标志
        this.clearChange();

        // 保存一次上下文
        g && g.save();

        // 先调用绘制前处理
        this._onBeforePaint_();
        this.dispatchEvent(Event.BEFORE_REDRAW, {target: this, context: g});

        // 保存二次上下文
        g && g.save();

        // 再调用自身绘制
        this.paint();
        this.dispatchEvent(Event.REDRAW, {target: this, context: g});

        // 最后调用绘制后处理
        this._onAfterPaint_();
        this.dispatchEvent(Event.AFTER_REDRAW, {target: this, context: g});

        // 恢复二次上下文
        g && g.restore();

        // 恢复一次上下文
        g && g.restore();
    }

    //********************************** 进入帧事件 ***************************************

    _onEnterFrame_() {
        this.emit(Event.ENTER_FRAME, {target: this});
    }

    //********************************** 坐标转换 ***************************************

    /**
     * 返回外部坐标
     *
     * @param point {Point|{x: *, y: *}} 内部坐标
     * @param digits {number} 结果小数位数（精确度）
     * @returns {Point} 外部坐标
     */
    getOuterPos(point, digits = 0) {
        if (undefined === point) return undefined;
        point = new Point(point.x, point.y);

        const o = this.origin;
        const r = this.rotation;
        const s = this.scale;

        // 抵消原点 > 旋转 > 缩放 > 移动
        const pos = point
            .move(-o.x, -o.y)
            .rotate(T.degreeToRadian(r))
            .scale(s.x, s.y)
            .move(this.x, this.y);

        // 除非指定小数位数，缺省取整
        pos.x = T.round(pos.x, digits > 0 ? digits : 0);
        pos.y = T.round(pos.y, digits > 0 ? digits : 0);

        // this.logger.debug(`[${this.clazz}]:getOuterPos()`, point, pos);

        return pos;
    }

    /**
     * 返回内部坐标
     *
     * @param point {Point} 外部坐标
     * @param digits {number} 精度
     * @returns {Point} 内部坐标
     */
    getInnerPos(point, digits = 0) {
        if (undefined === point) return undefined;

        point = new Point(point.x, point.y);

        const o = this.origin;
        const r = this.rotation;
        const s = this.scale;

        const p = point.move(-this.x, -this.y) // 偏移本地位置
            .scale(1 / s.x, 1 / s.y) // 缩放
            .rotate(T.degreeToRadian(-r)) // 旋转
            .move(o.x, o.y); // 偏移原点

        // 除非指定小数位数，缺省取整
        p.x = T.round(p.x, digits > 0 ? digits : 0);
        p.y = T.round(p.y, digits > 0 ? digits : 0);

        // this.logger.debug(`[${this.clazz}]:getInnerPos`, point, p);

        return p;
    }

    //********************************** 宿主 ***************************************

    set parent(value) {
        this._parent_ = value;
        this._onAppendToParent_();
    }

    get parent() {
        return this._parent_;
    }

    _onAppendToParent_() {
        if (this.parent) {
            this.dispatchEvent(Event.APPEND_TO_PARENT);
            this.postChange("AppendToParent");
        }
    }

    _onAppendToStage_() {
        if (this.stage && this.stage !== this) {
            this.dispatchEvent(Event.APPEND_TO_STAGE);
            this.postChange("AppendToStage");
        }
    }

    _onAppendToLayer_() {
        this.getLayer();
        if (this.layer) {
            this.dispatchEvent(Event.APPEND_TO_LAYER);
            this.postChange("AppendToLayer");
        }
    }
}