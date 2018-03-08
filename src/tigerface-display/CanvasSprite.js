/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:24.
 */

import {Utilities as T, Logger} from 'tigerface-common';
import {Rectangle, Polygon} from 'tigerface-shape';
import Sprite from './Sprite';
import {Event, DomEventAdapter} from 'tigerface-event';
import {Point} from "../tigerface-shape";
import DomSprite from "./DomSprite";

/********************************************************************************************************
 *
 * Context2DSprite 是画布内显示对象类，是 0.6.X 版本中的 Sprite
 *
 *******************************************************************************************************/

export default class CanvasSprite extends Sprite {

    /**
     * 初始化舞台
     *
     * @param wrapper Dom节点
     * @param options 选项
     */
    constructor(options) {

        let state = Object.assign({
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            scaleX: 1,
            scaleY: 1
        }, options);

        super(state);

        // 基本信息
        this.className = "CanvasSprite";

    }

    _onAppendToLayer_() {
        this.getLayer();
        if (this.layer) {
            this.dispatchEvent(Event.APPEND_TO_LAYER);
            this.postChange("AppendToLayer");
        }
    }

    isContext2DSprite() {
        return true;
    }

    postChange(log) {
        super.postChange(log);

        // 继续向上层传播
        if (this.getLayer()) {
            this.getLayer().postChange("ChildChanged");
        }
    }

    /**
     * 转换 Canvas 的鼠标坐标，为内部坐标，然后判断是否在本对象的范围内，根据判断结果，发送内部 MOUSE_OVER MOUSE_OUT MOUSE_MOVE事件。
     * CanvasContainer 收到 Canvas Dom 的 MOUSE_MOVE 事件，
     * 将坐标转换为 Canvas 的内部坐标后，遍历全部内部 Context2DSprint 对象，调用此方法。
     * @param pos
     * @param digits
     * @private
     */
    _onLayerMouseMove_(pos, digits) {
        // 把全局坐标，转化为本级坐标
        var mouse = this.getLocalPos(pos, digits);

        // 记录之前的状态，用来判断是否第一次进入
        var before = this._mouseInside_;
        // 根据边界形状，判断鼠标是否在本对象范围内
        this._mouseInside_ = this._pointInBounds_(mouse);

        if (this._mouseInside_) {
            // 当前鼠标在范围内
            if (!before) {
                // 如果之前不在范围内，发送鼠标进入事件
                this.dispatchEvent(Event.MouseEvent.MOUSE_OVER);
            }
            // 发送鼠标移动事件
            this.dispatchEvent(Event.MouseEvent.MOUSE_MOVE, {pos: mouse});
        } else {
            // 当前鼠标不在范围内
            if (before) {
                // 如果之前在范围内，发送鼠标移出事件
                this.dispatchEvent(Event.MouseEvent.MOUSE_OUT);
            }
        }
    }

    _onLayerMouseEvents_(eventName) {
        var mouse = this.getMousePos();
        if (this._mouseInside_) {
            this.dispatchEvent(eventName, {pos: mouse});
        }
    }

    /**
     * 通过向上层对象的递归，找到 CanvasContainer 对象的实例
     * @returns {layer|*|CanvasContainer.layer}
     */
    getLayer() {
        if (!this.layer) {
            var ancestors = [];
            var parent = this.parent;
            while (parent) {
                // 直到找到个知道stage的上级
                if (parent.layer) {
                    this.layer = parent.layer;
                    // 顺便把stage赋给全部没定义stage的上级
                    for (var i = 0; i < ancestors.length; i++) {
                        ancestors[i].layer = this.layer;
                    }
                    break;
                } else {
                    ancestors.push(parent);
                }
                parent = parent.parent;
            }
        }
        return this.layer;
    }

    /**
     * 绘制自身前处理：缩放，旋转，平移原点
     * @param ctx
     * @private
     */
    _onBeforePaint_(ctx) {
        // 缩放
        if (this.scaleX != 1 || this.scaleY != 1)
            ctx.scale(this.scaleX, this.scaleY);

        // 旋转
        ctx.rotate(T.degreeToRadian(this.rotation % 360));

        // 平移坐标系至原点
        ctx.translate(-this.originX, -this.originY);

        ctx.globalCompositeOperation = "source-over";
    }

    /**
     * 绘制自身后处理：还原原点平移，绘制子对象
     * @param ctx
     * @private
     */
    _onAfterPaint_(ctx) {
        ctx.save();
        // 还原原点平移
        ctx.translate(this.originX, this.originY);
        // 绘制顺序为后绘制的在上层
        ctx.globalCompositeOperation = "source-over";

        // 遍历孩子，顺序与globalCompositeOperation的设置要匹配，这是的效果是后添加的在上面
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            // 子元件可见才绘制
            if (child._visible_) {
                // 孩子会坐标转换、缩放及旋转，所以先保存上下文
                ctx.save();
                // 每个孩子的位置，由上层决定。孩子自己只知道从自己的originX, originY, 开始相对坐标即可
                ctx.translate(child.x, child.y);
                // 孩子的透明度
                child._realAlpha_ = this._realAlpha_ ? this._realAlpha_ * child.alpha : this.alpha * child.alpha;
                ctx.globalAlpha = child._realAlpha_;
                // 调用孩子绘制方法
                child._paint_(ctx);
                // 恢复上下文
                ctx.restore();
            }
        }

        ctx.restore();
    }

    /***************************************************************************
     *
     * 坐标转换
     *
     **************************************************************************/

    /**
     * 将感应区投影到全局坐标系
     */
    mirror() {
        var shadow = new Context2DSprite();
        // 通过感应区的外边框的坐标变换，来计算投影的旋转和缩放
        for (var i = 0; i < this.bounds.length; i++) {
            var bound = this.bounds[i];
            shadow.addBound(this._shapeToGlobal_(bound));
        }
        return shadow;
    }

    _onAddChild_(child) {
        super._onAddChild_(child);
        child._onAppendToLayer_();
    }

    _shapeToGlobal_(shape) {
        var vertexes = shape.getVertexes();
        var points = [];
        for (var i = 0; i < vertexes.length; i++) {
            points.push(this.getGlobalPos(vertexes[i]));
        }
        //console.log("_shapeToGlobal_", shape, new Rectangle(points), new Polygon(points));
        if (Rectangle.isRectangle(points)) {
            return new Rectangle(points);
        }
        return new Polygon(points);
    }

    _shapeToOuter_(shape) {
        var vertexes = shape.getVertexes();
        var points = [];
        for (var i = 0; i < vertexes.length; i++) {
            points.push(this.getOuterPos(vertexes[i]));
        }
        return new Polygon(points);
    }

    /**
     * 获得全局坐标
     *
     * @param localPos 内部坐标
     * @returns {Point}
     */
    getGlobalPos(localPos, digits) {
        var pos = this.getOuterPos(localPos, digits);
        var parent = this.parent;

        // parent.layer == parent 意味着是最顶级了
        while (parent && parent.layer !== parent) {
            // 因为孩子的坐标是从origin点开始计算的，所以要先补偿origin的坐标
            var o = parent.origin;
            pos = parent.getOuterPos(pos.move(o.x, o.y), digits);
            parent = parent.parent;
        }
        //console.log("getGlobalPos", localPos, pos);
        return pos;
    }

    /**
     * 获得本地坐标
     *
     * @param globalPos 全局坐标
     * @returns {Point}
     */
    getLocalPos(globalPos, digits) {

        // 寻找全部祖先
        var ancestor = [];
        var parent = this.parent;

        // parent.layer == parent 意味着是最顶级了
        while (parent && parent.layer !== parent) {
            ancestor.unshift(parent);
            parent = parent.parent;
        }

        // 遍历全部祖先，分级转换为相对坐标
        var pos = globalPos;
        for (var i = 0; i < ancestor.length; i++) {
            pos = ancestor[i].getInnerPos(pos);
            // 因为孩子的坐标是从origin点开始计算的，所以要先偏移origin的坐标
            var o = ancestor[i].origin;
            pos = pos.move(-o.x, -o.y);
        }

        // 最后转换自己的相对坐标
        return this.getInnerPos(pos, digits);
    }

    /***************************************************************************
     *
     * 碰撞
     *
     **************************************************************************/

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
            if (this._bounds_.length == 0) {
                return true;
            }
            for (var i = 0; i < this.bounds.length; i++) {
                if (this.bounds[i].hitTestPoint(point)) {
                    return true;
                }
            }
        }
        return false;
    }

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
        var a = this.mirror();
        var b = target.mirror();

        if (a.boundingRect.hitTestRectangle(b.boundingRect)) {
            for (var i = 0; i < a.bounds.length; i++) {
                var shape1 = a.bounds[i];
                for (var j = 0; j < b.bounds.length; j++) {
                    var shape2 = b.bounds[j];
                    if (shape1.hitTestPolygon(shape2)) {
                        //console.log("hit", i, j);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /***************************************************************************
     *
     * 离线画布
     *
     **************************************************************************/

    _createOffScreenContext_(width, height) {
        var ctx = document.createElement("canvas").getContext("2d");
        var size = this.size;
        var scale = this.scale;
        ctx.canvas.width = width || Math.ceil(size.width / scale.x);
        ctx.canvas.height = height || Math.ceil(size.height / scale.y);
        return ctx;
    }

    getOffScreenContext(width, height) {
        if (!this._offScreenContext_) {
            this._offScreenContext_ = this._createOffScreenContext_(width, height);
        }
        return this._offScreenContext_;
    }


}
