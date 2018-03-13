import EventEmitter from "events";
import {withMix, BaseObject, Logger} from 'tigerface-common';
import Event from './Event';

/**
 * 在用 ES6 改写 TigerfaceJS 框架时, 此类彻底重写.
 * 用 node.js 的 EventEmitter 作为事件引擎, 不再自己实现.
 * 此类仅部分兼容之前的用法, 简化了下面方法:
 * 1. 指定次数的侦听器
 * 2. 广播事件
 * 3. 注册侦听器时的缺省数据, 请在侦听函数内部自己实现
 * 4. 注册侦听器时指定 this 对象, 请使用箭头函数或使用 bind(this)
 */
class EventDispatcher extends BaseObject {
    static logger = Logger.getLogger(EventDispatcher.name);

    /**
     * 构造器
     */
    constructor(...args) {
        super();
        this.className = EventDispatcher.name;
        // 如果存在 mixin 进来的构造方法，执行
        this.construct && this.construct(...args);
    }
}

const MAX_LISTENERS = 100;

/**
 * 导出 EventDispatcher 的基本功能，是为了让其他类可以不从 EventDispatcher 继承，而使用 mixin 方式集成事件
 */
export const Mixin = {
    /**
     * 构造器。内部缺省事件侦听器最大数量限制为 100，可通过设置环境变量 MAX_EVENT_LISTENERS 来改变此限制。
     */
    construct() {
    },

    /**
     * 此类支持 Mixin 方式与其他类整合, 那种情况下 constructor 不会被正确执行.
     *  _getEmitter_ 提供一种懒加载的方式, 即使 constructor 没有被执行, this._eventEmitter_ 依然会被初始化并被返回.
     * @returns {*}
     */
    _getEmitter_() {
        if (!this._eventEmitter_) {
            this._eventEmitter_ = new EventEmitter();

            let maxNum = (process.env.MAX_LISTENERS && process.env.MAX_LISTENERS > MAX_LISTENERS) ? process.env.MAX_LISTENERS : MAX_LISTENERS;

            if (process.env.MAX_LISTENERS) {
                EventDispatcher.logger.info(`环境变量 MAX_LISTENERS = ${process.env.MAX_LISTENERS}`);
                if (process.env.MAX_LISTENERS < MAX_LISTENERS)
                    EventDispatcher.logger.info(`环境变量 MAX_LISTENERS <= 缺省设置(${MAX_LISTENERS})，被忽略`);
            }

            this._eventEmitter_.setMaxListeners(maxNum);
        }
        return this._eventEmitter_;
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
            EventDispatcher.logger.debug(`添加事件订阅者`, subscriber, this.getEventSubscribers());
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
    addEventListener(eventName, listener) {
        if (!eventName) EventDispatcher.logger.error(`注册事件侦听器时，事件名称不能为 ${eventName}`);
        if (!listener || typeof listener !== 'function') EventDispatcher.logger.error(`注册事件侦听器时，必须传入有效的 function 类型的侦听器`);
        this.on(eventName, listener);
    },

    /**
     * 直接提供 this._eventEmitter_ 的 on 方法
     * @param eventName
     * @param listener
     */
    on(eventName, listener) {
        if (!this.containsListener(eventName, listener)) {
            this._getEmitter_().on(eventName, listener);
            EventDispatcher.logger.debug(`添加事件侦听器 [${eventName}]：`, listener);
        }
    },

    /**
     * 一次性侦听器
     * @param eventName
     * @param listener
     */
    addOneTimeEventListener(eventName, listener) {
        this.once(eventName, listener);
    },

    /**
     * 直接提供 this._eventEmitter_ 的 once 方法
     * @param eventName
     * @param listener
     */
    once(eventName, listener) {
        if (!this.containsListener(eventName, listener)) {
            this._getEmitter_().once(eventName, listener);
            EventDispatcher.logger.debug(`添加一次性事件侦听器 [${eventName}]：`, listener);
        }
    },

    /**
     * 触发事件
     * @param eventName
     * @param data 提交给事件的数据
     */
    dispatchEvent(eventName, data) {
        this.emit(eventName, data);
        if (this.debugging && this.getEventSubscribers().length > 0)
            EventDispatcher.logger.debug(`向事件 ${this.getEventSubscribers().length} 个订阅者转发事件`);
        this.getEventSubscribers().map((subscriber) => {
            subscriber.dispatchEvent && subscriber.dispatchEvent(eventName, data);
        });
    },

    /**
     * 直接提供 this._eventEmitter_ 的 emit 方法.
     * 此处有个重要改变, 第二个参数为直接传入的 data, 不是 e 对象.
     * TODO: 检查全部 tigerfacejs 内部的调用, 修改第二个参数的使用
     * @param eventName
     * @param data
     */
    emit(eventName, data) {

        let e = {
            className: "Event",
            currentTarget: this,
            eventName: eventName
        };
        Object.assign(e, data);
        this._getEmitter_().emit(eventName, e);

        if (this.debugging && !this._isNoise_(eventName))
            EventDispatcher.logger.debug(`已执行发送事件 [${eventName}]`, data);
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
            Event.STATUS_CHANGED,
            Event.ENTER_FRAME,
            Event.MOVE,
            ...Object.values(Event.MouseEvent)
        ].includes(eventName);
    },

    /**
     * 发送异步事件
     * @param eventName {string}
     * @param data {object}
     */
    dispatchAsyncEvent(eventName, data) {
        // setTimeout(()=>this.emit(eventName, data), 10);
        process.nextTick(() => this.emit(eventName, data));
        EventDispatcher.logger.debug(`已安排发送异步事件 [${eventName}] `, data);
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
    //         className: "Event",
    //         currentTarget: this,
    //         eventName: eventName
    //     };
    //     Object.assign(e, data);
    //     win.postMessage(JSON.stringify(e), "*");
    //     EventDispatcher.logger.debug(`发送跨窗口事件 [${eventName}]`, data);
    // }
}

export default withMix(EventDispatcher, Mixin);