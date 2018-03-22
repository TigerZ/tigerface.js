import { Logger } from 'tigerface-common';
import EventDispatcher from './EventDispatcher';
import Event from './Event';

const win = (() => {
    try {
        return window;
    } catch (e) {
        return global;
    }
})();

if (!win.requestNextAnimationFrame) {
    win.requestNextAnimationFrame = (() =>
            (
                win.requestAnimationFrame ||
                win.webkitRequestAnimationFrame ||
                win.mozRequestAnimationFrame ||
                win.oRequestAnimationFrame ||
                win.msRequestAnimationFrame ||
                ((callback, ctx = win) => {
                    let start;
                    let finish;

                    setTimeout(() => {
                        start = +new Date();
                        callback();
                        finish = +new Date();
                        ctx._requestNextAnimationFrameTimeout_ = (1000 / 60) - (finish - start);
                    }, ctx._requestNextAnimationFrameTimeout_ || (1000 / 60));
                })
            )
    )();
}

/**
 * @memberof module:tigerface-event
 * @extends EventDispatcher
 */
class FrameEventGenerator extends EventDispatcher {
    static logger = Logger.getLogger(FrameEventGenerator.name);

    constructor(options) {
        // 缺省配置
        const props = {
            clazzName: FrameEventGenerator.name,
            fps: 60,
        };

        super(props);

        this.assign(options);

        this._running_ = true;

        this.logger.debug('启动帧事件发生器...');
        this._onRedraw_();
        this._onEnterFrame_();
    }

    get fps() {
        return this.props.fps;
    }

    set fps(v) {
        this.props.fps = v;
        if (this._running_) {
            this.logger.info(`帧速率调整为：${this.fps}`);
        }
    }

    stop() {
        this._running_ = false;
    }

    _onRedraw_() {
        if (!this._running_) {
            this.logger.debug('重绘引擎已停止');
            return;
        }

        this.emit(Event.REDRAW);

        win.requestNextAnimationFrame(() => this._onRedraw_(), this);
    }

    _onEnterFrame_() {
        if (!this._running_) {
            this.logger.debug('进入帧引擎已停止');
            return;
        }

        this.emit(Event.ENTER_FRAME);

        this._requestNextFixFrame_(() => this._onEnterFrame_());
    }

    _requestNextFixFrame_ = (callback) => {
        let start;
        let finish;

        setTimeout(() => {
            start = +new Date();
            callback(start);
            finish = +new Date();
            this._frameTimeout_ = (1000 / this.fps) - (finish - start);
        }, this._frameTimeout_ || (1000 / this.fps));
    };
}

export default FrameEventGenerator;
