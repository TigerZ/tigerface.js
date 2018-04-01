import { Utilities as T, Logger } from 'tigerface-common';
import { Graphics } from 'tigerface-graphic';
import DomLayer from './DomLayer';


/**
 * Canvas 层
 *
 * @extends DomLayer
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class CanvasLayer extends DomLayer {
    static logger = Logger.getLogger(CanvasLayer.name);

    /**
     * @param options {object} 选项
     * @param dom {object} Dom
     */
    constructor(options = undefined, dom = undefined) {
        const props = {
            clazzName: CanvasLayer.name,
            width: '320',
            height: '240',
            devicePixelRatio: 1,
            retina: true,
            noClear: false,
            useDirtyRect: false,
            redrawAsNeeded: true,
            useOffScreenCanvas: false,
        };

        const canvas = dom || document.createElement('canvas');
        // 调用 DisplayObject 的构造器

        super(props, canvas);

        this.assign(T.merge({
            style: {
                // backgroundColor: 'rgba(255,255,255,0.3)',
            },
        }, options));

        this.canvas = canvas;

        this._graphics_ = new Graphics(this.canvas);
        this._setGraphicsBefore_(this._graphics_);

        // 下层显示对象通过此属性识别是否是上层 CanvasContainer 对象
        this._layer_ = this;

        this._pause_ = false;

        if (this.useOffScreenCanvas) {
            this._offScreenCanvas_ = document.createElement('canvas');
            this._offScreenCanvas_.width = this.canvas.width;
            this._offScreenCanvas_.height = this.canvas.height;
            this._offScreenGraphics_ = new Graphics(this._offScreenCanvas_);
            this._setGraphicsBefore_(this._offScreenGraphics_);
        }
    }

    set retina(v) {
        this.props.retina = v;
        if (v) {
            this.devicePixelRatio = window.devicePixelRatio || 1;
        } else {
            this.devicePixelRatio = 1;
        }
        this._onSizeChanged_();
    }

    get retina() {
        return this.props.retina;
    }

    set noClear(v) {
        this.props.noClear = v;
    }

    get noClear() {
        return this.props.noClear;
    }

    set useDirtyRect(v) {
        this.props.useDirtyRect = v;
    }

    get useDirtyRect() {
        return this.props.useDirtyRect;
    }

    set redrawAsNeeded(v) {
        this.props.redrawAsNeeded = v;
    }

    get redrawAsNeeded() {
        return this.props.redrawAsNeeded;
    }

    set useOffScreenCanvas(v) {
        this.props.useOffScreenCanvas = v;
    }

    get useOffScreenCanvas() {
        return this.props.useOffScreenCanvas;
    }

    _setGraphicsBefore_(v) {
        v.addBefore(() => {
            if (this.devicePixelRatio !== undefined && this.devicePixelRatio !== 1) {
                v.scale(this.devicePixelRatio, this.devicePixelRatio);
            }
            v.globalAlpha = this.alpha;
        });
    }

    /**
     * 设置 Dom 的大小
     * @package
     */
    _onSizeChanged_() {
        // retina 属性设置为 true，效果是：尺寸指定为 devicePixelRatio 倍，再用 css 缩至原始尺寸
        T.attr(this.dom, 'width', `${this.width * this.devicePixelRatio}px`);
        T.attr(this.dom, 'height', `${this.height * this.devicePixelRatio}px`);

        // 用 css 约束尺寸
        T.css(this.dom, 'width', `${this.width}px`);
        T.css(this.dom, 'height', `${this.height}px`);

        this.postChange();
    }

    /**
     * 添加子节点
     * @param child {DisplayObject}
     */
    addChild(child) {
        super.addChild(child);
        child._appendToLayer_(this);
        return this;
    }

    _onBeforeAddChild_(child) {
        if (child.isDomSprite) {
            this.logger.error('添加失败，CanvasLayer 上不能放置 DomSprite 的实例');
            return false;
        }
        return true;
    }

    /**
     * 空方法，为了抵消 DomSprite 的同名方法
     * @param child {DisplayObject}
     */
    // eslint-disable-next-line no-unused-vars
    _onAddChild_(child) {
    }

    /**
     * 绘制画布自身前的处理：缩放，设置透明度
     * @package
     */
    _onBeforePaint_(g) {
        g.before();
    }

    /**
     * 绘制画布自身后的处理：绘制子对象
     * @package
     */
    _onAfterPaint_(g) {
        g.save();
        // 绘制顺序为后绘制的在上层
        g.globalCompositeOperation = 'source-over';

        // 遍历孩子，顺序与globalCompositeOperation的设置要匹配，这里的效果是后添加的在上面
        this.children.forEach((child) => {
            // 子元件可见才绘制
            if (child.visible) {
                // 孩子会坐标转换、缩放及旋转，所以先保存上下文
                g.save();
                // 每个孩子的位置，由上层决定。孩子自己只知道从自己的originX, originY, 开始相对坐标即可
                g.translate(child.x, child.y);
                // 孩子的透明度
                child.realAlpha = this.alpha * child.alpha;
                g.globalAlpha = child.realAlpha;
                // 调用孩子绘制方法
                child._paint_(g);
                // 恢复上下文
                g.restore();
            }
        });

        g.restore();
        g.after();
    }

    stop() {
        this._pause_ = true;
    }

    run() {
        this._pause_ = false;
    }

    /**
     * 通用绘制方法，绘制前判断是否改变
     * @package
     */
    _paint_() {
        const g = this._graphics_;
        if (!this._pause_ && (!this.redrawAsNeeded || this.isChanged)) {
            if (!this._painting_) {
                this._painting_ = true;
                CanvasLayer.logger.debug('开始重绘');
            }
            const start = +new Date();

            g.clearRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.useOffScreenCanvas) {
                this._offScreenGraphics_.clearRect(0, 0, this._offScreenCanvas_.width, this._offScreenCanvas_.height);
                super._paint_(this._offScreenGraphics_);
                g.drawImage(this._offScreenCanvas_, 0, 0);
            } else {
                super._paint_(g);
            }


            const time = +new Date() - start;
            if (time > 16 && time > (this._paint_time_ || 0)) {
                this._paint_time_ = time;
                this.logger.warn(`耗时警告：最长重绘耗时为：${time} 毫秒，超过 16 毫秒，帧数将少于 60 帧`);
            }
        } else if (this._painting_) {
            this._painting_ = false;
            CanvasLayer.logger.debug('已停止重绘');
        }
    }
}

export default CanvasLayer;
