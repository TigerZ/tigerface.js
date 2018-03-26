import { Utilities as T, Logger } from 'tigerface-common';
import { Rectangle, Polygon } from 'tigerface-shape';
import { Event } from 'tigerface-event';
import { Graphics } from 'tigerface-graphic';
import Sprite from './Sprite';
import DomCover from './DomCover';

/**
 * 在 Canvas 上绘制的 Sprite
 * @extends Sprite
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class CanvasSprite extends Sprite {
    static logger = Logger.getLogger(CanvasSprite.logger);

    /**
     * 初始化
     *
     * @param options 选项
     */
    constructor(options = undefined) {
        const props = {
            clazzName: CanvasSprite.name,
            pos: { x: 0, y: 0 },
            size: { width: 100, height: 100 },
            scale: { scaleX: 1, scaleY: 1 },
            isCanvasSprite: true,
        };

        super(props);

        this.assign(options);
    }

    initCover(dom) {
        if (!this._cover_) {
            this._cover_ = new DomCover({
                style: { background: 'rgba(0,0,0,0.5)' },
                pos: { x: 0, y: 0 },
                title: 'cover',
            }, dom);

            this.resetCover();

            if (this.stage) {
                this.stage._addCover_(this._cover_);
                this.resetCover();
            }

            this.on(Event.APPEND_TO_STAGE, () => {
                this.stage._addCover_(this._cover_);
                this.resetCover();
            });
        }
    }

    resetCover() {
        if (!this._cover_ || !this._cover_.visible) return;
        const props = this.getBoundRectShadow();
        this.logger.debug('resetCover', props);
        this._cover_.assign(props);
        this.logger.debug('重置封面Dom');
    }

    showCover() {
        this.stage.showCover(this.cover);
        this.resetCover();
        this.cover.dom.focus();
    }

    hideCover() {
        this.stage.hideCover(this.cover);
    }

    _onStateChanged_() {
        super._onStateChanged_();
        this.resetCover();
    }

    get cover() {
        return this._cover_;
    }

    /**
     * 绘制自身前处理：缩放，旋转，平移原点
     * @package
     */
    _onBeforePaint_() {
        const g = this.graphics;
        // 缩放
        if (this.scaleX !== 1 || this.scaleY !== 1) {
            g.scale(this.scaleX, this.scaleY);
        }

        // 旋转
        g.rotate(T.degreeToRadian(this.rotation % 360));

        // 平移坐标系至原点
        g.translate(-this.originX, -this.originY);

        g.globalCompositeOperation = 'source-over';
    }

    /**
     * 绘制自身后处理：还原原点平移，绘制子对象
     * @package
     */
    _onAfterPaint_() {
        const g = this.graphics;
        g.save();
        // 还原原点平移
        g.translate(this.originX, this.originY);
        // 绘制顺序为后绘制的在上层
        g.globalCompositeOperation = 'source-over';

        // 遍历孩子，顺序与globalCompositeOperation的设置要匹配，这是的效果是后添加的在上面
        for (let i = 0; i < this.children.length; i += 1) {
            const child = this.children[i];
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

    /** *************************************************************************
     *
     * 坐标转换
     *
     ************************************************************************* */

    /**
     * 将感应区投影到全局坐标系
     */
    mirror() {
        const shadow = new CanvasSprite();
        // 通过感应区的外边框的坐标变换，来计算投影的旋转和缩放
        for (let i = 0; i < this.bounds.length; i += 1) {
            const bound = this.bounds[i];
            shadow.addBound(this._shapeToLayer_(bound));
        }
        return shadow;
    }

    _onAddChild_(child) {
        super._onAddChild_(child);
    }

    _shapeToLayer_(shape) {
        const vertexes = shape.getVertexes();
        const points = [];
        for (let i = 0; i < vertexes.length; i += 1) {
            points.push(this.getLayerPos(vertexes[i]));
        }
        // console.log("_shapeToLayer_", shape, new Rectangle(points), new Polygon(points));
        if (Rectangle.isRectangle(points)) {
            return new Rectangle(points);
        }
        return new Polygon(points);
    }

    _shapeToOuter_(shape) {
        const vertexes = shape.getVertexes();
        const points = [];
        for (let i = 0; i < vertexes.length; i += 1) {
            points.push(this.getOuterPos(vertexes[i]));
        }
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
                        // console.log("hit", i, j);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /** *************************************************************************
     *
     * 离线画布
     *
     ************************************************************************* */

    _createOffScreenContext_(width, height) {
        const g = new Graphics();
        g.canvas.width = width || Math.ceil(this.size.width / this.scale.x);
        g.canvas.height = height || Math.ceil(this.size.height / this.scale.y);
        return g;
    }

    getOffScreenContext(width, height) {
        if (!this._offScreenContext_) {
            this._offScreenContext_ = this._createOffScreenContext_(width, height);
        }
        return this._offScreenContext_;
    }
}

export default CanvasSprite;
