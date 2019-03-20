/**
 * 事件分派对象 by Tiger zhangyihu@gmail.com MIT Licensed.
 *
 * 2015-05-20：addEventListener 添加次数限制，添加两个便捷方法： addOneTimeEventListener 和 addOneTimeBroadcastListener
 */
import { EventDispatcher } from 'tigerface-event';

class DataEventDispatcher extends EventDispatcher {
    /**
     * 构造器
     */
    constructor(options) {
        super({
            clazzName: DataEventDispatcher.name,
        });
        this.assign(options);
        // 初始化侦听器容器
        this._dataMap_ = {};
        // 事件数据保持10分钟
        this._delay_ = 1000 * 60 * 10;
    }

    /**
     * 获取事件数据
     * @param eventName {string} 事件名称
     * @return {*}
     */
    getData(eventName) {
        const data = this._dataMap_[eventName];
        if (data) {
            if (data.expires >= new Date().getTime()) {
                return data.data;
            }
            // 超时删除数据
            // this._dataMap_[eventName] = undefined;
            delete this._dataMap_[eventName];
        }
        return undefined;
    }

    /**
     * 保存事件数据
     * @param eventName {string} 事件名称
     * @param data {function} 事件数据
     * @private
     */
    _saveData_(eventName, data) {
        const delay = new Date().getTime() + this._delay_;
        this._dataMap_[eventName] = {
            expires: delay,
            data,
        };
        this.logger.debug(`保存事件 [${eventName}] 的数据`);
    }

    /**
     * 发送数据
     * @param eventName {string} 事件名称
     * @param callback {function}
     * @private
     */
    _pushData_(eventName, callback) {
        const data = this.getData(eventName);
        if (data) {
            const e = {
                clazzName: 'Event',
                currentTarget: this,
                target: this,
                eventName,
                stopPropation() {
                    // 仅保留空方法，方式报错
                },
                cancelBubble() {
                    // 仅保留空方法，方式报错
                },
            };

            Object.assign(e, data);
            callback(e);
        }
    }

    /**
     * 侦听事件并且获取当前的数据
     * @param eventName {string} 事件名称
     * @param listener {function} 事件侦听函数
     * @param target {object} 目标对象
     */
    onAndFetch(eventName, listener, target) {
        super.on(eventName, listener, target);
        this._pushData_(eventName, listener);
    }

    /**
     * 覆盖底层的 emit 方法
     * @param eventName {string} 事件名称
     * @param data {object} 数据
     * @param [async=false] {boolean} 是否异步
     * @return {*|boolean|void}
     */
    emit(eventName, data, async = false) {
        this._saveData_(eventName, data);
        return super.emit(eventName, data, async);
    }
}

export default DataEventDispatcher;
