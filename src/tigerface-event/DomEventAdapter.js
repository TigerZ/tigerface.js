/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */
import $ from 'jquery';
import {Utilities as T, Logger} from 'tigerface-common';
import {Point} from 'tigerface-shape';
import EventDispatcher from './EventDispatcher';
import Event from './Event';

export default class DomEventAdapter extends EventDispatcher {
    static logger = Logger.getLogger(DomEventAdapter.name);

    /**
     * 构造器
     * @param dom 页面节点
     * @param setting 配置参数
     */
    constructor(dom, setting, handler) {

        super();

        if (dom == undefined)
            DomEventAdapter.logger.error(`[${this.className}]:对象初始化时发现参数 dom 无效。`);

        this.dom = dom;

        this.handler = handler;

        this.className = DomEventAdapter.name;

        // 合并配置参数
        this.setting = Object.assign({
            preventDefault: false
        }, setting);

        DomEventAdapter.logger.debug(`[${this.className}]:初始化参数：`, this.setting);

        // 设置 tabIndex 属性，否则不会有 focus/blur 事件
        if (T.attr(this.dom, "tabIndex") == undefined) {
            T.attr(this.dom, "tabIndex", 1);
        }

        var self = this;
        this.adapters = function () {
            var adapters = [];
            /**
             * 键盘按下事件，数据：按键的 keyCode
             * @param e
             */
            adapters[Event.KeyEvent.KEY_DOWN] = function (e) {
                self.dispatchSystemEvent(Event.KeyEvent.KEY_DOWN, e, {
                    keyCode: e.keyCode
                }, false);
            };
            /**
             * 键盘松开事件，数据：按键的 keyCode
             * @param e
             */
            adapters[Event.KeyEvent.KEY_UP] = function (e) {
                self.dispatchSystemEvent(Event.KeyEvent.KEY_UP, e, {
                    keyCode: e.keyCode
                }, false);
            };
            /**
             * 键盘持续按下事件，数据：按键的 keyCode
             * @param e
             */
            adapters[Event.KeyEvent.KEY_PRESS] = function (e) {
                self.dispatchSystemEvent(Event.KeyEvent.KEY_PRESS, e, {
                    keyCode: e.keyCode
                }, false);
            };
            /**
             * 鼠标键按下事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
             * @param e
             */
            adapters[Event.MouseEvent.MOUSE_DOWN] = function (e) {
                // 如果不是左键，那么放弃
                if (e.which != undefined && e.which != 1) return;

                var pos = self._pageToDom_(e.pageX, e.pageY);

                //console.log("Event.MouseEvent.MOUSE_DOWN");
                self.dispatchSystemEvent(Event.MouseEvent.MOUSE_DOWN, e, {
                    pos: pos
                }, self.setting.preventDefault);
            };
            /**
             * 鼠标键松开事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
             * @param e
             */
            adapters[Event.MouseEvent.MOUSE_UP] = function (e) {
                // 如果不是左键，那么放弃
                if (e.which != undefined && e.which != 1) return;

                var pos = self._pageToDom_(e.pageX, e.pageY);

                //console.log("Event.MouseEvent.MOUSE_UP");
                self.dispatchSystemEvent(Event.MouseEvent.MOUSE_UP, e, {
                    pos: pos
                }, self.setting.preventDefault);
            };
            /**
             * 鼠标移动事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
             * @param e
             */
            adapters[Event.MouseEvent.MOUSE_MOVE] = function (e) {

                var pos = self._pageToDom_(e.pageX, e.pageY);
                // DomEventAdapter.logger.debug(`系统事件：MOUSE_MOVE`, pos);
                self.dispatchSystemEvent(Event.MouseEvent.MOUSE_MOVE, e, {
                    pos: pos
                }, self.setting.preventDefault);

            };
            /**
             * 鼠标移入事件
             * @param e
             */
            adapters[Event.MouseEvent.MOUSE_OVER] = function (e) {
                var pos = self._pageToDom_(e.pageX, e.pageY);
                self.dispatchSystemEvent(Event.MouseEvent.MOUSE_OVER, e, {
                    pos: pos
                }, self.setting.preventDefault);
            };
            /**
             * 鼠标移出事件
             * @param e
             */
            adapters[Event.MouseEvent.MOUSE_OUT] = function (e) {
                var pos = self._pageToDom_(e.pageX, e.pageY);
                self.dispatchSystemEvent(Event.MouseEvent.MOUSE_OUT, e, {
                    pos: pos
                }, self.setting.preventDefault);
            };
            /**
             * 鼠标单击事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
             * @param e
             */
            adapters[Event.MouseEvent.CLICK] = function (e) {
                // 如果不是左键，那么放弃
                if (e.which != undefined && e.which != 1) return;

                var pos = self._pageToDom_(e.pageX, e.pageY);
                self.dispatchSystemEvent(Event.MouseEvent.CLICK, e, {
                    pos: pos
                }, self.setting.preventDefault);
            };
            /**
             * 鼠标双击事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
             * @param e
             */
            adapters[Event.MouseEvent.DOUBLE_CLICK] = function (e) {
                // 如果不是左键，那么放弃
                if (e.which != undefined && e.which != 1) return;

                var pos = self._pageToDom_(e.pageX, e.pageY);
                self.dispatchSystemEvent(Event.MouseEvent.DOUBLE_CLICK, e, {
                    pos: pos
                }, self.setting.preventDefault);
            };
            /**
             * 鼠标右键单击事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
             * @param e
             */
            adapters[Event.MouseEvent.CONTEXT_MENU] = function (e) {
                var pos = self._pageToDom_(e.pageX, e.pageY);
                self.dispatchSystemEvent(Event.MouseEvent.CONTEXT_MENU, e, {
                    pos: pos
                }, true);
            };

            /**
             * 触摸开始事件，操作：转换触摸点坐标，数据：触摸点（多个）坐标（数组）
             * @param e
             */
            var lastTouches = [];
            adapters[Event.TouchEvent.TOUCH_START] = function (e) {
                var touches = [];
                lastTouches = [];
                for (var i = 0; i < e.touches.length; i++) {
                    var touch = e.touches.item(i);
                    //console.log(touch.pageX, touch.pageY);
                    var pos = self._pageToDom_(touch.pageX, touch.pageY);
                    touches.push({
                        pos: pos
                    });
                    lastTouches.push({
                        start: pos
                    });
                }
                //console.log("Event.TouchEvent.TOUCH_START");
                self.dispatchSystemEvent(Event.TouchEvent.TOUCH_START, e, {
                    touches: touches
                }, self.setting.preventDefault);

                if (touches.length === 1) {
                    //console.log("TOUCH_START -> Event.MouseEvent.MOUSE_DOWN");
                    self.dispatchSystemEvent(Event.MouseEvent.MOUSE_DOWN, e, {
                        pos: touches[0].pos
                    }, self.setting.preventDefault);
                }
            };
            /**
             * 触摸点移动事件，操作：转换触摸点坐标，数据：触摸点（多个）坐标（数组）
             * @param e
             */
            adapters[Event.TouchEvent.TOUCH_MOVE] = function (e) {
                var touches = [];
                for (var i = 0; i < e.touches.length; i++) {
                    var touch = e.touches.item(i);
                    var pos = self._pageToDom_(touch.pageX, touch.pageY);
                    touches.push({
                        start: lastTouches[i].start,
                        pos: pos
                    });
                    lastTouches[i]["move"] = pos;
                }
                //console.log("Event.TouchEvent.TOUCH_MOVE");
                self.dispatchSystemEvent(Event.TouchEvent.TOUCH_MOVE, e, {
                    touches: touches
                }, self.setting.preventDefault);
                if (touches.length === 1) {
                    //console.log("MOUSE_MOVE -> Event.MouseEvent.MOUSE_MOVE");
                    self.dispatchSystemEvent(Event.MouseEvent.MOUSE_MOVE, e, {
                        pos: touches[0].pos
                    }, self.setting.preventDefault);
                }
            };
            /**
             * 触摸结束事件
             * @param e
             */
            adapters[Event.TouchEvent.TOUCH_END] = function (e) {
                var touches = [];
                for (var i = 0; i < lastTouches.length; i++) {
                    var touch = lastTouches[i];
                    touches.push({
                        start: touch.start,
                        pos: touch.move
                    });
                }
                //console.log("Event.TouchEvent.TOUCH_END");
                self.dispatchSystemEvent(Event.TouchEvent.TOUCH_END, e, {
                    touches: touches
                }, self.setting.preventDefault);

                if (touches.length === 1) {
                    //console.log("TOUCH_END -> Event.MouseEvent.MOUSE_UP");
                    self.dispatchSystemEvent(Event.MouseEvent.MOUSE_UP, e, {}, self.setting.preventDefault);

                    if ((!touches[0].pos || touches[0].pos.getDistance(touches[0].start) < 1) &&
                        +new Date() - touches[0].startTime < 500) {
                        //console.log("TOUCH_END -> Event.MouseEvent.CLICK");
                        self.dispatchSystemEvent(Event.MouseEvent.CLICK, e, {
                            pos: touches[0].pos || touches[0].start
                        }, self.setting.preventDefault);
                    }
                }
            };
            /**
             * 触摸取消事件
             * @param e
             */
            adapters[Event.TouchEvent.TOUCH_CANCEL] = function (e) {
                //console.log("Event.TouchEvent.TOUCH_CANCEL");
                self.dispatchSystemEvent(Event.TouchEvent.TOUCH_CANCEL, e, {}, self.setting.preventDefault);
            };
            /**
             * 失去焦点事件
             * @param e
             */
            adapters[Event.BLUR] = function (e) {
                self.dispatchSystemEvent(Event.BLUR, e, {}, false);
            };
            /**
             * 获得焦点事件。注意：页面元素如要获得焦点，需要设置tab
             * @param e
             */
            adapters[Event.FOCUS] = function (e) {
                self.dispatchSystemEvent(Event.FOCUS, e, {}, false);
            };

            adapters[Event.TRANSITION_END] = function (e) {
                self.dispatchSystemEvent(Event.TRANSITION_END, e, {propertyName: e.propertyName}, false);
            };

            /**
             * 滚动条事件
             * @param e
             */
            adapters[Event.SCROLL] = function (e) {
                var $dom = $(self.dom);

                if ($dom.data("_scrollTop_") === undefined) {
                    $dom.data("_scrollTop_", self.dom.scrollTop);
                    $dom.data("_scrollLeft_", self.dom.scrollLeft);
                }
                var last = {scrollTop: $dom.data("_scrollTop_"), scrollLeft: $dom.data("_scrollLeft_")}
                self.dispatchSystemEvent(Event.SCROLL, e, {
                    scrollTop: $dom.scrollTop(),
                    scrollLeft: $dom.scrollLeft()
                }, false);
                if (self.dom.scrollLeft != last.scrollLeft) {
                    if (self.dom.clientWidth + self.dom.scrollLeft >= self.dom.scrollWidth) {
                        self.dispatchSystemEvent(Event.SCROLL_RIGHT, e, {}, false);
                    }
                    if (self.dom.scrollLeft <= 0) {
                        self.dispatchSystemEvent(Event.SCROLL_LEFT, e, {}, false);
                    }
                    $dom.data("_scrollLeft_", self.dom.scrollLeft);
                }
                if (self.dom.scrollTop != last.scrollTop) {
                    if (self.dom.clientHeight + self.dom.scrollTop >= self.dom.scrollHeight) {
                        self.dispatchSystemEvent(Event.SCROLL_BOTTOM, e, {}, false);
                    }
                    if (self.dom.scrollTop <= 0) {
                        self.dispatchSystemEvent(Event.SCROLL_TOP, e, {}, false);
                    }
                    $dom.data("_scrollTop_", self.dom.scrollTop);
                }
            };

            /**
             * 尺寸变化事件
             * @param e
             */
            adapters[Event.RESIZE] = function (e) {
                var $dom = $(self.dom);
                self.dispatchSystemEvent(Event.RESIZE, e, {
                    width: $dom.width(),
                    height: $dom.height()
                }, false);
            };

            return adapters;
        }();

        this._bindEventListener_();

    }

    /**
     * 转换页面坐标为内部坐标
     * 注意：当 DOM 旋转后，得到的是外接矩形的内部坐标！！！
     * @param pageX
     * @param pageY
     * @returns {Point}
     * @private
     */
    _pageToDom_(pageX, pageY) {
        var pos = $(this.dom).offset();
        if (this.dom === document)
            return new Point(pageX, pageY);
        else {
            var offsetLeft = parseFloat(T.css(this.dom, "margin-left")) + parseFloat(T.css(this.dom, "padding-left"));
            var offsetTop = parseFloat(T.css(this.dom, "margin-top")) + parseFloat(T.css(this.dom, "padding-top"));
            return new Point(pageX - pos.left + offsetLeft, pageY - pos.top + offsetTop);
        }
    }

    /**
     * 终止事件传播
     * @param e
     */
    _stopPropagation_(e) {
        if (e && e.preventDefault)
            e.preventDefault();
        if (e && e.stopPropagation)
            e.stopPropagation();
    }

    /**
     * 系统事件触发时，发布内部同名事件。
     * @param eventName
     * @param e
     * @param data
     * @returns {boolean}
     */
    dispatchSystemEvent(eventName, e, data, preventDefault) {
        // DomEventAdapter.logger.debug(`dispatchSystemEvent()`, eventName, this.handler, e, data);
        data || (data = {});
        data.name = eventName;

        data["_OriginalEvent_"] = e;

        var ret;
        if (this.handler) {
            ret = this.handler.dispatchEvent(eventName, data);
        } else {
            ret = this.dispatchEvent(eventName, data);
        }

        // 下面几句会导致触摸屏页面不能滚动，根据需要设置。
        //if (preventDefault === true && ret === false) {

        // 当事件任何一个侦听器返回false，会导致系统终止缺省的事件传递
        if (preventDefault || ret === false) {
            // 终止系统事件传播
            this._stopPropagation_(e);
            return false;
        }
    }

    /**
     * 向 Dom 对象注册事件侦听器。
     * @param dom
     * @param eventName
     */
    addSystemEventListener(dom, eventName) {
        if (dom.addEventListener) {
            dom.addEventListener(eventName, this.adapters[eventName], false);
        } else if (dom.attachEvent) {
            dom.attachEvent('on' + eventName, this.adapters[eventName]);
        }
    }

    _isSupportTouch_() {
        try {
            return "ontouchstart" in window;
        } catch (e) {
            return false;
        }
    }

    /**
     * 注册全部系统事件
     * @private
     */
    _bindEventListener_() {
        // Keyboard Events
        this.addSystemEventListener(window, Event.KeyEvent.KEY_DOWN);
        this.addSystemEventListener(window, Event.KeyEvent.KEY_UP);
        this.addSystemEventListener(window, Event.KeyEvent.KEY_PRESS);

        // Mouse Events
        this.addSystemEventListener(this.dom, Event.MouseEvent.MOUSE_DOWN);
        this.addSystemEventListener(this.dom, Event.MouseEvent.MOUSE_UP);
        this.addSystemEventListener(this.dom, Event.MouseEvent.MOUSE_MOVE);
        this.addSystemEventListener(this.dom, Event.MouseEvent.MOUSE_OVER);
        this.addSystemEventListener(this.dom, Event.MouseEvent.MOUSE_OUT);
        this.addSystemEventListener(this.dom, Event.MouseEvent.CLICK);
        this.addSystemEventListener(this.dom, Event.MouseEvent.DOUBLE_CLICK);
        this.addSystemEventListener(this.dom, Event.MouseEvent.CONTEXT_MENU);

        // Touch Events
        if (this._isSupportTouch_()) {
            this.addSystemEventListener(this.dom, Event.TouchEvent.TOUCH_START);
            this.addSystemEventListener(this.dom, Event.TouchEvent.TOUCH_MOVE);
            this.addSystemEventListener(this.dom, Event.TouchEvent.TOUCH_END);
            this.addSystemEventListener(this.dom, Event.TouchEvent.TOUCH_CANCEL);
        }

        // Focus Events
        this.addSystemEventListener(this.dom, Event.FOCUS);
        this.addSystemEventListener(this.dom, Event.BLUR);

        this.addSystemEventListener(this.dom, Event.TRANSITION_END);

        // Scroll Event
        this.addSystemEventListener(this.dom, Event.SCROLL);
    }
}