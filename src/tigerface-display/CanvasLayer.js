import {Utilities as T, Logger} from 'tigerface-common';
import DomSprite from './DomSprite';
import {Event} from 'tigerface-event';
import {Graphics} from 'tigerface-graphic';

/********************************************************************************************************
 *
 * Stage 是架构中显示对象的根容器，即舞台。
 * Stage 类在0.7版本后被简化，管理层的责任交给 DomContainer 和 CanvasContainer 处理。
 *
 *******************************************************************************************************/

export default class CanvasLayer extends DomSprite {
    static logger = Logger.getLogger(CanvasLayer.name);

    /**
     * 初始化舞台
     *
     * @param options {object} 选项
     * @param dom {object} Dom节点
     */
    constructor(options, dom = undefined) {
        let props = {
            clazz: CanvasLayer.name,
            devicePixelRatio: 1,
            width: 400,
            height: 300,
            retina: true,
            noClear: false,
            useDirtyRect: false,
            redrawAsNeeded: true,
            useOffScreenCanvas: false,
            style: {
                // backgroundColor: 'rgba(0,0,0,0.3)'
            }
        };

        let canvas = dom || document.createElement("canvas");
        // 调用 DisplayObject 的构造器

        super(props, canvas);

        this.canvas = canvas;

        this.graphics = new Graphics(this.canvas.getContext('2d'));

        // 下层显示对象通过此属性识别是否是上层 CanvasContainer 对象
        this.layer = this;

        //if (this.props.devicePixelRatio != 1)
        //    this.setScale(this.props.devicePixelRatio, this.props.devicePixelRatio);

        this.on(Event.MouseEvent.CLICK, (e) => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.DOUBLE_CLICK, (e) => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.CONTEXT_MENU, (e) => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.MOUSE_DOWN, (e) => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.MOUSE_UP, (e) => this._onMouseEvents_(e));

        this.assign(options);
    }

    set devicePixelRatio(v) {
        this.props.devicePixelRatio = v;
    }

    get devicePixelRatio() {
        return this.props.devicePixelRatio;
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

    get graphics() {
        return this._graphics_;
    }

    set graphics(v) {
        this._graphics_ = v;
    }

    /**
     * 设置 Dom 的大小
     * @private
     */
    _onSizeChanged_() {
        // retina 属性设置为 true，效果是：尺寸指定为 devicePixelRatio 倍，再用 css 缩至原始尺寸
        T.attr(this.dom, "width", this.width * this.devicePixelRatio + "px");
        T.attr(this.dom, "height", this.height * this.devicePixelRatio + "px");

        // 用 css 约束尺寸
        T.css(this.dom, "width", this.width + "px");
        T.css(this.dom, "height", this.height + "px");
    }

    /**
     * 添加子节点
     * @param child {DisplayObject}
     */
    addChild(child) {
        super.addChild(child);
        child.graphics = this.graphics;
        child.layer = this;
        child._onAppendToLayer_();
        return this;
    }

    _onBeforeAddChild_(child) {
        if (child.isDomSprite) {
            this.logger.warn(`_onBeforeAddChild_(${child.name || child.clazz} ${child.isDomSprite}): CanvasContainer 的内部显示对象不能是 DomSprite 的实例`);
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
     * 空方法，为了抵消 DomSprite 的同名方法
     */
    _onChildrenChanged_() {
    }

    /**
     * 绘制画布自身前的处理：缩放，设置透明度
     * @private
     */
    _onBeforePaint_() {
        let g = this.graphics;
        // 缩放
        if (this.devicePixelRatio !== 1)
            g.scale(this.devicePixelRatio, this.devicePixelRatio);

        g.globalAlpha = this.alpha;
    }

    /**
     * 绘制画布自身后的处理：绘制子对象
     * @private
     */
    _onAfterPaint_() {
        let g = this.graphics;
        g.save();
        // 绘制顺序为后绘制的在上层
        g.globalCompositeOperation = "source-over";

        // 遍历孩子，顺序与globalCompositeOperation的设置要匹配，这里的效果是后添加的在上面
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
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
                child._paint_();
                // 恢复上下文
                g.restore();
            }
        }

        g.restore();
    }

    /**
     * 通用绘制方法，绘制前判断是否改变
     * @private
     */
    _paint_() {

        if (!this.redrawAsNeeded || this.isChanged()) {
            if (!this._painting_) {
                this._painting_ = true;
                CanvasLayer.logger.debug(`开始重绘`);
            }
            let start = +new Date();

            this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
            super._paint_();

            let time = +new Date() - start;
            if (time > 16 && time > (this._paint_time_ || 0)) {
                let m = Math.floor(time / 60000);
                let s = Math.floor((time - m * 60000) / 1000);
                let mi = time - m * 60000 - s * 1000;
                this._paint_time_ = time;
                this.logger.warn(`耗时警告：最长重绘耗时为：${m}:${s}.${mi}，超过 16 毫秒，帧数将少于 60 帧`);
            }
        } else {
            if (this._painting_) {
                this._painting_ = false;
                CanvasLayer.logger.debug(`已停止重绘`);
            }
        }

    }

    /**
     * 接收 Canvas Dom 的鼠标移动事件，并且遍历内部 Context2DSprite 对象，调用其 _onLayerMouseMove_ 方法，间接触发内部鼠标移动相关事件
     * @param e {object}
     */
    _onMouseMove_(e) {
        // 调用 DisplayObject 的同名方法，转换坐标为内部坐标。
        // 注意：Canvas 不能旋转缩放，否则坐标为外界矩形内部坐标，如果 DomSprite 已实现坐标转换，请删除此行注释。
        super._onMouseMove_(e);

        for (let i = this.children.length - 1; i >= 0; i--) {
            let child = this.children[i];
            child._onLayerMouseMove_(this.getMousePos(), 2);
        }
    }

    /**
     * 接收 Canvas Dom 的鼠标单击事件，遍历内部对象，调用 _onLayerMouseClick_ 方法，由其自己判断是否发送内部鼠标单击事件
     * @param e {object}
     * @private
     */
    _onMouseEvents_(e) {
        // this.logger.debug(`_onMouseEvents_()`, e);
        for (let i = this.children.length - 1; i >= 0; i--) {
            let child = this.children[i];
            child._onLayerMouseEvents_(e.eventName);
        }
    }
}
