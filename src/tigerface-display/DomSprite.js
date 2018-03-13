/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 14:11.
 */
import {Utilities as T, Logger} from 'tigerface-common';
import {Rectangle, Point} from 'tigerface-shape';
import Sprite from './Sprite';
import {Event, DomEventAdapter} from 'tigerface-event';

/********************************************************************************************************
 *
 * Stage 是架构中显示对象的根容器，即舞台。TigerFace 类的职责是提供重绘和进入帧事件。
 * Stage 类在0.7版本后被简化，管理层的责任交给 DomContainer 和 CanvasContainer 处理。
 *
 *******************************************************************************************************/

export default class DomSprite extends Sprite {
    static logger = Logger.getLogger(DomSprite.name);

    static Position = {
        STATIC: 'static',
        RELATIVE: 'relative',
        ABSOLUTE: 'absolute',
        FIXED: 'fixed'
    };

    /**
     * 初始化舞台
     *
     * @param options {object|HTMLElement} 选项
     * @param dom {HTMLElement} dom 节点
     */
    constructor(options, dom) {
        try {
            if (options instanceof HTMLElement && dom === undefined) {
                dom = options;
                options = {};
            }
        } catch (e) {
            // eslint-disable-next-line no-empty
        }

        let props = {
            _dom_: dom || document.createElement('div'), // 注意：这里通过 _dom_ 来设置，因为用'dom =...'，会导致过早触发 _onDomChanged_ 事件
            preventDefault: false
        };

        super(props);

        this.assign(T.merge({
            style: {
                padding: '0px', // 无内边距
                margin: '0px', // 无外边距
                overflow: 'hidden', // 溢出隐藏
                display: 'block',
                outline: 'none', // 隐藏 focus 的方框
                '-webkit-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none'
            }
        }, options));

        // 基本信息
        this.className = DomSprite.name;

        this.logger.debug(`[${this.className}]:初始化参数：options=`, options, 'state=', this.state);

        // 定义 Dom 引擎
        this.domAdapter = new DomEventAdapter(this.dom, {
            preventDefault: this.state.preventDefault
        }, this);

        // chrome 浏览器在拖拽时，鼠标指针为“I”，下面用来修复此问题
        this.addEventListener(Event.MouseEvent.DRAG, function (e) {
            T.css(e.currentTarget.dom, 'cursor', 'default');
        });

        // Dom 位置和尺寸获取方法，能同步 Dom 实际值和 DomSprite 属性
        this.resize();

        this.isDomSprite = true;
    }

    set dom(v) {
        this._dom_ = v;
        this._onDomChanged_();
    }

    get dom() {
        return this._dom_ === document ? document.documentElement : this._dom_;
    }

    get css() {
        return this.style;
    }

    set css(v) {
        this.style = v;
    }

    get style() {
        return this.props.style || {};
    }

    /**
     * 设置样式
     * @param v {object}
     */
    set style(v) {
        this.props.style = Object.assign({}, this.props.style, v);
        this.setStyle(v);
    }

    get preventDefault() {
        return this.state.preventDefault;
    }

    set preventDefault(v) {
        this.state.preventDefault = v;
    }

    get graphics() {
        return undefined;
    }

    /**
     *
     * @param v {*}
     */
    set graphics(v) {
        // do nothing
    }

    resize() {
        Object.assign(this.state.size, T.size(this.dom));
    }

    /**
     * Dom 特有的边界获取方法，如果存在图形边界，返回图形边界数组，否则，返回边框图形
     * @returns {*}
     */
    get bounds() {
        if (this._bounds_.length === 0) {
            let size = this.size;
            return [new Rectangle(0, 0, size.width, size.height)];
        }
        return this._bounds_;
    }

    /**
     * Dom 的外接矩形，对应于 Context2DSprite 的 outer 外接矩形。
     * 此方法返回的矩形，就是 Dom 的 MOUSE_MOVE 事件直接返回的坐标系，原点在左上角。
     * getMousePos 方法通过此方法，将直接得到的鼠标坐标，经过偏移得到外部坐标，再转换为内部坐标，得到准确的内部鼠标坐标投影。
     * @returns {Shape.Rectangle}
     * @private
     */
    getDomBoundingRect() {
        // 实例化图形对象，用于计算
        let size = this.size;
        let rect = new Rectangle(0, 0, size.width, size.height);

        let vertexes = rect.getVertexes();
        let points = [];
        for (let i = 0; i < vertexes.length; i++) {
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
    getMousePos() {

        let pos = super.getMousePos();
        // this.logger.debug('getMousePos(): pos=', pos);

        // 坐标系转换
        let rect = this.getDomBoundingRect();
        pos = this.getInnerPos(new Point(pos).move(rect.left, rect.top), 2);

        return pos;
    }

    /**
     * 设置 DOM 的位置
     * @private
     */
    _onPosChanged_() {
        if (this.dom === document) return;
        this.setStyle({'position': DomSprite.Position.ABSOLUTE});

        let t = this.origin;
        T.css(this.dom, 'left', (this.x - t.x) + 'px');
        T.css(this.dom, 'top', (this.y - t.y) + 'px');
    }

    /**
     * 设置 Dom 的大小
     * @private
     */
    _onSizeChanged_() {
        //if(this.layout) return;
        T.css(this.dom, 'width', this.width + 'px');
        T.css(this.dom, 'height', this.height + 'px');
    }

    /**
     * 添加子节点后的处理
     *
     * @param child {DisplayObject}
     * @private
     */
    _onAddChild_(child) {
        if (child['dom'] && child['dom'].parentNode !== this.dom) {
            this.dom.appendChild(child['dom']);
        }
        // this.logger.debug('_onAddChild_(): parent =', this.dom, ' child =', child.dom);
        // this.logger.debug(`_onAddChild_(): ${parent.nodeName}[${parent.title}] =? ${this.dom.nodeName}[${this.dom.title}]`);
        // this.logger.debug('_onAddChild_(): child =', child.name || child.className);
        super._onAddChild_(child);
    }

    _onDomChanged_() {
        // this.logger.debug('_onDomChanged_(): children =', this.children);
        for (let child of this.children) {
            let parent = child.dom.parentNode;
            if (parent !== this.dom) {
                this.dom.appendChild(child.dom);
            }
        }
    }

    _onAlphaChanged_() {
        let alpha = this.alpha;
        let style = {
            'filter': 'alpha(opacity=' + (alpha * 10) + ')',
            '-moz-opacity': alpha,
            '-webkit-opacity': alpha,
            '-o-opacity': alpha,
            'opacity': alpha
        };
        this.setStyle(style);
    }

    _onVisibleChanged_() {
        if (this.visible) {
            this.setStyle({'display': 'block'});
        } else {
            this.setStyle({'display': 'none'});
        }
    }

    _onOriginChanged_() {
        this._onPosChanged_();
        this._setTransformOrigin_();
        this._setTransform_();
    }

    _onRotationChanged_() {
        if (this.rotation === 0) return;
        this._setTransform_();
    }

    _onScaleChanged_() {
        let scale = this.scale;
        if (scale.x === 1 && scale.y === 1) return;
        this._setTransform_();
    }

    _setTransformOrigin_() {
        let t = this.origin;
        let style = {
            'transform-origin': t.x + 'px ' + t.y + 'px',
            '-ms-transform-origin': t.x + 'px ' + t.y + 'px', /* IE 9 */
            '-webkit-transform-origin': t.x + 'px ' + t.y + 'px', /* Safari and Chrome */
            '-o-transform-origin': t.x + 'px ' + t.y + 'px', /* Opera */
            '-moz-transform-origin': t.x + 'px ' + t.y + 'px' /* Firefox */
        };
        this.setStyle(style);
    }

    _setTransform_() {
        let s = this.scale;
        let r = this.rotation;
        let style = {
            'transform': ' scale(' + s.x + ',' + s.y + ') rotate(' + r + 'deg' + ')',
            '-ms-transform': ' scale(' + s.x + ',' + s.y + ') rotate(' + r + 'deg' + ')', /* IE 9 */
            '-webkit-transform': ' scale(' + s.x + ',' + s.y + ') rotate(' + r + 'deg' + ')', /* Safari and Chrome */
            '-o-transform': ' scale(' + s.x + ',' + s.y + ') rotate(' + r + 'deg' + ')', /* Opera */
            '-moz-transform': ' scale(' + s.x + ',' + s.y + ') rotate(' + r + 'deg' + ')' /* Firefox */
        };
        this.setStyle(style);
    }

    _onChildrenChanged_() {
        super._onChildrenChanged_();
        if (this.children.length > 1)
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                child.setStyle({'z-index': i * 10 + 10});
            }
    }

    /**
     *
     * @param child {DisplayObject | DomSprite}
     * @returns {boolean}
     * @private
     */
    _onBeforeAddChild_(child) {
        if (child.isDomSprite)
            return true;
        this.logger.warn(`_onBeforeAddChild_(${child.name || child.className} ${child.isDomSprite}): DomSprite 类型容器的 addChild 方法只能接受同样是 DomSprite 类型的子节点`);
        return false;
    }

    // setLayout(layout) {
    //     if (layout && layout.isLayout()) {
    //         this.layout = layout;
    //         layout.target = this;
    //     }
    // }

    // setStyle(nameOrCss, value, autoPrefix) {
    //     // this.logger.debug('setStyle', this.state, nameOrCss, value, autoPrefix);
    //     if (arguments.length === 1 && typeof nameOrCss === 'object') {
    //         this.state.style = Object.assign({}, this.state.style, nameOrCss);
    //         T.cssMerge(this.dom, nameOrCss, autoPrefix);
    //     } else {
    //         this.state.style[nameOrCss] = value;
    //         T.css(this.dom, nameOrCss, value, autoPrefix);
    //     }
    //     this.postChange();
    // }

    /**
     *  添加样式
     * @param  style {object} 样式
     * @param autoPrefix {boolean} 是否添加多浏览器前缀
     */
    setStyle(style, autoPrefix = false) {
        // this.logger.debug('setStyle', this.state, nameOrCss, value, autoPrefix);

        T.cssMerge(this.dom, style, autoPrefix);

        this.postChange();
    }

    /**
     * 添加数据
     * @param data {object}
     */
    addData(data) {
        let key;
        for (key in data) {
            T.data(this.dom, key, data[key]);
        }

    }

    /**
     *  添加 tween
     * @param {{prop string, duration integer, effect string, delay integer}} prop
     */
    addTween(prop) {
        if (T.isArray(prop)) {
            let str = "";
            for (let i in prop) {
                if (str) str = str + ', ';
                str = str + this._covertTween_(prop[i].prop, prop[i].duration, prop[i].delay, prop[i].effect);
            }
            this.setStyle({'transition': str}, true);
        } else {
            this.setStyle({'transition': this._covertTween_(prop.prop, prop.duration, prop.delay, prop.effect)}, true);
        }
    }

    /**
     *
     * @param prop {string}
     * @param duration {integer}
     * @param delay {integer}
     * @param effect {string}
     * @returns {string}
     * @private
     */
    _covertTween_(prop, duration, delay, effect) {
        return (duration || '1') + 's ' + (delay || '0') + 's ' + (prop || "") + ' ' + (effect || 'linear');
    }

    clearTween() {
        T.removeCss(this.dom, 'transition', true);
    }

    getScroll() {
        let dom = this.dom;
        return {
            scrollTop: T.scrollTop(dom),
            scrollLeft: T.scrollLeft(dom)
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
        let dom = this.dom;
        return {
            clientWidth: dom.clientWidth,
            clientHeight: dom.clientHeight,
            offsetWidth: dom.offsetWidth,
            offsetHeight: dom.offsetHeight,
            scrollWidth: dom.scrollWidth,
            scrollHeight: dom.scrollHeight,
            scrollTop: dom.scrollTop,
            scrollLeft: dom.scrollLeft
        }
    }
}

