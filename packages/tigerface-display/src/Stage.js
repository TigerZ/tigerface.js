import { Utilities as T, Logger } from 'tigerface-common';
import { Event, FrameEventGenerator, DomEventAdapter } from 'tigerface-event';
import DomSprite from './DomSprite';
import Sprite from './Sprite';

function setZIndex(obj, pre = '1') {
    const len = (`${obj.children.length * 10}`).length;
    let last = pre;
    obj.children.forEach((child, idx) => {
        if (child instanceof DomSprite) {
            const cur = pre + (`${idx * 10}`).padStart(len, '0');
            child.setStyle({ 'z-index': Number.parseInt(cur, 10) });
            last = setZIndex(child, cur);
        }
    });
    if (obj.isStage) {
        obj.covers.forEach((cover, i) => {
            cover.setStyle({ 'z-index': ((i + 1) * 10) + Number.parseInt(last, 10) });
        });
    }
    return last;
}

/**
 * 舞台
 *
 * @extends module:tigerface-display.DomSprite
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class Stage extends DomSprite {
    static logger = Logger.getLogger(Stage.name);

    /**
     * @param options {object} 可选项
     *```
     *{
     *   fps: 60, // 每秒60帧
     *   preventDefault: true,
     *}
     *```
     *
     * @param dom 指定舞台 Dom 节点
     */
    constructor(options, dom) {
        const props = {
            clazzName: Stage.name,
            fps: 60, // 每秒60帧
            preventDefault: true,
        };

        super(props, dom);

        this.assign(T.merge({
            style: {
                position: DomSprite.Position.RELATIVE,
            },
        }, options));

        // 定义 Dom 引擎
        this.domAdapter = new DomEventAdapter(this.dom, {
            preventDefault: this.preventDefault,
        }, this);

        // 缺省的相对定位
        // this.setStyle({"position", DomSprite.Position.RELATIVE);

        // 舞台标识
        this._stage_ = this;

        // 如果舞台绑定的是局部 Dom 对象，那么在这个 Dom 对象里绘制签名
        // this._signing_();

        // 增加屏幕方向翻转检测

        window.onOrientationChange = () => {
            const orientation = window.orientation || 0;
            this.dispatchEvent(Event.ORIENTATION_CHANGE, {
                orientation,
                width: window.screen.width,
                height: window.screen.height,
            });
        };
        // this.on(Event.ENTER_FRAME, ()=>console.log(this.name+" ENTER_FRAME "+new Date().getSeconds()));


        this.frameAdapter = new FrameEventGenerator({ fps: this.fps });
        this.frameAdapter.on(Event.REDRAW, () => this._paint_());
        this.frameAdapter.on(Event.ENTER_FRAME, () => this._onEnterFrame_());


        this.on(Event.MouseEvent.MOUSE_MOVE, e => this._onMouseMove_(e));
        this.on(Event.MouseEvent.CLICK, e => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.DOUBLE_CLICK, e => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.CONTEXT_MENU, e => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.MOUSE_DOWN, e => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.MOUSE_UP, e => this._onMouseEvents_(e));
        this.on(Event.MouseEvent.MOUSE_OUT, e => this._onMouseEvents_(e));

        this.childrenIndex = {
            domList: [],
            layers: [],
            covers: [],
            all: {},
        };
    }

    get domList() {
        return this.childrenIndex.domList;
    }

    get layers() {
        return this.childrenIndex.layers;
    }

    get covers() {
        return this.childrenIndex.covers;
    }

    set rotation(rotation) {
        if (rotation) this.logger.error('舞台不能旋转');
    }

    get rotation() {
        return super.rotation;
    }

    //
    set pos(pos) {
        if (pos.x || pos.y) this.logger.error('舞台不能移动');
    }

    get pos() {
        return super.pos;
    }

    set alpha(alpha) {
        if (alpha !== 1) this.logger.error('舞台不能设置透明度');
    }

    get alpha() {
        return super.alpha;
    }

    set scale(scale) {
        if ((scale.x && scale !== 1) || (scale.y && scale.y !== 1)) this.logger.error('舞台不能设置缩放');
    }

    get scale() {
        return super.scale;
    }

    /**
     * 覆盖超类的方法
     * @param visible {boolean}
     * @member {boolean}
     */
    set visible(visible) {
        if (!visible) this.logger.error('舞台不能设置可见性');
        super.visible(visible);
    }

    get visible() {
        return true;
    }

    addChild(child) {
        this.addLayer(child);
    }

    /**
     * 获取层
     * @param [name = 'main'] {string} 层名称
     * @return {DomLayer|CanvasLayer}
     */
    getLayer(name = 'main') {
        return this.layers[name];
    }

    /**
     * 在全部下级对象中搜索
     * @param key {string} name 或 uuid
     * @return {*}
     */
    find(key) {
        return this.childrenIndex.all[key];
    }

    /**
     * 添加层
     * @param layer {DomLayer|CanvasLayer} 层对象
     * @param [name='main'] {string} 层名称
     * @return module:tigerface-display.Stage
     */
    addLayer(layer, name) {
        let _name = name;
        if (!_name) {
            _name = layer.name;
            if (!_name) {
                _name = 'main';
                this.logger.debug(`未指定 layer 对象的 name，使用缺省 layer 名称 "${_name}"`);
            }
        }
        if (this.getLayer(_name)) this.logger.error(`添加层失败，舞台上已经存在，名为 "${_name}" 的层`);
        this.layers[_name] = layer;
        super.addChild(layer);
        layer._appendToStage_(this);
        this.logger.debug(`已添加名为 "${_name}" 的层`);
        return this;
    }

    /**
     * 添加子对象前调用，覆盖超类方法
     * @param child {module:tigerface-display.DisplayObject} 子对象
     * @return {boolean} 是否允许添加
     * @package
     */
    _onBeforeAddChild_(child) {
        if (!child.isLayer) {
            this.logger.warn('添加失败，Stage 上只能放置 DomLayer、Canvas Layer 或者其子类的实例');
            return false;
        }
        return true;
    }

    /**
     * Dom 鼠标移动事件侦听器
     * @param e {object} 事件数据
     * @package
     */
    _onMouseMove_(e) {
        this.mousePos = e.pos;
        this.children.forEach((child) => {
            if (child instanceof Sprite) {
                child._onStageMouseMove_(e.pos);
            }
        });
    }

    /**
     * Dom 鼠标事件侦听器
     * @param e {object} 事件数据
     * @package
     */
    _onMouseEvents_(e) {
        this.mousePos = e.pos;
        this.children.forEach((child) => {
            if (child instanceof Sprite) {
                child._onStageMouseEvents_(e.eventName, { pos: this.mousePos });
            }
        });
    }

    /**
     * Dom 检查帧速是否设置合理
     * @param v {number} 帧数
     * @return {number} 过滤后的帧数
     * @private
     */
    _checkFPS_(v) {
        // 帧数控制在至少 12 帧
        if (v < 12) {
            this.logger.warn(`帧数 [${this.fps}] 限制为最少 12 帧`);
            return 12;
        } else if (v > 60) {
            this.logger.warn(`帧数 [${this.fps}] 限制为最多 60 帧`);
            return 60;
        }
        return v;
    }

    /**
     * 帧数
     * @member {number}
     */
    set fps(v) {
        this.props.fps = this._checkFPS_(v);
        this.logger.info(`舞台帧速率设置为 ${this.fps}`);

        if (this.frameAdapter) this.frameAdapter.fps = this.fps;
    }

    get fps() {
        return this.props.fps;
    }

    /**
     * 增加封面 Dom
     * @param cover {module:tigerface-display.DomCover}
     * @package
     */
    _addCover_(cover) {
        if (cover.isCover) {
            cover.parent = this;
            this.dom.appendChild(cover.dom);
            this.covers.push(cover);
            this._registerIndex_(cover);
            this._onCoversChanged_();
        }
    }

    /**
     * 注册全舞台索引，name 和 uuid，如果遇到同名的，静默注册失败
     * @param child 待注册的子对象
     * @private
     */
    _registerIndex_(child) {
        if (child.name && !this.childrenIndex.all[child.name]) this.childrenIndex.all[child.name] = child;
        if (!this.childrenIndex.all[child.uuid]) this.childrenIndex.all[child.uuid] = child;
    }

    /**
     * 取消注册全舞台索引，同时删除 name 和 uuid 的索引
     * @param child 待删除的子对象
     * @private
     */
    _unregisterIndex_(child) {
        if (child.name && this.childrenIndex.all[child.name]) delete this.childrenIndex.all[child.name];
        if (this.childrenIndex.all[child.uuid]) delete this.childrenIndex.all[child.uuid];
    }

    /**
     * 封面容器改变时调用，计算封面 z 轴坐标
     * @private
     */
    _onCoversChanged_() {
        setZIndex(this);
    }

    /**
     * 注册下级 Dom，由 Stage 统一管理
     * @param domSprite {module:tigerface-display.DomSprite}
     * @private
     */
    _register_(child) {
        this._registerIndex_(child);
    }

    /**
     * 取消注册
     * @param child
     * @private
     */
    _unregister_(child) {
        const idx = this.domList.indexOf(child);
        this.domList.split(idx, 1);
        this._unregisterIndex_(child);
    }

    _onChildrenChanged_() {
        setZIndex(this);
    }

    /**
     * 显示封面，同一时间仅允许显示一个封面
     * @param cover
     */
    showCover(cover) {
        this.covers.forEach((_cover) => {
            _cover.hide();
        });
        cover.show();
    }

    /**
     * 隐藏封面
     * @param cover
     */
    hideCover(cover) {
        cover.hide();
    }

    /**
     * 签名
     * @private
     */
    _signing_() {
        const sign = 'Paint by TigerFace.js 0.10 - tigerface.org';
        const devicePixelRatio = window.devicePixelRatio || 1;
        const font = `${10 * devicePixelRatio}px Microsoft YaHei`;
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = font;
        const width = ctx.measureText(sign).width + 20;
        const height = 20;
        ctx.canvas.width = width;
        ctx.canvas.height = height * devicePixelRatio;
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';

        // 改变 canvas 尺寸后，原来的设置的 font 失效，再次设置
        ctx.font = font;

        ctx.strokeText(sign, 10, ctx.canvas.height / 2);
        ctx.fillText(sign, 10, ctx.canvas.height / 2);

        const data = ctx.canvas.toDataURL();
        this.setStyle({
            'background-image': `url(${data})`,
            'background-position': 'right bottom',
            'background-repeat': 'no-repeat',
            'background-size': `${T.round(width / devicePixelRatio)}px ${height}px`,
        });
    }
}

export default Stage;
