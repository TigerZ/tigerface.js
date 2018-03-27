import { Utilities as T, Logger } from 'tigerface-common';
import { Rectangle } from 'tigerface-shape';
import { Event } from 'tigerface-event';
import Sprite from './Sprite';


/**
 * 基于 Dom 的 Sprite
 *
 * @extends tigerface-display.Sprite
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
     * {
     *      width: '320',
     *      height: '240',
     *      style: {
     *          position: 'relative',
     *          'transform-origin': '0px 0px 0px',
     *          padding: '0px', // 无内边距
     *          margin: '0px', // 无外边距
     *          overflow: 'hidden', // 溢出隐藏
     *          display: 'block',
     *          outline: 'none', // 隐藏 focus 的方框
     *          '-webkit-user-select': 'none',
     *          '-moz-user-select': 'none',
     *          '-ms-user-select': 'none',
     *          'user-select': 'none',
     *      }
     * }
     * @param dom {HTMLElement} 绑定的 DOM 节点
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
        this._resize_();

        this.isDomSprite = true;

        this.assign(T.merge({
            style: {
                position: 'relative',
                'transform-origin': '0px 0px 0px',
                padding: '0px', // 无内边距
                margin: '0px', // 无外边距
                overflow: 'hidden', // 溢出隐藏
                display: 'block',
                outline: 'none', // 隐藏 focus 的方框
                // '-webkit-user-select': 'none',
                // '-moz-user-select': 'none',
                // '-ms-user-select': 'none',
                // 'user-select': 'none',
            },
        }, options));

        this.logger.debug('初始化完成');
    }

    set dom(v) {
        this.logger.error('禁止替换 dom 对象');
        // this._dom_ = v;
        // this._onDomChanged_();
    }

    /**
     * 绑定的 DOM 对象（只读）
     * @member {HTMLElement}
     */
    get dom() {
        return this._dom_ === document ? document.documentElement : this._dom_;
    }

    get id() {
        return this.dom.id;
    }

    /**
     * DOM 对象的 id 属性
     * @member {string}
     */
    set id(v) {
        this.dom.id = v;
    }

    get title() {
        return this.dom.title;
    }

    /**
     * DOM 对象的 title 属性
     * @member {string}
     */
    set title(v) {
        this.dom.title = v;
    }

    get css() {
        this.logger.warn('css 是已经废弃的属性，请使用 style 属性');
        return this.style;
    }

    /**
     * css 样式，已经废弃，请使用 style 属性
     * @param {object}
     * @deprecated
     */
    set css(v) {
        this.logger.warn('css 是已经废弃的属性，请使用 style 属性');
        this.style = v;
    }

    get style() {
        return this.dom.style || {};
    }

    /**
     * DOM 对象的 style/css 属性
     * @member {object}
     */
    set style(v) {
        this.setStyle(v);
    }


    get className() {
        return this.props.className;
    }

    /**
     * DOM 对象的 className 属性
     * @member {string}
     */
    set className(v) {
        this.props.className = v;
        T.addClass(this.dom, v);
        this.postChange('dom class', v);
    }

    /**
     * 画笔
     * @member {undefined}
     * @private
     */
    get graphics() {
        return undefined;
    }

    get visible() {
        return super.visible;
    }

    /**
     * 可见性，覆盖超类的属性
     * @member {boolean}
     */
    set visible(v) {
        super.visible = v;
        this.style = { visibility: this.visible ? 'visible' : 'hidden' };
    }

    /**
     * 根据 Dom 对象调整 size 属性
     * @private
     */
    _resize_() {
        this.size = T.size(this.dom);
    }

    /**
     * Dom 特有的边界获取方法，如果存在图形边界，返回图形边界数组，否则，返回边框图形
     * @returns {array}
     */
    get bounds() {
        if (this._bounds_.length === 0) {
            return [new Rectangle(0, 0, this.size.width, this.size.height)];
        }
        return this._bounds_;
    }

    /**
     * 位置改变时调用，覆盖超类方法
     * @package
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
     * @package
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
     * @package
     */
    _onAddChild_(child) {
        if (child.dom && child.dom.parentNode !== this.dom) {
            this.dom.appendChild(child.dom);
        }

        super._onAddChild_(child);
    }

    /**
     * 透明度改变时调用，覆盖超类的方法
     * @package
     */
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

    /**
     * 可见性改变时调用，覆盖超类的方法
     * @package
     */
    _onVisibleChanged_() {
        if (this.visible) {
            this.setStyle({ display: 'block' });
        } else {
            this.setStyle({ display: 'none' });
        }
    }

    /**
     * 原点改变时调用，覆盖超类的方法
     * @package
     */
    _onOriginChanged_() {
        this._onPosChanged_();
        this._setTransformOrigin_();
        this._setTransform_();

        super._onOriginChanged_();
    }

    /**
     * 旋转角度改变时调用，覆盖超类的方法
     * @package
     */
    _onRotationChanged_() {
        this._setTransform_();
    }

    /**
     * 缩放比例改变时调用，覆盖超类的方法
     * @package
     */
    _onScaleChanged_() {
        this._setTransform_();
    }

    /**
     * css 定义原点
     * @private
     */
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

    /**
     * css 实现缩放和旋转
     * @private
     */
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

    /**
     *
     * @param child {DisplayObject | DomSprite}
     * @returns {boolean}
     * @package
     */
    _onBeforeAddChild_(child) {
        if (child.isDomSprite) {
            return true;
        }
        this.logger.warn('添加失败，DomSprite 容器只能添加 DomSprite 或子类的实例作为子对象');
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
     * @package
     */
    _covertTween_(prop, duration, delay, effect) {
        return `${duration || '1'}s ${delay || '0'}s ${prop || ''} ${effect || 'linear'}`;
    }

    clearTween() {
        T.removeCss(this.dom, 'transition', true);
    }

    _onAppendToStage_() {
        super._onAppendToStage_();
        if (this.stage) {
            this.stage._registerDom_(this);
        }
    }

    _onRemoveChild_(child) {
        super._onRemoveChild_(child);
        if (this.stage) {
            const idx = this.stage.domList.indexOf(child);
            this.stage.domList.split(idx, 1);
        }
    }
}

export default DomSprite;

