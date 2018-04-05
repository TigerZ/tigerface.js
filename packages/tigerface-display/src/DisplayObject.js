/* eslint-disable class-methods-use-this */
import { EventDispatcher, Event } from 'tigerface-event';
import { Utilities as T, Logger } from 'tigerface-common';
import { Point } from 'tigerface-shape';

/**
 * DisplayObject 是最底层显示对象，是其他现实对象的超类。
 * **职责**：
 * * 定义显示相关基本属性，比如：坐标、尺寸、原点、缩放、旋转、透明度 ...
 * * 实现 setState 和 postChange 机制
 * * 由 _paint_ 主绘制方法串起来的 paint 方法组，子类通过覆盖各阶段方法实现多态，应用类仅实现 paint 方法
 * * 基本的内外部坐标转换方法：getOuterPos 和 getInnerPos
 *
 * @extends module:tigerface-event.EventDispatcher
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class DisplayObject extends EventDispatcher {
    // 静态日志
    static logger = Logger.getLogger(DisplayObject.name);

    /**
     * @param [options] {object} 可选初始属性，属性缺省值
     * ```
     *  {
     *      pos: {x: 0, y: 0},
     *      size: {width: 320, height: 240},
     *      scale: {x: 1, y: 1},
     *      origin: {x: 0, y: 0},
     *      alpha: 1,
     *      rotation: 0,
     *      visible: true
     *  }
     * ```
     */
    constructor(options) {
        const props = {
            clazzName: DisplayObject.name,
        };

        super(props);

        // 基本状态属性
        this.state = {
            pos: { x: 0, y: 0 },
            size: { width: 1, height: 1 },
            scale: { x: 1, y: 1 },
            origin: { x: 0, y: 0 },
            alpha: 1,
            rotation: 0,
            visible: true,
        };
        this.assign(options);

        // 设置传入的初始值
        this.assign(options);

        this.uuid = T.uuid();

        // 宿主信息
        this._parent_ = undefined;
        this._layer_ = undefined;
        this._stage_ = undefined;
    }

    //* ********************************** 坐标 **************************************

    /**
     * X 轴位置坐标
     * @member {number}
     */
    set x(x) {
        this.pos = { x };
    }

    get x() {
        return this.pos.x;
    }

    /**
     * Y 轴位置坐标
     * @member {number}
     */
    set y(y) {
        this.pos = { y };
    }

    get y() {
        return this.pos.y;
    }

    /**
     * 坐标
     * @member {(module:tigerface-shape.Point|{x: number, y: number})}
     */
    set pos(pos) {
        if (T.assignEqual(this.pos, pos)) return;
        Object.assign(this.state.pos, pos);
        this.postChange('pos', this.pos);
        this._onPosChanged_();
    }

    get pos() {
        return this.state.pos;
    }

    /**
     * 位置改变的处理
     * @package
     */
    _onPosChanged_() {
    }

    //* ********************************** 缩放 **************************************

    /**
     * X 轴缩放
     * @member {number}
     */
    set scaleX(x) {
        this.scale = { x };
    }

    get scaleX() {
        return this.scale.x;
    }

    /**
     * Y 轴缩放
     * @member {number}
     */
    set scaleY(y) {
        this.scale = { y };
    }

    get scaleY() {
        return this.scale.y;
    }

    /**
     * 缩放
     * @member {{x:number,y:number}}
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

    /**
     * 缩放改变的处理
     * @package
     */
    _onScaleChanged_() {
    }

    //* ********************************** 透明度 **************************************

    /**
     * 透明度 (0-1)
     * @member {number}
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

    /**
     * 透明度改变的处理
     * @package
     */
    _onAlphaChanged_() {
    }

    //* ********************************* 旋转 ***************************************

    /**
     * 旋转角度 (0-360)
     * @member {number}
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

    /**
     * 旋转角度改变的处理
     * @package
     */
    _onRotationChanged_() {
    }

    //* ********************************** 可见 **************************************

    set visible(visible) {
        if (T.assignEqual(this.visible, visible)) return;
        this.state.visible = visible;
        this._onVisibleChanged_();
        this.postChange('visible', this.visible);
    }

    /**
     * 可见性
     * @member {boolean}
     */
    get visible() {
        return this.state.visible;
    }

    /**
     * 可见性改变的处理
     * @package
     */
    _onVisibleChanged_() {
    }

    //* ********************************** 原点 **************************************

    /**
     * X 轴原点
     * @member {number}
     */
    set originX(x) {
        this.origin = { x };
    }

    get originX() {
        return this.origin.x;
    }

    /**
     * Y 轴原点
     * @member {number}
     */
    set originY(y) {
        this.origin = { y };
    }

    get originY() {
        return this.origin.y;
    }

    /**
     * 原点
     * @member {(module:tigerface-shape.Point|{x:number,y:number})}
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

    /**
     * 原点改变的处理
     * @package
     */
    _onOriginChanged_() {

    }

    //* ********************************* 大小 ***************************************

    /**
     * 宽度
     * @member {number}
     */
    set width(width) {
        this.size = { width };
    }

    get width() {
        return this.size.width;
    }

    /**
     * 高度
     * @member {number}
     */
    set height(height) {
        this.size = { height };
    }

    get height() {
        return this.size.height;
    }

    /**
     * 尺寸
     * @member {{width:*,height:*}}
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

    /**
     * 尺寸改变的处理
     * @package
     */
    _onSizeChanged_() {
    }

    /**
     * 画笔
     * @member {module:tigerface-graphic.Graphics}
     */
    get graphics() {
        return this._graphics_;
    }

    //* ********************************* 状态改变事件 ***************************************

    /**
     * 状态改变的处理
     * @package
     */
    _onStateChanged_() {
        if (this.layer) this.layer.involvedChange();
    }

    /**
     * 提交状态改变
     * @param [log] {...string} 状态改变原因
     */
    postChange(...log) {
        if (log.length && log[0]) this.logger.debug('状态改变', ...log);
        if (this.isChanged) return;
        this._changed_ = true;
        this.dispatchEvent(Event.STATE_CHANGED);
        this._onStateChanged_();
    }

    /**
     * 牵连状态改变
     * @param [log] {...string} 状态改变原因
     */
    involvedChange(...log) {
        if (log.length && log[0]) this.logger.debug('牵连状态改变', ...log);
        if (this.isChanged) return;
        this._changed_ = true;
        this._onInvolvedChange_();
    }

    _onInvolvedChange_() {
    }

    /**
     * 更新，再次读取可选初始属性
     * @param [options] {object} 可选初始属性
     */
    update(options) {
        super.update(options);
        // 强制重绘
        this.logger.debug('重新读取传入的参数，强制重绘', options);
        this.postChange('update');
    }

    /**
     * 清除状态改变
     */
    clearChange() {
        this._changed_ = false;
    }

    /**
     * 是否状态改变
     * @member {boolean}
     */
    get isChanged() {
        return this._changed_;
    }

    //* ********************************* 重绘事件 ***************************************

    /**
     * 重绘方法，需要被实现
     */
    paint() {
    }

    /**
     * 绘制前处理
     * @package
     */
    _onBeforePaint_() {
    }

    /**
     * 绘制后处理
     * @package
     */
    _onAfterPaint_() {
    }

    /**
     * 完整绘制方法，此方法会被主循环调用
     * @package
     */
    _paint_(g) {
        // 为最高效率，对象可见，才进入
        if (!this.visible) return;

        // 清除"状态已改变"标志
        this.clearChange();

        // 保存一次上下文
        if (g) g.save();

        // 先调用绘制前处理
        this._onBeforePaint_(g);
        this.dispatchEvent(Event.BEFORE_REDRAW, { target: this, graphics: g });

        // 保存二次上下文
        if (g) g.save();

        // 再调用自身绘制
        this.paint(g);
        this.dispatchEvent(Event.REDRAW, { target: this, graphics: g });

        // 最后调用绘制后处理
        this._onAfterPaint_(g);
        this.dispatchEvent(Event.AFTER_REDRAW, { target: this, graphics: g });

        // 恢复二次上下文
        if (g) g.restore();

        // 恢复一次上下文
        if (g) g.restore();
    }

    /**
     * 进入帧事件
     * @package
     */
    _onEnterFrame_() {
        this.emit(Event.ENTER_FRAME, { target: this });
    }

    /**
     * 计算外部坐标
     *
     * @param point {(module:tigerface-shape.Point|{x: number, y: number})} 内部坐标
     * @param [digits=0] {number} 结果小数位数（精确度）
     * @returns {module:tigerface-shape.Point} 外部坐标
     */
    getOuterPos(point, digits = 0) {
        const o = this.origin;
        const r = this.rotation;
        const s = this.scale;

        // 抵消原点 > 旋转 > 缩放 > 移动
        const pos = new Point(point).move(-o.x, -o.y)
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
     * 计算内部坐标
     *
     * @param point {module:tigerface-shape.Point} 外部坐标
     * @param [digits = 0] {number} 精度
     * @returns {module:tigerface-shape.Point} 内部坐标
     */
    getInnerPos(point, digits = 0) {

        const o = this.origin;
        const r = this.rotation;
        const s = this.scale;

        const pos = new Point(point).move(-this.x, -this.y) // 偏移本地位置
            .scale(1 / s.x, 1 / s.y) // 缩放
            .rotate(T.degreeToRadian(-r)) // 旋转
            .move(o.x, o.y); // 偏移原点

        // 除非指定小数位数，缺省取整
        pos.x = T.round(pos.x, digits > 0 ? digits : 0);
        pos.y = T.round(pos.y, digits > 0 ? digits : 0);

        // this.logger.debug(`[${this.clazzName}]:getInnerPos`, point, pos);

        return pos;
    }

    /**
     * 获得层坐标，用于检测层内投影碰撞，原名为 getGlobalPos
     *
     * @param localPos {(module:tigerface-shape.Point|{x:number, y:number})} 内部坐标
     * @param [digits = 0] {number} 精度
     * @returns {module:tigerface-shape.Point} 坐标
     */
    getLayerPos(localPos, digits = 0) {
        if (this.isLayer) {
            return localPos;
        }

        let pos = this.getOuterPos({ x: localPos.x + this.origin.x, y: localPos.y + this.origin.y }, digits);

        if (this.parent && !this.parent.isLayer) {
            pos = this.parent.getLayerPos(pos, digits);
        }
        return pos;
    }

    /**
     * 获得舞台投影的坐标
     * @param localPos {(module:tigerface-shape.Point|{x:number,y:number})} 内部坐标
     * @param [digits = 0] number 精度
     * @returns {module:tigerface-shape.Point} 坐标
     * @package
     */
    getStagePos(localPos = { x: 0, y: 0 }, digits = 0) {
        let pos = this.getOuterPos({ x: localPos.x + this.origin.x, y: localPos.y + this.origin.y }, digits);
        if (this.parent && !this.parent.isStage) {
            pos = this.parent.getStagePos(pos, digits);
        }
        return pos;
    }

    /**
     * 获得舞台投影的旋转角度
     * @return {number}
     * @package
     */
    _getStageRotation_() {
        if (this.parent && !this.parent.isStage) {
            return (this.rotation + this.parent._getStageRotation_()) % 360;
        }
        return this.rotation % 360;
    }

    /**
     * 获得舞台投影的原点
     * @return {*}
     * @package
     */
    _getStageOrigin_() {
        if (this.parent && !this.parent.isStage) {
            const parentStageOrigin = this.parent._getStageOrigin_();
            return { x: this.origin.x + parentStageOrigin.x, y: this.origin.y + parentStageOrigin.y };
        }
        return this.origin;
    }

    /**
     * 获得舞台投影的缩放
     * @return {{x:number,y:number}}
     * @package
     */
    _getStageScale_() {
        if (this.parent && !this.parent.isStage) {
            const parentStageScale = this.parent._getStageScale_();
            return { x: this.scale.x * parentStageScale.x, y: this.scale.y * parentStageScale.y };
        }
        return this.scale;
    }


    /**
     * 层坐标转换本地坐标
     *
     * @param layerPos {(module:tigerface-shape.Point|{x:number, y:number})} 层坐标
     * @param [digits = 0] {number} 精度
     * @returns {module:tigerface-shape.Point} 内部坐标
     */
    getLayerLocalPos(layerPos, digits = 0) {
        if (this.parent && !this.parent.isLayer) {
            const pos = this.getInnerPos(this.parent.getLayerLocalPos(layerPos, digits));
            // 因为孩子的坐标是从origin点开始计算的，所以要先偏移origin的坐标
            const o = this.parent.origin;
            return pos.move(-o.x, -o.y);
        }
        return this.getInnerPos(layerPos, digits);
    }

    /**
     * 舞台坐标转换内部坐标
     *
     * @param stagePos {(module:tigerface-shape.Point|{x:number, y:number})} 舞台坐标
     * @param [digits = 0] {number} 精度
     * @returns {module:tigerface-shape.Point} 内部坐标
     */
    getStageLocalPos(stagePos, digits = 0) {
        if (this.parent && !this.parent.isStage) {
            const pos = this.getInnerPos(this.parent.getStageLocalPos(stagePos, digits));
            // 因为孩子的坐标是从origin点开始计算的，所以要先偏移origin的坐标
            const o = this.parent.origin;
            return pos.move(-o.x, -o.y);
        }
        return this.getInnerPos(stagePos, digits);
    }

    /**
     * 是否是舞台
     * @member {boolean}
     */
    get isStage() {
        return this._stage_ === this;
    }

    /**
     * 是否是层
     * @member {boolean}
     */
    get isLayer() {
        return this._layer_ === this;
    }

    /**
     * 上级
     * @member {module:tigerface-display.DisplayObjectContainer}
     */
    set parent(v) {
        if (this.parent === v) return;
        this._parent_ = v;
        this._onAppendToParent_();
    }

    get parent() {
        return this._parent_;
    }

    /**
     * 添加至上级
     * @package
     */
    _onAppendToParent_() {
        if (!this.parent) return;
        this.dispatchEvent(Event.APPEND_TO_PARENT);
        this.postChange('AppendToParent');
        // eslint-disable-next-line no-unused-expressions
        this.layer;
        // eslint-disable-next-line no-unused-expressions
        this.stage;
    }

    /**
     * 舞台
     * @member {module:tigerface-display.Stage}
     */
    get stage() {
        if (!this._stage_) {
            // 通过 parent 的 get 方法向上遍历
            if (this.parent) this._appendToStage_(this.parent.stage);
        }
        return this._stage_;
    }

    /**
     * 添加至舞台
     * @package
     */
    _appendToStage_(stage) {
        // 只有第一次添加舞台，才会执行
        if (!stage || this._stage_) return;
        this._stage_ = stage;
        this.stage._register_(this);
        this.dispatchEvent(Event.APPEND_TO_STAGE);
        this.postChange('AppendToStage');
        this.logger.debug('添加至舞台');
    }

    get layer() {
        if (!this._layer_) {
            // 通过 parent 的 get 方法向上遍历
            if (this.parent) this._appendToLayer_(this.parent.layer);
        }
        return this._layer_;
    }

    /**
     * 添加至层
     * @package
     */
    _appendToLayer_(layer) {
        if (!layer || this._layer_) return;
        this._layer_ = layer;
        if (layer.graphics) this._graphics_ = layer.graphics;
        this.dispatchEvent(Event.APPEND_TO_LAYER);
        this.postChange('AppendToLayer');
        this.logger.debug('添加至层');
    }

    emit(...args) {
        if (this.visible) {
            super.emit(...args);
        }
    }

    _onParentSizeChanged() {
        if (this.props.precWidth) {
            const { precWidth } = this.props;
            this.width = (this.parent.width * precWidth) / 100;
        }
        if (this.props.precHeight) {
            const { precHeight } = this.props;
            this.height = (this.parent.height * precHeight) / 100;
        }
    }
}

export default DisplayObject;
