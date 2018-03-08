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
     * @param wrapper Dom节点
     * @param options 选项
     */
    constructor(options, dom) {
        let state = Object.assign({
            devicePixelRatio: 1,
            width: 320,
            height: 240,
            retina: true,
            noClear: false,
            useDirtyRect: false,
            redrawAsNeeded: true,
            useOffScreenCanvas: false,
            style: {
                backgroundColor: 'rgba(0,0,0,0.3)'
            }
        }, options);

        let canvas = dom || document.createElement("canvas");
        // 调用 DisplayObject 的构造器
        super(state, canvas);

        this.canvas = canvas;

        this.graphics = new Graphics(this.canvas.getContext('2d'));

        // 基本信息
        this.className = CanvasLayer.name;

        // 下层显示对象通过此属性识别是否是上层 CanvasContainer 对象
        this.layer = this;

        //if (this.state.devicePixelRatio != 1)
        //    this.setScale(this.state.devicePixelRatio, this.state.devicePixelRatio);

        this.on(Event.MouseEvent.CLICK, (e) => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.DOUBLE_CLICK, (e) => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.CONTEXT_MENU, (e) => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.MOUSE_DOWN, (e) => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.MOUSE_UP, (e) => this._onMouseEvents_(e));

    }

    set devicePixelRatio(v) {
        this.state.devicePixelRatio = v;
    }

    get devicePixelRatio() {
        return this.state.devicePixelRatio;
    }

    set retina(v) {
        this.state.retina = v;
        if (v) {
            this.devicePixelRatio = window.devicePixelRatio || 1;
        } else {
            this.devicePixelRatio = 1;
        }
        this._onSizeChanged_();
    }

    get retina() {
        return this.state.retina;
    }

    set noClear(v) {
        this.state.noClear = v;
    }

    get noClear() {
        return this.state.noClear;
    }

    set useDirtyRect(v) {
        this.state.useDirtyRect = v;
    }

    get useDirtyRect() {
        return this.state.useDirtyRect;
    }

    set redrawAsNeeded(v) {
        this.state.redrawAsNeeded = v;
    }

    get redrawAsNeeded() {
        return this.state.redrawAsNeeded;
    }

    set useOffScreenCanvas(v) {
        this.state.useOffScreenCanvas = v;
    }

    get useOffScreenCanvas() {
        return this.state.useOffScreenCanvas;
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

    addChild(child) {
        super.addChild(child);
        child.canvas = this.canvas;
        child.layer = this;
        child._onAppendToLayer_();
    }

    _onBeforeAddChild_(child) {
        if (child.isDomSprite) {
            DomSprite.logger.warn(`_onBeforeAddChild_(${child.name||child.className} ${child.isDomSprite}): CanvasContainer 的内部显示对象不能是 DomSprite 的实例`);
            return false;
        }
        return true;
    }

    /**
     * 空方法，为了抵消 DomSprite 的同名方法
     */
    _onAddChild_(child) {
    }

    /**
     * 空方法，为了抵消 DomSprite 的同名方法
     */
    _onChildrenChanged_() {
    }

    /**
     * 绘制画布自身前的处理：缩放，设置透明度
     * @param ctx
     * @private
     */
    _onBeforePaint_(ctx) {
        // 缩放
        if (this.state.devicePixelRatio != 1)
            ctx.scale(this.state.devicePixelRatio, this.state.devicePixelRatio);

        ctx.globalAlpha = this.alpha;
    }

    /**
     * 绘制画布自身后的处理：绘制子对象
     * @param ctx
     * @private
     */
    _onAfterPaint_(ctx) {
        ctx.save();
        // 绘制顺序为后绘制的在上层
        ctx.globalCompositeOperation = "source-over";

        // 遍历孩子，顺序与globalCompositeOperation的设置要匹配，这里的效果是后添加的在上面
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            // 子元件可见才绘制
            if (child.visible) {
                // 孩子会坐标转换、缩放及旋转，所以先保存上下文
                ctx.save();
                // 每个孩子的位置，由上层决定。孩子自己只知道从自己的originX, originY, 开始相对坐标即可
                ctx.translate(child.x, child.y);
                // 孩子的透明度
                child.realAlpha = this.alpha * child.alpha;
                ctx.globalAlpha = child.realAlpha;
                // 调用孩子绘制方法
                child._paint_(ctx);
                // 恢复上下文
                ctx.restore();
            }
        }

        ctx.restore();
    }

    /**
     * 通用绘制方法，绘制前判断是否改变
     * @private
     */
    _paint_() {
        if (!this.state.redrawAsNeeded || this.isChanged()) {
            this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
            super._paint_(this.graphics);
        }
    }

    /**
     * 接收 Canvas Dom 的鼠标移动事件，并且遍历内部 Context2DSprite 对象，调用其 _onLayerMouseMove_ 方法，间接触发内部鼠标移动相关事件
     * @param e
     * @private
     */
    _onMouseMove_(e) {
        // 调用 DisplayObject 的同名方法，转换坐标为内部坐标。
        // 注意：Canvas 不能旋转缩放，否则坐标为外界矩形内部坐标，如果 DomSprite 已实现坐标转换，请删除此行注释。
        super._onMouseMove_(e);

        for (var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            child._onLayerMouseMove_(this.getMousePos(), 2);
        }
    }

    /**
     * 接收 Canvas Dom 的鼠标单击事件，遍历内部对象，调用 _onLayerMouseClick_ 方法，由其自己判断是否发送内部鼠标单击事件
     * @param e
     * @private
     */
    _onMouseEvents_(e) {
        // CanvasLayer.logger.debug(`[${this.className}]:_onMouseEvents_()`, e);
        for (let i = this.children.length - 1; i >= 0; i--) {
            let child = this.children[i];
            child._onLayerMouseEvents_(e.eventName);
        }
    }
}
