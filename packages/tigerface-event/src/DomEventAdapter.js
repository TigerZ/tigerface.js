/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */
import $ from 'jquery';
import { Utilities as T, Logger } from 'tigerface-common';
import EventDispatcher from './EventDispatcher';
import Event from './Event';

/**
 * 判断是否支持触摸
 * @return {boolean}
 * @private
 */
function isSupportTouch() {
    try {
        return 'ontouchstart' in window;
    } catch (e) {
        return false;
    }
}

/**
 * 终止事件传播
 * @param e
 * @private
 */
function stopPropagation(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    if (e && e.stopPropagation) {
        e.stopPropagation();
    }
}

/**
 * 向 Dom 对象注册事件侦听器。
 * @param dom
 * @param eventName
 * @param listener
 * @private
 */
function addSystemEventListener(dom, eventName, listener) {
    if (dom.addEventListener) {
        dom.addEventListener(eventName, listener, false);
    } else if (dom.attachEvent) {
        dom.attachEvent(`on${eventName}`, listener);
    }
}


/**
 * @memberof module:tigerface-event
 * @extends EventDispatcher
 */
class DomEventAdapter extends EventDispatcher {
    static logger = Logger.getLogger(DomEventAdapter.name);

    /**
     * 构造器
     * @param dom 页面节点
     * @param options 配置参数
     * @param handler 事件接收对象
     */
    constructor(dom, options, handler) {
        const props = {
            clazzName: DomEventAdapter.name,
            preventDefault: true,
        };

        super(props);

        if (dom === undefined) {
            this.logger.error('对象初始化时发现参数 dom 无效。');
        }

        this.dom = dom;
        this.handler = handler;

        // 设置 tabIndex 属性，否则不会有 focus/blur 事件
        if (T.attr(this.dom, 'tabIndex') === undefined) {
            T.attr(this.dom, 'tabIndex', 1);
        }

        this.assign(options);

        this.bindKeyEventListener();

        this.bindMouseEventListener();

        this.bindTouchEventListener();

        this.bindOtherEventListener();
    }

    /**
     * 系统事件触发时，发布内部同名事件。
     * @param eventName
     * @param e
     * @param data
     * @param preventDefault
     * @returns {boolean}
     */
    dispatchSystemEvent(eventName, e, data, preventDefault) {
        // this.logger.debug(`dispatchSystemEvent()`, eventName, this.handler, e, data);
        const _data = data || {};
        _data.name = eventName;

        _data._OriginalEvent_ = e;

        let ret;
        if (this.handler) {
            ret = this.handler.dispatchEvent(eventName, data);
        } else {
            ret = this.dispatchEvent(eventName, data);
        }

        // 下面几句会导致触摸屏页面不能滚动，根据需要设置。
        // if (preventDefault === true && ret === false) {

        // 当事件任何一个侦听器返回false，会导致系统终止缺省的事件传递
        if (preventDefault || ret === false) {
            // 终止系统事件传播
            stopPropagation(e);
            return false;
        }

        return true;
    }

    bindKeyEventListener() {
        // 键盘按下事件，数据：按键的 keyCode
        addSystemEventListener(window, Event.KeyEvent.KEY_DOWN, (e) => {
            this.dispatchSystemEvent(Event.KeyEvent.KEY_DOWN, e, {
                keyCode: e.keyCode,
            }, false);
        });

        // 键盘松开事件，数据：按键的 keyCode
        addSystemEventListener(window, Event.KeyEvent.KEY_UP, (e) => {
            this.dispatchSystemEvent(Event.KeyEvent.KEY_UP, e, {
                keyCode: e.keyCode,
            }, false);
        });

        // 键盘持续按下事件，数据：按键的 keyCode
        addSystemEventListener(window, Event.KeyEvent.KEY_PRESS, (e) => {
            this.dispatchSystemEvent(Event.KeyEvent.KEY_PRESS, e, {
                keyCode: e.keyCode,
            }, false);
        });
    }

    bindMouseEventListener() {
        // 鼠标键按下事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
        addSystemEventListener(this.dom, Event.MouseEvent.MOUSE_DOWN, (e) => {
            // 如果不是左键，那么放弃
            if (e.which !== undefined && e.which !== 1) return;

            const pos = T.pagePosToDomPos(this.dom, e.pageX, e.pageY);

            // console.log('Event.MouseEvent.MOUSE_DOWN');
            this.dispatchSystemEvent(Event.MouseEvent.MOUSE_DOWN, e, {
                pos,
            }, this.preventDefault);
        });

        // 鼠标键松开事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
        addSystemEventListener(this.dom, Event.MouseEvent.MOUSE_UP, (e) => {
            // 如果不是左键，那么放弃
            if (e.which !== undefined && e.which !== 1) return;

            const pos = T.pagePosToDomPos(this.dom, e.pageX, e.pageY);

            // console.log('Event.MouseEvent.MOUSE_UP');
            this.dispatchSystemEvent(Event.MouseEvent.MOUSE_UP, e, {
                pos,
            }, false);
        });

        // 鼠标移动事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
        addSystemEventListener(this.dom, Event.MouseEvent.MOUSE_MOVE, (e) => {
            const pos = T.pagePosToDomPos(this.dom, e.pageX, e.pageY);
            this.dispatchSystemEvent(Event.MouseEvent.MOUSE_MOVE, e, {
                pos,
            }, this.preventDefault);
        });

        // 鼠标移入事件
        addSystemEventListener(this.dom, Event.MouseEvent.MOUSE_OVER, (e) => {
            const pos = T.pagePosToDomPos(this.dom, e.pageX, e.pageY);
            this.dispatchSystemEvent(Event.MouseEvent.MOUSE_OVER, e, {
                pos,
            }, this.preventDefault);
        });

        // 鼠标移出事件
        addSystemEventListener(this.dom, Event.MouseEvent.MOUSE_OUT, (e) => {
            const pos = T.pagePosToDomPos(this.dom, e.pageX, e.pageY);
            this.dispatchSystemEvent(Event.MouseEvent.MOUSE_OUT, e, {
                pos,
            }, this.preventDefault);
        });

        // 鼠标单击事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
        addSystemEventListener(this.dom, Event.MouseEvent.CLICK, (e) => {
            // 如果不是左键，那么放弃
            if (e.which !== undefined && e.which !== 1) return;

            const pos = T.pagePosToDomPos(this.dom, e.pageX, e.pageY);
            this.dispatchSystemEvent(Event.MouseEvent.CLICK, e, {
                pos,
            }, false);
        });

        // 鼠标双击事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
        addSystemEventListener(this.dom, Event.MouseEvent.DOUBLE_CLICK, (e) => {
            // 如果不是左键，那么放弃
            if (e.which !== undefined && e.which !== 1) return;

            const pos = T.pagePosToDomPos(this.dom, e.pageX, e.pageY);
            this.dispatchSystemEvent(Event.MouseEvent.DOUBLE_CLICK, e, {
                pos,
            }, this.preventDefault);
        });

        // 鼠标右键单击事件，操作：转换鼠标坐标为内部坐标，数据：当前鼠标坐标
        addSystemEventListener(this.dom, Event.MouseEvent.CONTEXT_MENU, (e) => {
            const pos = T.pagePosToDomPos(this.dom, e.pageX, e.pageY);
            this.dispatchSystemEvent(Event.MouseEvent.CONTEXT_MENU, e, {
                pos,
            }, true);
        });
    }

    bindTouchEventListener() {
        if (!isSupportTouch()) return;

        let lastTouches = [];

        // 触摸开始事件，操作：转换触摸点坐标，数据：触摸点（多个）坐标（数组）
        addSystemEventListener(this.dom, Event.TouchEvent.TOUCH_START, (e) => {
            const touches = [];
            lastTouches = [];
            for (let i = 0; i < e.touches.length; i += 1) {
                const touch = e.touches.item(i);
                // console.log(touch.pageX, touch.pageY);
                const pos = T.pagePosToDomPos(this.dom, touch.pageX, touch.pageY);
                touches.push({
                    pos,
                });
                lastTouches.push({
                    start: pos,
                });
            }
            // console.log('Event.TouchEvent.TOUCH_START');
            this.dispatchSystemEvent(Event.TouchEvent.TOUCH_START, e, {
                touches,
            }, false);

            if (touches.length === 1) {
                // console.log('TOUCH_START -> Event.MouseEvent.MOUSE_DOWN');
                this.dispatchSystemEvent(Event.MouseEvent.MOUSE_DOWN, e, {
                    pos: touches[0].pos,
                }, false);
            }
        });

        // 触摸点移动事件，操作：转换触摸点坐标，数据：触摸点（多个）坐标（数组）
        addSystemEventListener(this.dom, Event.TouchEvent.TOUCH_MOVE, (e) => {
            const touches = [];
            for (let i = 0; i < e.touches.length; i += 1) {
                const touch = e.touches.item(i);
                const pos = T.pagePosToDomPos(this.dom, touch.pageX, touch.pageY);
                touches.push({
                    start: lastTouches[i].start,
                    pos,
                });
                lastTouches[i].move = pos;
            }
            // console.log('Event.TouchEvent.TOUCH_MOVE');
            this.dispatchSystemEvent(Event.TouchEvent.TOUCH_MOVE, e, {
                touches,
            }, this.preventDefault);
            if (touches.length === 1) {
                // console.log('MOUSE_MOVE -> Event.MouseEvent.MOUSE_MOVE');
                this.dispatchSystemEvent(Event.MouseEvent.MOUSE_MOVE, e, {
                    pos: touches[0].pos,
                }, this.preventDefault);
            }
        });

        // 触摸结束事件
        addSystemEventListener(this.dom, Event.TouchEvent.TOUCH_END, (e) => {
            const touches = [];
            for (let i = 0; i < lastTouches.length; i += 1) {
                const touch = lastTouches[i];
                touches.push({
                    start: touch.start,
                    pos: touch.move,
                });
            }
            // console.log('Event.TouchEvent.TOUCH_END');
            this.dispatchSystemEvent(Event.TouchEvent.TOUCH_END, e, {
                touches,
            }, this.preventDefault);

            if (touches.length === 1) {
                // console.log('TOUCH_END -> Event.MouseEvent.MOUSE_UP');
                this.dispatchSystemEvent(Event.MouseEvent.MOUSE_UP, e, {}, this.preventDefault);

                if ((!touches[0].pos || touches[0].pos.getDistance(touches[0].start) < 1) &&
                    +new Date() - touches[0].startTime < 500) {
                    // console.log('TOUCH_END -> Event.MouseEvent.CLICK');
                    this.dispatchSystemEvent(Event.MouseEvent.CLICK, e, {
                        pos: touches[0].pos || touches[0].start,
                    }, this.preventDefault);
                }
            }
        });

        // 触摸取消事件
        addSystemEventListener(this.dom, Event.TouchEvent.TOUCH_CANCEL, (e) => {
            // console.log('Event.TouchEvent.TOUCH_CANCEL');
            this.dispatchSystemEvent(Event.TouchEvent.TOUCH_CANCEL, e, {}, this.preventDefault);
        });
    }

    bindOtherEventListener() {
        // 获得焦点事件。注意：页面元素如要获得焦点，需要设置tab
        addSystemEventListener(this.dom, Event.FOCUS, (e) => {
            this.dispatchSystemEvent(Event.FOCUS, e, {}, false);
        });

        // 失去焦点事件
        addSystemEventListener(this.dom, Event.BLUR, (e) => {
            this.dispatchSystemEvent(Event.BLUR, e, {}, false);
        });

        //
        addSystemEventListener(this.dom, Event.TRANSITION_END, (e) => {
            this.dispatchSystemEvent(Event.TRANSITION_END, e, { propertyName: e.propertyName }, false);
        });

        // 滚动条事件
        addSystemEventListener(this.dom, Event.SCROLL, (e) => {
            const $dom = $(this.dom);

            if ($dom.data('_scrollTop_') === undefined) {
                $dom.data('_scrollTop_', this.dom.scrollTop);
                $dom.data('_scrollLeft_', this.dom.scrollLeft);
            }
            const last = { scrollTop: $dom.data('_scrollTop_'), scrollLeft: $dom.data('_scrollLeft_') };
            this.dispatchSystemEvent(Event.SCROLL, e, {
                scrollTop: $dom.scrollTop(),
                scrollLeft: $dom.scrollLeft(),
            }, false);
            if (this.dom.scrollLeft !== last.scrollLeft) {
                if (this.dom.clientWidth + this.dom.scrollLeft >= this.dom.scrollWidth) {
                    this.dispatchSystemEvent(Event.SCROLL_RIGHT, e, {}, false);
                }
                if (this.dom.scrollLeft <= 0) {
                    this.dispatchSystemEvent(Event.SCROLL_LEFT, e, {}, false);
                }
                $dom.data('_scrollLeft_', this.dom.scrollLeft);
            }
            if (this.dom.scrollTop !== last.scrollTop) {
                if (this.dom.clientHeight + this.dom.scrollTop >= this.dom.scrollHeight) {
                    this.dispatchSystemEvent(Event.SCROLL_BOTTOM, e, {}, false);
                }
                if (this.dom.scrollTop <= 0) {
                    this.dispatchSystemEvent(Event.SCROLL_TOP, e, {}, false);
                }
                $dom.data('_scrollTop_', this.dom.scrollTop);
            }
        });

        // 尺寸变化事件
        addSystemEventListener(this.dom, Event.SIZE_CHANGED, (e) => {
            const $dom = $(this.dom);
            this.dispatchSystemEvent(Event.SIZE_CHANGED, e, {
                width: $dom.width(),
                height: $dom.height(),
            }, false);
        });
    }
}

export default DomEventAdapter;
