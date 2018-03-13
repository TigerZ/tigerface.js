/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:24.
 */

import {Utilities as T, Logger} from 'tigerface-common';
import {Rectangle, Polygon} from 'tigerface-shape';
import Sprite from './Sprite';
import {Event} from 'tigerface-event';
import {Graphics} from 'tigerface-graphic';

/********************************************************************************************************
 *
 * Context2DSprite 是画布内显示对象类，是 0.6.X 版本中的 Sprite
 *
 *******************************************************************************************************/

export default class CanvasSprite extends Sprite {
    static logger = Logger.getLogger(CanvasSprite.logger);

    /**
     * 初始化
     *
     * @param options 选项
     */
    constructor(options) {

        let props = {
            className: CanvasSprite.name,
            pos: {x: 0, y: 0},
            size: {width: 100, height: 100},
            scale: {scaleX: 1, scaleY: 1},
            isCanvasSprite: true
        };

        super(props);

        this.assign(options);
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
     * CanvasLayer 收到 Canvas Dom 的 MOUSE_MOVE 事件，
     * 将坐标转换为 Canvas 的内部坐标后，遍历全部内部 Context2DSprint 对象，调用此方法。
     * @param pos
     * @param digits
     * @private
     */
    _onLayerMouseMove_(pos, digits) {
        // 把全局坐标，转化为本级坐标
        let mouse = this.getLocalPos(pos, digits);

        // 记录之前的状态，用来判断是否第一次进入
        let before = this._mouseInside_;
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
        let mouse = this.getMousePos();
        if (this._mouseInside_) {
            this.dispatchEvent(eventName, {pos: mouse});
        }
    }

    /**
     * 通过向上层对象的递归，找到 CanvasLayer 对象的实例
     * @returns {CanvasLayer}
     */
    getLayer() {
        if (!this.layer) {
            let ancestors = [];
            let parent = this.parent;
            while (parent) {
                // 直到找到个知道stage的上级
                if (parent.layer) {
                    this.layer = parent.layer;
                    // 顺便把stage赋给全部没定义stage的上级
                    for (let i = 0; i < ancestors.length; i++) {
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
     * @private
     */
    _onBeforePaint_() {
        let g = this.graphics;
        // 缩放
        if (this.scaleX !== 1 || this.scaleY !== 1)
            g.scale(this.scaleX, this.scaleY);

        // 旋转
        g.rotate(T.degreeToRadian(this.rotation % 360));

        // 平移坐标系至原点
        g.translate(-this.originX, -this.originY);

        g.globalCompositeOperation = "source-over";
    }

    /**
     * 绘制自身后处理：还原原点平移，绘制子对象
     * @private
     */
    _onAfterPaint_() {
        let g = this.graphics;
        g.save();
        // 还原原点平移
        g.translate(this.originX, this.originY);
        // 绘制顺序为后绘制的在上层
        g.globalCompositeOperation = "source-over";

        // 遍历孩子，顺序与globalCompositeOperation的设置要匹配，这是的效果是后添加的在上面
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            // 子元件可见才绘制
            if (child.visible) {
                // 孩子会坐标转换、缩放及旋转，所以先保存上下文
                g.save();
                // 每个孩子的位置，由上层决定。孩子自己只知道从自己的originX, originY, 开始相对坐标即可
                g.translate(child.x, child.y);
                // 孩子的透明度
                child._realAlpha_ = this._realAlpha_ ? this._realAlpha_ * child.alpha : this.alpha * child.alpha;
                g.globalAlpha = child._realAlpha_;
                // 调用孩子绘制方法
                child._paint_();
                // 恢复上下文
                g.restore();
            }
        }

        g.restore();
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
        let shadow = new CanvasSprite();
        // 通过感应区的外边框的坐标变换，来计算投影的旋转和缩放
        for (let i = 0; i < this.bounds.length; i++) {
            let bound = this.bounds[i];
            shadow.addBound(this._shapeToGlobal_(bound));
        }
        return shadow;
    }

    _onAddChild_(child) {
        super._onAddChild_(child);
        child._onAppendToLayer_();
    }

    _shapeToGlobal_(shape) {
        let vertexes = shape.getVertexes();
        let points = [];
        for (let i = 0; i < vertexes.length; i++) {
            points.push(this.getGlobalPos(vertexes[i]));
        }
        //console.log("_shapeToGlobal_", shape, new Rectangle(points), new Polygon(points));
        if (Rectangle.isRectangle(points)) {
            return new Rectangle(points);
        }
        return new Polygon(points);
    }

    _shapeToOuter_(shape) {
        let vertexes = shape.getVertexes();
        let points = [];
        for (let i = 0; i < vertexes.length; i++) {
            points.push(this.getOuterPos(vertexes[i]));
        }
        return new Polygon(points);
    }

    /**
     * 获得全局坐标
     *
     * @param localPos {Point} 内部坐标
     * @param digits {number} 精度
     * @returns {Point}
     */
    getGlobalPos(localPos, digits = 0) {
        let pos = this.getOuterPos(localPos, digits);
        let parent = this.parent;

        // parent.layer == parent 意味着是最顶级了
        while (parent && parent.layer !== parent) {
            // 因为孩子的坐标是从origin点开始计算的，所以要先补偿origin的坐标
            let o = parent.origin;
            pos = parent.getOuterPos(pos.move(o.x, o.y), digits);
            parent = parent.parent;
        }
        //console.log("getGlobalPos", localPos, pos);
        return pos;
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
            if (this._bounds_.length === 0) {
                return true;
            }
            for (let i = 0; i < this.bounds.length; i++) {
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
        let a = this.mirror();
        let b = target.mirror();

        if (a.boundingRect.hitTestRectangle(b.boundingRect)) {
            for (let i = 0; i < a.bounds.length; i++) {
                let shape1 = a.bounds[i];
                for (let j = 0; j < b.bounds.length; j++) {
                    let shape2 = b.bounds[j];
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
        let g = new Graphics();
        let size = this.size;
        let scale = this.scale;
        g.canvas.width = width || Math.ceil(size.width / scale.x);
        g.canvas.height = height || Math.ceil(size.height / scale.y);
        return g;
    }

    getOffScreenContext(width, height) {
        if (!this._offScreenContext_) {
            this._offScreenContext_ = this._createOffScreenContext_(width, height);
        }
        return this._offScreenContext_;
    }


}
