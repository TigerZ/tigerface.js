import EventDispatcher from './EventDispatcher';
import Event from './Event';
import {Logger} from 'tigerface-common';

/*
 * 参考 David Geary 的代码
 */

let _win = global;
if (!_win.requestNextAnimationFrame) {
    try {
        _win = window;
        _win.timeout = 0;
        window.requestNextAnimationFrame = (function () {
            var originalWebkitRequestAnimationFrame = undefined, wrapper = undefined,
                geckoVersion = 0, userAgent = navigator.userAgent, index = 0, self = this;

            // Workaround for Chrome 10 bug where Chrome
            // does not pass the time to the animation function

            if (window.webkitRequestAnimationFrame) {
                // Define the wrapper

                wrapper = function (time) {
                    if (time === undefined) {
                        time = +new Date();
                    }
                    self.callback(time);
                };

                // Make the switch

                originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;

                window.webkitRequestAnimationFrame = function (callback, element) {
                    self.callback = callback;

                    // Browser calls the wrapper and wrapper calls the callback

                    originalWebkitRequestAnimationFrame(wrapper, element);
                }
            }

            // Workaround for Gecko 2.0, which has a bug in
            // mozRequestAnimationFrame() that restricts animations
            // to 30-40 fps.

            if (window.mozRequestAnimationFrame) {
                // Check the Gecko version. Gecko is used by browsers
                // other than Firefox. Gecko 2.0 corresponds to
                // Firefox 4.0.

                index = userAgent.indexOf('rv:');

                if (userAgent.indexOf('Gecko') != -1) {
                    geckoVersion = userAgent.substr(index + 3, 3);

                    if (geckoVersion === '2.0') {
                        // Forces the return statement to fall through
                        // to the setTimeout() function.

                        window.mozRequestAnimationFrame = undefined;
                    }
                }
            }

            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
                || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||

                function (callback) {
                    var start, finish;

                    window.setTimeout(function () {
                        start = +new Date();
                        callback(start);
                        finish = +new Date();

                        self.timeout = 1000 / 60 - (finish - start);

                    }, self.timeout);
                };
        })();

    } catch (e) {
        _win.requestNextAnimationFrame = (function () {
            let timeout = 0;
            return (callback) => {
                var start, finish;

                setTimeout(() => {
                    start = +new Date();
                    callback(start);
                    finish = +new Date();

                    timeout = 1000 / 60 - (finish - start);

                }, timeout);
            };
        })();

    }
}


export default class FrameEventGenerator extends EventDispatcher {
    static logger = Logger.getLogger(FrameEventGenerator.name);

    constructor(setting) {
        super();

        this._destroyed_ = false;

        // 缺省配置
        var _default = {
            fps: 30
        };

        // 合并配置参数
        this.setting = Object.assign(_default, setting);

        this.className = FrameEventGenerator.name;

        this.lastTime = new Date().getTime();
        this.step = this.setting.fps;
        // this.frameLength = 1000 / this.step;

        this.logger.debug('启动帧事件发生器...');
        this._onRedraw_();
        this._onEnterFrame_();

    }

    destroy() {
        this._destroyed_ = true;
    }

    _onRedraw_() {
        if (this._destroyed_) {
            this.logger.debug('重绘引擎已销毁');
            return;
        }

        // this.logger.debug('重绘事件...');

        this.emit(Event.REDRAW);

        this.requestNextAnimationFrame();
    }

    requestNextAnimationFrame() {
        _win.requestNextAnimationFrame(() => this._onRedraw_());
    }

    _onEnterFrame_ = () => {
        if (this._destroyed_) return;

        var start, finish;

        setTimeout(() => {
            start = +new Date();
            this.emit(Event.ENTER_FRAME);
            finish = +new Date();
            this.frameTimeout = 1000 / this.step - (finish - start);
            this._onEnterFrame_();
        }, this.frameTimeout);
    }
}
