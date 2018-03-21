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
    constructor(options = undefined) {
        let props = {
            clazzName: DisplayObject.name,
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

        // 宿主信息
        this._parent_ = undefined;
        this._layer_ = undefined;
        this._stage_ = undefined;

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

    /**
     * 设置坐标
     * @param pos {Point|{x:*,y:*}}
     */
    set pos(pos) {
        if (T.assignEqual(this.pos, pos)) return;
        Object.assign(this.state.pos, pos);
        this._onPosChanged_();
        this.postChange('pos', this.pos);
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

    /**
     * 设置缩放
     * @param scale {Point|{x:*,y:*}}
     */
    set scale(scale) {
        if (T.assignEqual(this.scale, scale)) return;
        Object.assign(this.state.scale, scale);
        this._onScaleChanged_();
        this.postChange('scale', this.scale);
    }

    get scale() {
        return this.state.scale;
    }

    _onScaleChanged_() {
    }

    //*********************************** 透明度 **************************************

    /**
     * 设置透明度
     * @param alpha {number} 0 至 1
     */
    set alpha(alpha) {
        if (T.assignEqual(this.alpha, alpha)) return;
        this.state.alpha = alpha;
        this._onAlphaChanged_();
        this.postChange('setAlpha', this.alpha);
    }

    get alpha() {
        return this.state.alpha;
    }

    _onAlphaChanged_() {
    }

    //********************************** 旋转 ***************************************

    /**
     * 设置旋转角度
     * @param rotation {number} 旋转角度
     */
    set rotation(rotation) {
        if (T.assignEqual(this.rotation, rotation)) return;
        this.state.rotation = rotation % 360;
        this._onRotationChanged_();
        this.postChange('rotation', this.rotation);
    }

    get rotation() {
        return this.state.rotation;
    }

    _onRotationChanged_() {
    }

    //*********************************** 可见 **************************************

    /**
     * 设置可见性
     * @param visible {boolean} 是否可见
     */
    set visible(visible) {
        if (T.assignEqual(this.visible, visible)) return;
        this.state.visible = visible;
        this._onVisibleChanged_();
        this.postChange('visible', this.visible);
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

    /**
     * 设置原点
     * @param origin {Point|{x:*,y:*}}
     */
    set origin(origin) {
        if (T.assignEqual(this.origin, origin)) return;
        Object.assign(this.state.origin, origin);
        this._onOriginChanged_();
        this.postChange('origin', this.origin);
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

    /**
     * 设置大小
     * @param size {{width:*,height:*}} 大小
     */
    set size(size) {
        if (T.assignEqual(this.size, size)) return;
        Object.assign(this.state.size, size);
        this._onSizeChanged_();
        this.postChange('size', this.size);
        this.dispatchEvent(Event.SIZE_CHANGED);
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

    /**
     * 鼠标按下事件
     * @param e
     */
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

    _onStateChanged_() {
        if (this.layer) this.layer.layerChanged();
    }

    /**
     * 提交“已改变”状态
     * @param log
     * @return {boolean}
     */
    postChange(...log) {
        if (log.length && log[0]) this.logger.debug('状态改变', ...log);
        if (this.isChanged) return;
        this._changed_ = true;
        this.dispatchEvent(Event.STATUS_CHANGED);
        this._onStateChanged_();
    }

    /**
     * 再次传入属性值，更新状态
     * @param options
     */
    update(options) {
        super.update(options);
        // 强制重绘
        this.postChange('update');
    }

    /**
     * 清除“已改变”状态
     */
    clearChange() {
        this._changed_ = false;
    }

    /**
     * 是否已改变
     * @returns {boolean|*|DisplayObject._changed_}
     */
    get isChanged() {
        return this._changed_;
    }

    //********************************** 重绘事件 ***************************************

    /**
     * 重绘方法，需要被实现
     */
    paint() {
    }

    /**
     * 绘制前处理
     */
    _onBeforePaint_() {
    }

    /**
     * 绘制后处理
     */
    _onAfterPaint_() {
    }

    /**
     * 完整绘制方法，此方法会被主循环调用
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
        if (point === undefined) return undefined;
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

        // this.logger.debug(`[${this.clazzName}]:getOuterPos()`, point, pos);

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

        // this.logger.debug(`[${this.clazzName}]:getInnerPos`, point, p);

        return p;
    }

    /**
     * 获得层坐标，用于检测层内投影碰撞，原名为 getGlobalPos
     *
     * @param localPos {Point|{x:*, y:*}} 内部坐标
     * @param digits {number} 精度
     * @returns {Point} 坐标
     */
    // getLayerPos(localPos, digits = 0) {
    //     let pos = this.getOuterPos(localPos, digits);
    //     let parent = this.parent;
    //
    //     // parent.layer == parent 意味着是最顶级了
    //     while (parent && parent.layer !== parent) {
    //         // 因为孩子的坐标是从origin点开始计算的，所以要先补偿origin的坐标
    //         let o = parent.origin;
    //         pos = parent.getOuterPos(pos.move(o.x, o.y), digits);
    //         parent = parent.parent;
    //     }
    //     return pos;
    // }

    getLayerPos(localPos = {x: 0, y: 0}, digits = 0) {
        let pos = this.getOuterPos({x: localPos.x + this.origin.x, y: localPos.y + this.origin.y}, digits);

        if (this.parent && !this.parent.isLayer) {
            pos = this.parent.getLayerPos(pos, digits);
        }
        return pos;
    }

    /**
     * 获得舞台坐标
     * @param localPos {Point|{x:number,y:number}} 内部坐标
     * @param digits number 精度
     * @returns {Point} 坐标
     */
    getStagePos(localPos = {x: 0, y: 0}, digits = 0) {
        let pos = this.getOuterPos({x: localPos.x + this.origin.x, y: localPos.y + this.origin.y}, digits);
        if (this.parent && !this.parent.isStage) {
            pos = this.parent.getStagePos(pos, digits);
        }
        return pos;
    }

    getStageRotation() {
        let rotation = this.rotation;
        if (this.parent && !this.parent.isStage)
            rotation += this.parent.getStageRotation();
        return rotation % 360;
    }

    getStageOrigin() {
        let origin = this.origin;

        if (this.parent && !this.parent.isStage) {
            let parentStageOrigin = this.parent.getStageOrigin();
            origin = {x: origin.x + parentStageOrigin.x, y: origin.y + parentStageOrigin.y};
        }
        return origin;
    }

    getStageScale() {
        let scale = this.scale;

        if (this.parent && !this.parent.isStage) {
            let parentStageScale = this.parent.getStageScale();
            scale = {x: scale.x * parentStageScale.x, y: scale.y * parentStageScale.y};
        }
        return scale;
    }


    /**
     * 获得本地坐标
     *
     * @param globalPos {Point} 全局坐标
     * @param digits {number} 精度
     * @returns {Point}
     */
    getLocalPos(globalPos, digits = 0) {

        // 寻找全部祖先
        let ancestor = [];
        let parent = this.parent;

        // parent.layer == parent 意味着是最顶级了
        while (parent && parent.layer !== parent) {
            ancestor.unshift(parent);
            parent = parent.parent;
        }

        // 遍历全部祖先，分级转换为相对坐标
        let pos = globalPos;
        for (let i = 0; i < ancestor.length; i++) {
            pos = ancestor[i].getInnerPos(pos);
            // 因为孩子的坐标是从origin点开始计算的，所以要先偏移origin的坐标
            let o = ancestor[i].origin;
            pos = pos.move(-o.x, -o.y);
        }

        // 最后转换自己的相对坐标
        return this.getInnerPos(pos, digits);
    }

    //********************************** 宿主 ***************************************

    get isStage() {
        return this._stage_ === this;
    }

    get isLayer() {
        return this._layer_ === this;
    }

    set parent(v) {
        if (this.parent === v) return;
        this._parent_ = v;
        this._onAppendToParent_();
    }

    get parent() {
        return this._parent_;
    }

    _onAppendToParent_() {
        if (!this.parent) return;
        this.dispatchEvent(Event.APPEND_TO_PARENT);
        this.postChange("AppendToParent");
        this._onAppendToLayer_();
        this._onAppendToStage_();
    }

    get stage() {
        if (!this._stage_) {
            // 通过 parent 的 get 方法向上遍历
            if (this.parent) this._stage_ = this.parent.stage;
        }
        return this._stage_;
    }

    set stage(v) {
        if (this.stage === v) return;
        this._stage_ = v;
    }

    _onAppendToStage_() {
        if (!this._stage_ && this.stage && this.stage !== this) {
            this.dispatchEvent(Event.APPEND_TO_STAGE);
            this.postChange("AppendToStage");
        }
    }

    get layer() {
        if (!this._layer_) {
            // 通过 parent 的 get 方法向上遍历
            if (this.parent) this._layer_ = this.parent.layer;
        }
        return this._layer_;
    }

    /**
     * 设置 Layer
     * @param v {*}
     */
    set layer(v) {
        if (this.layer === v) return;
        this._layer_ = v;
    }

    _onAppendToLayer_() {
        if (!this._layer_ && this.layer && this.layer !== this) {
            this.dispatchEvent(Event.APPEND_TO_LAYER);
            this.postChange("AppendToLayer");
        }
    }
}
