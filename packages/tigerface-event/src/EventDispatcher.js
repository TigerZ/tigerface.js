import EventEmitter from 'events';
import { withMix, BaseObject, Logger } from 'tigerface-common';
import Event from './Event';

/**
 * 在用 ES6 改写 TigerfaceJS 框架时, 此类彻底重写.
 * 用 node.js 的 EventEmitter 作为事件引擎, 不再自己实现.
 * 此类仅部分兼容之前的用法, 简化了下面方法:
 * 1. 指定次数的侦听器
 * 2. 广播事件
 * 3. 注册侦听器时的缺省数据, 请在侦听函数内部自己实现
 * 4. 注册侦听器时指定 this 对象, 请使用箭头函数或使用 bind(this)
 *
 * @memberof module:tigerface-event
 * @extends BaseObject
 */
class EventDispatcher extends BaseObject {
    static logger = Logger.getLogger(EventDispatcher.name);

    /**
     * 构造器
     */
    constructor(options) {
        const props = {
            clazzName: 'EventDispatcher',
        };
        super(props);

        this.assign(options);
        // 如果存在 mixin 进来的构造方法，执行
        // eslint-disable-next-line no-unused-expressions
        this.construct && this.construct(options);
    }
}

const MAX_LISTENERS = 200;

/**
 * 导出 EventDispatcher 的基本功能，是为了让其他类可以不从 EventDispatcher 继承，而使用 mixin 方式集成事件
 * @memberof module:tigerface-event
 */
export const Mixin = {
    /**
     * 构造器
     */
    construct() {
        this.targets = {};
    },

    /**
     * 此类支持 Mixin 方式与其他类整合, 那种情况下 constructor 不会被正确执行.
     *  _getEmitter_ 提供一种懒加载的方式, 即使 constructor 没有被执行, this._eventEmitter_ 依然会被初始化并被返回.
     * @returns {*}
     */
    _getEmitter_() {
        if (!this._eventEmitter_) {
            this._eventEmitter_ = new EventEmitter();

            const maxNum = (process.env.MAX_LISTENERS && process.env.MAX_LISTENERS > MAX_LISTENERS) ? process.env.MAX_LISTENERS : MAX_LISTENERS;

            if (process.env.MAX_LISTENERS) {
                EventDispatcher.logger.info(`环境变量 MAX_LISTENERS = ${process.env.MAX_LISTENERS}`);
                if (process.env.MAX_LISTENERS < MAX_LISTENERS) {
                    EventDispatcher.logger.info(`环境变量 MAX_LISTENERS <= 缺省设置(${MAX_LISTENERS})，被忽略`);
                }
            }

            this._eventEmitter_.setMaxListeners(maxNum);
        }
        return this._eventEmitter_;
    },

    _getTargetListeners_(target) {
        if (!this.targets[target]) {
            this.targets[target] = [];
        }
        return this.targets[target];
    },

    /**
     * 保存目标对象注册的事件侦听器，用于以后集中销毁
     * @param target {object} 目标对象
     * @param eventName {string} 事件名称
     * @param listener {function} 侦听器
     * @private
     */
    _saveTargetListener_(target, eventName, listener) {
        const listeners = this._getTargetListeners_(target);
        listeners.push({ target, eventName, listener });
    },

    /**
     * 销毁目标对象注册的全部事件侦听器
     * @param target {object} 目标对象
     */
    destroyTargetListeners(target) {
        const listeners = this._getTargetPool_(target);
        listeners.forEach((listener) => {
            this.removeEventListener(listener.target, listener.eventName, listener.listener);
        });
        delete this.targets[target];
    },

    /**
     * 获得全部事件订阅者
     * @returns {Array} 订阅者数组
     */
    getEventSubscribers() {
        if (!this._eventSubscribers_) {
            this._eventSubscribers_ = [];
        }
        return this._eventSubscribers_;
    },

    /**
     * 添加事件订阅者
     * @param subscriber (object extends EventDispatcher) {Object}
     */
    addEventSubscriber(subscriber) {
        if (!this.getEventSubscribers().includes(subscriber)) {
            this.getEventSubscribers().push(subscriber);
            EventDispatcher.logger.debug('添加事件订阅者', subscriber, this.getEventSubscribers());
        }
    },

    /**
     * 获取事件侦听函数列表
     * @param eventName {String} 事件名称
     * @returns {Array} 此事件已注册的侦听器
     */
    getEventListeners(eventName) {
        return this._getEmitter_().listeners(eventName);
    },

    /**
     * 获取事件侦听函数列表，此方法内部调用 getEventListeners
     * @param eventName {String} 事件名称
     * @returns {Array} 此事件已注册的侦听器
     */
    getEventListenerList(eventName) {
        EventDispatcher.logger.info('方法 getEventListenerList 不建议继续使用，后续版本将移除此方法');
        return this.getEventListeners(eventName);
    },

    /**
     * 注册事件侦听函数
     * @param eventName {string} 事件名称
     * @param listener {function} 事件侦听器
     */
    addEventListener(eventName, listener, target) {
        if (!eventName) EventDispatcher.logger.error(`注册事件侦听器时，事件名称不能为 ${eventName}`);
        if (!listener || typeof listener !== 'function') EventDispatcher.logger.error('注册事件侦听器时，必须传入有效的 function 类型的侦听器');
        this.on(eventName, listener, target);
    },

    /**
     * 直接提供 this._eventEmitter_ 的 on 方法
     * @param eventName
     * @param listener
     */
    on(eventName, listener, target) {
        if (!this.containsListener(eventName, listener)) {
            this._getEmitter_().on(eventName, listener);
            EventDispatcher.logger.debug(`添加事件侦听器 [${eventName}]：`, listener);

            if (target) this._saveTargetListener_(target, eventName, listener);
        }
    },

    /**
     * 一次性侦听器
     * @param eventName
     * @param listener
     */
    addOneTimeEventListener(eventName, listener, target) {
        this.once(eventName, listener, target);
    },

    /**
     * 直接提供 this._eventEmitter_ 的 once 方法
     * @param eventName
     * @param listener
     */
    once(eventName, listener, target) {
        if (!this.containsListener(eventName, listener)) {
            this._getEmitter_().once(eventName, listener);
            EventDispatcher.logger.debug(`添加一次性事件侦听器 [${eventName}]：`, listener);

            if (target) this._saveTargetListener_(target, eventName, listener);
        }
    },

    /**
     * 触发事件
     * @param eventName
     * @param data 提交给事件的数据
     * @return {boolean}
     */
    dispatchEvent(eventName, data) {
        const bubble = this.emit(eventName, data);
        if (this.debugging && this.getEventSubscribers().length > 0) {
            EventDispatcher.logger.debug(`向事件 ${this.getEventSubscribers().length} 个订阅者转发事件`);
        }
        this.getEventSubscribers().forEach((subscriber) => {
            if (subscriber.dispatchEvent) {
                subscriber.dispatchEvent(eventName, data);
            }
        });
        return bubble;
    },

    /**
     * 直接提供 this._eventEmitter_ 的 emit 方法.
     * 第二个参数为直接传入的 data 对象，此对象将会合并为 e.
     * 注意 data 不要覆盖 e 的关键字：clazzName, currentTarget, target, eventName, stopPropation, cancelBubble
     *
     * @param eventName
     * @param data 发送的数据
     * @return {boolean}
     */
    emit(eventName, data, async = false) {
        if (!this._isNoise_(eventName)) this.logger.debug(`发布事件 ${eventName}`, data || '');
        let bubble = true;
        const self = this;
        const e = {
            clazzName: 'Event',
            currentTarget: this,
            target: this,
            eventName,
            stopPropation() {
                bubble = false;
                if (eventName !== 'mousemove' && eventName !== 'mousemoveunbounded') {
                    self.logger.debug('stopPropation', `${eventName} 事件侦听器中止了事件冒泡`);
                }
            },
            cancelBubble() {
                bubble = false;
                if (eventName !== 'mousemove' && eventName !== 'mousemoveunbounded') {
                    self.logger.debug('cancelBubble', `${eventName} 事件侦听器中止了事件冒泡`);
                }
            },
        };
        Object.assign(e, data);

        if (async) {
            this._asyncEmit_(eventName, e);
        } else {
            this._emit_(eventName, e);
        }

        return bubble;
    },

    _emit_(eventName, e) {
        this._getEmitter_().emit(eventName, e);
        if (this.debugging && !this._isNoise_(eventName)) {
            EventDispatcher.logger.debug(`已执行发送事件 [${eventName}]`, e);
        }
    },

    _asyncEmit_(eventName, e) {
        if (process && process.nextTick) {
            process.nextTick(() => this._emit_(eventName, e));
        } else {
            setTimeout(() => this._emit_(eventName, e), 0);
        }
    },

    /**
     * 判断是否忽略的事件，用于内部监控
     * @param eventName 事件名称
     * @returns {boolean} 判断结果
     * @private
     */
    _isNoise_(eventName) {
        return [
            Event.BEFORE_REDRAW,
            Event.REDRAW,
            Event.AFTER_REDRAW,
            Event.STATE_CHANGED,
            Event.ENTER_FRAME,
            Event.MOVE,
            Event.MouseEvent.MOUSE_MOVE,
            // ...Object.values(Event.MouseEvent),
        ].includes(eventName);
    },

    /**
     * 发送异步事件
     * @param eventName {string}
     * @param data {object}
     */
    dispatchAsyncEvent(eventName, data) {
        this.asyncEmit(eventName, data);
    },

    asyncEmit(eventName, data) {
        EventDispatcher.logger.debug(`已安排发送异步事件 [${eventName}] `, data);
        this.emit(eventName, data, true);
    },

    /**
     * 移除指定的事件侦听器
     * @param eventName
     * @param listener
     */
    removeEventListener(eventName, listener) {
        this._getEmitter_().removeListener(eventName, listener);
        EventDispatcher.logger.debug(`已删除事件 [${eventName}] 的侦听器：`, listener);
    },

    /**
     * 移除指定事件的全部侦听器
     * @param eventName
     */
    removeAllEventListeners(eventName) {
        this._getEmitter_().removeAllListeners(eventName);
        EventDispatcher.logger.debug(`已删除事件 [${eventName}] 的全部侦听器`);
    },

    /**
     * 判断事件侦听是否存在
     * 注意: 使用数组的 includes 方法
     * @param eventName
     * @param listener
     * @returns {*|boolean}
     */
    containsListener(eventName, listener) {
        return this.getEventListeners(eventName).includes(listener);
    },

    /**
     * 直接提供 this._eventEmitter_ 的 setMaxListeners 方法.
     * 注意: tigerfacejs 里没有应用场景
     * @param n
     */
    setMaxListeners(n) {
        EventDispatcher.logger.debug(`设置最大侦听器数量为 ${n}`);
        this._getEmitter_().setMaxListeners(n);
    },

    /**
     * 注册跨窗口事件侦听
     */
    // registerCrossWinEvent() {
    //     let self = this;
    //     //接收跨文档消息
    //     window.addEventListener('message', (e) => {
    //         if (e.data) {
    //             try {
    //                 let w = JSON.parse(e.data);
    //                 if (w && w.eventName)
    //                     self.dispatchAsyncEvent(w.eventName, w.data);
    //             } catch (e) {
    //             }
    //         }
    //     });
    // },

    /**
     * 触发跨窗口事件
     * TODO: 此方法待测试
     * @param eventName
     * @param data
     * @param win
     */
    // dispatchEventCrossWindow(eventName, data, win) {
    //     let e = {
    //         clazzName: 'Event',
    //         currentTarget: this,
    //         eventName: eventName
    //     };
    //     Object.assign(e, data);
    //     win.postMessage(JSON.stringify(e), '*');
    //     EventDispatcher.logger.debug(`发送跨窗口事件 [${eventName}]`, data);
    // }
};

export default withMix(EventDispatcher, Mixin);
