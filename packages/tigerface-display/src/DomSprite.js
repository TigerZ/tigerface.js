import { Utilities as T, Logger } from 'tigerface-common';
import { Rectangle } from 'tigerface-shape';
import { Event, DomEventAdapter } from 'tigerface-event';
import Sprite from './Sprite';


/**
 * 基于 Dom 的 Sprite
 *
 * @extends Sprite
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class DomSprite extends Sprite {
    static logger = Logger.getLogger(DomSprite.name);

    static Position = {
        STATIC: 'static',
        RELATIVE: 'relative',
        ABSOLUTE: 'absolute',
        FIXED: 'fixed',
    };

    /**
     * 初始化舞台
     *
     * @param options {object|HTMLElement} 选项
     * @param dom {HTMLElement} dom 节点
     */
    constructor(options = undefined, dom = undefined) {
        const _dom = typeof dom === 'string' ? document.createElement(dom) : (dom || document.createElement('div'));

        const props = {
            clazzName: DomSprite.name,
            _dom_: _dom, // 注意：这里通过 _dom_ 来设置，因为用'dom =...'，会导致过早触发 _onDomChanged_ 事件
            preventDefault: false,
            width: '320',
            height: '240',
        };

        super(props);

        // chrome 浏览器在拖拽时，鼠标指针为“I”，下面用来修复此问题
        this.addEventListener(Event.MouseEvent.DRAG, (e) => {
            T.css(e.currentTarget.dom, 'cursor', 'default');
        });

        // Dom 位置和尺寸获取方法，能同步 Dom 实际值和 DomSprite 属性
        this.resize();

        this.isDomSprite = true;

        this.assign(T.merge({
            style: {
                // position: 'absolute',
                'transform-origin': '0px 0px 0px',
                padding: '0px', // 无内边距
                margin: '0px', // 无外边距
                overflow: 'hidden', // 溢出隐藏
                display: 'block',
                outline: 'none', // 隐藏 focus 的方框
                '-webkit-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
            },
        }, options));

        this.logger.debug('初始化完成');
    }

    set dom(v) {
        this._dom_ = v;
        this._onDomChanged_();
    }

    get dom() {
        return this._dom_ === document ? document.documentElement : this._dom_;
    }

    get id() {
        return this.dom.id;
    }

    set id(v) {
        this.dom.id = v;
    }

    get title() {
        return this.dom.title;
    }

    set title(v) {
        this.dom.title = v;
    }

    get css() {
        return this.style;
    }

    set css(v) {
        this.style = v;
    }

    get style() {
        return this.dom.style || {};
    }

    set style(v) {
        this.setStyle(v);
    }

    get className() {
        return this.props.className;
    }

    set className(v) {
        this.props.className = v;
        T.addClass(this.dom, v);
        this.postChange('dom class', v);
    }

    get graphics() {
        return undefined;
    }

    get visible() {
        return super.visible;
    }

    set visible(v) {
        super.visible = v;
        this.style = { visibility: this.visible ? 'visible' : 'hidden' };
    }

    resize() {
        this.size = T.size(this.dom);
    }

    set pos(pos) {
        super.pos = pos;
        this.style = { position: 'absolute' };
    }

    get pos() {
        return super.pos;
    }

    /**
     * Dom 特有的边界获取方法，如果存在图形边界，返回图形边界数组，否则，返回边框图形
     * @returns {*}
     */
    get bounds() {
        if (this._bounds_.length === 0) {
            return [new Rectangle(0, 0, this.size.width, this.size.height)];
        }
        return this._bounds_;
    }

    /**
     * Dom 的外接矩形，对应于 Context2DSprite 的 outer 外接矩形。
     * 此方法返回的矩形，就是 Dom 的 MOUSE_MOVE 事件直接返回的坐标系，原点在左上角。
     * mousePos 得到的鼠标坐标，经过偏移得到外部坐标，再转换为内部坐标，得到准确的内部鼠标坐标投影。
     * @returns {Shape.Rectangle}
     * @private
     */
    getDomBoundingRect() {
        // 实例化图形对象，用于计算
        const { size } = this;
        const rect = new Rectangle(0, 0, size.width, size.height);

        const vertexes = rect.getVertexes();
        const points = [];
        for (let i = 0; i < vertexes.length; i += 1) {
            points.push(this.getOuterPos(vertexes[i]));
        }
        return new Rectangle(points);
    }

    /**
     * Dom 特有的获取精确鼠标坐标的方法。直接从 Dom 事件中得到的坐标，是 Dom Outer 外接矩形的坐标。
     * 如果 Dom 发生过旋转和缩放，必须用此方法，才能得到准确的内部鼠标坐标。
     * 所以，为保证安全，在任何时候，都应该调用此方法获取鼠标坐标，不要直接访问 _mouseX_ 和 _mouseY_
     *
     * @returns {Point|{x:*,y:*}}
     */
    // getMousePos {
    //     let pos = super.getMousePos();
    //     // this.logger.debug('getMousePos(): pos=', pos);
    //
    //     // 坐标系转换
    //     let rect = this.getDomBoundingRect();
    //     pos = this.getInnerPos(new Point(pos).move(rect.left, rect.top), 2);
    //
    //     return pos;
    // }

    /**
     * 设置 DOM 的位置
     * @private
     */

    _onPosChanged_() {
        if (this.dom === document) return;
        this.setStyle({ position: DomSprite.Position.ABSOLUTE });

        const t = this.origin;
        T.css(this.dom, 'left', `${this.x - t.x}px`);
        T.css(this.dom, 'top', `${this.y - t.y}px`);

        super._onPosChanged_();
    }

    /**
     * 设置 Dom 的大小
     * @private
     */
    _onSizeChanged_() {
        // if(this.layout) return;
        // console.log("***********", this.width, this.height);
        T.css(this.dom, 'width', typeof this.width === 'number' ? (`${this.width}px`) : this.width);
        T.css(this.dom, 'height', typeof this.height === 'number' ? (`${this.height}px`) : this.height);
    }

    /**
     * 添加子节点后的处理
     *
     * @param child {DisplayObject}
     * @private
     */
    _onAddChild_(child) {
        if (child.dom && child.dom.parentNode !== this.dom) {
            this.dom.appendChild(child.dom);
        }
        // this.logger.debug('_onAddChild_(): parent =', this.dom, ' child =', child.dom);
        // this.logger.debug(`_onAddChild_(): ${parent.nodeName}[${parent.title}] =? ${this.dom.nodeName}[${this.dom.title}]`);
        // this.logger.debug('_onAddChild_(): child =', child.name || child.clazzName);
        super._onAddChild_(child);
    }

    _onDomChanged_() {
        this.logger.debug('_onDomChanged_()', this.dom);
        this.children.forEach((child) => {
            const parent = child.dom.parentNode;
            if (parent !== this.dom) {
                this.dom.appendChild(child.dom);
            }
        });
    }

    _onAlphaChanged_() {
        const { alpha } = this;
        const style = {
            filter: `alpha(opacity=${alpha * 10})`,
            '-moz-opacity': alpha,
            '-webkit-opacity': alpha,
            '-o-opacity': alpha,
            opacity: alpha,
        };
        this.setStyle(style);
    }

    _onVisibleChanged_() {
        if (this.visible) {
            this.setStyle({ display: 'block' });
        } else {
            this.setStyle({ display: 'none' });
        }
    }

    _onOriginChanged_() {
        this._onPosChanged_();
        this._setTransformOrigin_();
        this._setTransform_();

        super._onOriginChanged_();
    }

    _onRotationChanged_() {
        this._setTransform_();
    }

    _onScaleChanged_() {
        this._setTransform_();
    }

    _setTransformOrigin_() {
        const t = this.origin;
        const style = {
            'transform-origin': `${t.x}px ${t.y}px`,
            '-ms-transform-origin': `${t.x}px ${t.y}px`, /* IE 9 */
            '-webkit-transform-origin': `${t.x}px ${t.y}px`, /* Safari and Chrome */
            '-o-transform-origin': `${t.x}px ${t.y}px`, /* Opera */
            '-moz-transform-origin': `${t.x}px ${t.y}px`, /* Firefox */
        };
        this.setStyle(style);
    }

    _setTransform_() {
        const s = this.scale;
        const r = this.rotation;
        const style = {
            transform: ` scale(${s.x},${s.y}) rotate(${r}deg)`,
            '-ms-transform': ` scale(${s.x},${s.y}) rotate(${r}deg)`, /* IE 9 */
            '-webkit-transform': ` scale(${s.x},${s.y}) rotate(${r}deg)`, /* Safari and Chrome */
            '-o-transform': ` scale(${s.x},${s.y}) rotate(${r}deg)`, /* Opera */
            '-moz-transform': ` scale(${s.x},${s.y}) rotate(${r}deg)`, /* Firefox */
        };
        this.setStyle(style);
    }

    _onChildrenChanged_() {
        super._onChildrenChanged_();
        if (this.children.length > 1) {
            for (let i = 0; i < this.children.length; i += 1) {
                const child = this.children[i];
                child.setStyle({ 'z-index': (i * 10) + 10 });
            }
        }
    }

    /**
     *
     * @param child {DisplayObject | DomSprite}
     * @returns {boolean}
     * @private
     */
    _onBeforeAddChild_(child) {
        if (child.isDomSprite) {
            return true;
        }
        this.logger.warn(`_onBeforeAddChild_(${child.name || child.clazzName} ${child.isDomSprite}): DomSprite 类型容器的 addChild 方法只能接受同样是 DomSprite 类型的子节点`);
        return false;
    }

    /**
     *  添加样式
     * @param  style {object} 样式
     * @param autoPrefix {boolean} 是否添加多浏览器前缀
     */
    setStyle(style, autoPrefix = false) {
        if (T.assignEqual(this.dom.style, style)) return;
        T.cssMerge(this.dom, style, autoPrefix);
        this.postChange('dom style', style);
    }

    /**
     * 添加数据
     * @param data {object}
     */
    addData(data) {
        Object.keys(data).forEach((key) => {
            T.data(this.dom, key, data[key]);
        });
    }

    /**
     *  添加 tween
     * @param {{prop:string, duration:number, effect:string, delay:number}} prop
     */
    addTween(props) {
        if (T.isArray(props)) {
            let str = '';
            props.forEach((prop) => {
                if (str) str += ', ';
                str += this._covertTween_(prop.prop, prop.duration, prop.delay, prop.effect);
            });
            this.setStyle({ transition: str }, true);
        } else {
            this.setStyle({ transition: this._covertTween_(props.prop, props.duration, props.delay, props.effect) }, true);
        }
    }

    /**
     *
     * @param prop {string}
     * @param duration {number}
     * @param delay {number}
     * @param effect {string}
     * @returns {string}
     * @private
     */
    _covertTween_(prop, duration, delay, effect) {
        return `${duration || '1'}s ${delay || '0'}s ${prop || ''} ${effect || 'linear'}`;
    }

    clearTween() {
        T.removeCss(this.dom, 'transition', true);
    }

    getScroll() {
        const { dom } = this;
        return {
            scrollTop: T.scrollTop(dom),
            scrollLeft: T.scrollLeft(dom),
        };
    }

    set scroll(scroll) {
        this.scrollLeft = scroll.scrollLeft;
        this.scrollLeft = scroll.scrollLeft;
    }

    set scrollLeft(v) {
        T.scrollLeft(this.dom, v);
    }

    set scrollTop(v) {
        T.scrollTop(this.dom, v);
    }

    getDomInfo() {
        const { dom } = this;
        return {
            clientWidth: dom.clientWidth,
            clientHeight: dom.clientHeight,
            offsetWidth: dom.offsetWidth,
            offsetHeight: dom.offsetHeight,
            scrollWidth: dom.scrollWidth,
            scrollHeight: dom.scrollHeight,
            scrollTop: dom.scrollTop,
            scrollLeft: dom.scrollLeft,
        };
    }

    getBoundRectShadow() {
        const p0 = this.getStagePos();
        const rect = this.boundingRect;
        return {
            pos: p0,
            size: { width: rect.width, height: rect.height },
            rotation: this._getStageRotation_(),
            origin: this._getStageOrigin_(),
            scale: this._getStageScale_(),
        };
    }
}

export default DomSprite;

