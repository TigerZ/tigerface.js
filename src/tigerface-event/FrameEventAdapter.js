import EventDispatcher from './EventDispatcher';
import Event from './Event';
/*
 * by David Geary. This code is from the book Core HTML5 Canvas, published by Prentice-Hall in 2012.
 */

let _win = global;
try {
    _win = window;
    window.requestNextAnimationFrame = (function () {
        var originalWebkitRequestAnimationFrame = undefined, wrapper = undefined, callback = undefined,
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

            function (callback, element) {
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
    _win.requestNextAnimationFrame = ((callback, element) => {
        var start, finish, timeout = 0;

        setTimeout(() => {
            start = +new Date();
            callback(start);
            finish = +new Date();

            timeout = 1000 / 60 - (finish - start);

        }, timeout);
    });
}


export default class FrameEventAdapter extends EventDispatcher {
    constructor(setting, handler) {
        super();

        this._destroyed_ = false;

        // 缺省配置
        var _default = {
            fps: 30
        };

        // 合并配置参数
        this.setting = Object.assign(_default, setting);

        this.className = FrameEventAdapter.name;

        this.handler = handler;

        this.lastTime = new Date().getTime();
        this.step = this.setting.fps;
        this.frameLength = 1000 / this.step;

        this._onRedraw_();
        this._onEnterFrame_();

    }

    destroy() {
        this._destroyed_ = true;
    }

    _onRedraw_() {
        if (this._destroyed_) return;
        if (this.handler) {
            this.handler.emit(Event.REDRAW);
        } else {
            this.emit(Event.REDRAW);
        }
        this.requestNextAnimationFrame();
    }

    requestNextAnimationFrame() {
        _win.requestNextAnimationFrame(() => this._onRedraw_());
    }

    _onEnterFrame_ = () => {
        if (this._destroyed_) return;

        var start, finish, timeout=0;

        setTimeout(() => {
            start = +new Date();
            if (this.handler) {
                this.handler.dispatchEvent(Event.ENTER_FRAME);
            } else {
                this.dispatchEvent(Event.ENTER_FRAME);
            }
            finish = +new Date();
            timeout = this.frameLength - (finish - start);
            setTimeout(() => this._onEnterFrame_(), timeout);
        }, timeout);
    }
};
