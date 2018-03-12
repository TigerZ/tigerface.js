/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 14:12.
 */

import {Utilities as T, Logger} from 'tigerface-common';
import DomSprite from './DomSprite';
import {Event, FrameEventGenerator} from 'tigerface-event';

export default class Stage extends DomSprite {
    static logger = Logger.getLogger(Stage.name);

    /**
     * 构建舞台
     * @param options 可选项
     * @param dom 舞台节点, 缺省是 document
     */
    constructor(options, dom) {

        let state = Object.assign({
            fps: 30, // 每秒30帧
            width: 402,
            height: 302,
            preventDefault: true,
            style: {'position': DomSprite.Position.RELATIVE}
        }, options);

        super(state, dom);

        // 缺省的相对定位
        // this.setStyle({"position", DomSprite.Position.RELATIVE);

        // 舞台标识
        this.stage = this;

        // 基本信息
        this.className = Stage.name;
        this.name = Stage.name;

        // 如果舞台绑定的是局部 Dom 对象，那么在这个 Dom 对象里绘制签名
        // this._signing_();

        // 增加屏幕方向翻转检测

        window.onOrientationChange = () => {
            let orientation = window.orientation || 0;
            this.dispatchEvent(Event.ORIENTATION_CHANGE, {
                orientation: orientation,
                width: screen.width,
                height: screen.height
            });
        };
        //this.on(Event.ENTER_FRAME, ()=>console.log(this.name+" ENTER_FRAME "+new Date().getSeconds()));
    }

    _checkFPS_(v) {
        // 帧数控制在至少 12 帧
        if (this.state.fps < 12) {
            Stage.logger.warn(`帧数 [${this.fps}] 限制为最少 12 帧`);
            return 12;
        } else if (this.state.fps > 60) {
            Stage.logger.warn(`帧数 [${this.fps}] 限制为最多 60 帧`);
            return 60
        } else
            return v
    }

    set fps(v) {

        this.state.fps = this._checkFPS_(v);
        Stage.logger.info('舞台帧速率设置为 ' + this.state.fps);

        if (this.frameAdapter) this.frameAdapter.destroy();
        this.frameAdapter = new FrameEventGenerator({fps: this.state.fps});
        // Stage.logger.debug('初始化帧事件引擎，帧速率设置为 ' + this.state.fps);

        this.frameAdapter.on(Event.REDRAW, () => this._paint_());
        this.frameAdapter.on(Event.ENTER_FRAME, () => this._onEnterFrame_());
        // Stage.logger.debug('注册帧事件引擎的重绘事件 [Event.REDRAW] 和进入帧事件 [Event.ENTER_FRAME] 侦听器');
    }

    get fps() {
        return this.state.fps;
    }

    _signing_() {
        let sign = "Paint by TigerFace.js 0.10 - tigerface.org";
        let devicePixelRatio = window.devicePixelRatio || 1;
        let font = 10 * devicePixelRatio + "px Microsoft YaHei";
        let ctx = document.createElement("canvas").getContext("2d");
        ctx.font = font;
        let width = ctx.measureText(sign).width + 20;
        let height = 20;
        ctx.canvas.width = width;
        ctx.canvas.height = height * devicePixelRatio;
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";

        // 改变 canvas 尺寸后，原来的设置的 font 失效，再次设置
        ctx.font = font;

        ctx.strokeText(sign, 10, ctx.canvas.height / 2);
        ctx.fillText(sign, 10, ctx.canvas.height / 2);

        let data = ctx.canvas.toDataURL();
        this.setStyle({
            "background-image": "url(" + data + ")",
            "background-position": "right bottom",
            "background-repeat": "no-repeat",
            "background-size": T.round(width / devicePixelRatio) + "px " + height + "px"
        });
    }

}