/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */

/**
 * 网络模块的功能支持WebSocket、长轮询(GET/POST)、长连接(GET/POST)、HTTP(GET/POST/PUT/DELETE)
 * 设计思路：<br>
 *     MessageAdapter是消息传递的规范类和各种网络连接实现的基类。
 *     前后台消息通信的复杂度来源于两个方面：数据操作的多样性和网络连接类型的多样性
 *     MessageAdapter负责把数据操作规范成：<br>
 *         doGet（通过 id 获取唯一数据）
 *         doFind（通过组合条件，获取一或多条数据）
 *         doAdd（新增一条数据）
 *         doModify（修改一条数据的内容）
 *         doRemove（删除一条数据）
 *         dispatchServerEvent（分发服务器事件）
 *
 *     网络连接通过实现不同的子类实现适配：<br>
 *         各自类根据自身的网络连接特点实现上述规范的数据操作
 *
 *     接口的衔接：<br>
 *         前台通过统一的 DataEventDispatcher 消息分发机制调用
 *         后台通过不同语言实现的后台适配器调用业务系统接口适配器
 *
 */

import { EventDispatcher } from 'tigerface-event';

export const Network = {
    isSupportWebSocket() {
        if (window.WebSocket || window.MozWebSocket) return true;
        return false;
    },

    Type: {
        WebSocket: 'WebSocket',
        Rest: 'Rest',
        LongPolling: 'LongPolling',
    },

    State: {
        CLOSED: 'CLOSED',
        CONNECTED: 'CONNECTED',
        CONNECTING: 'CONNECTING',
        ERROR: 'ERROR',
    },

    Event: {
        CONNECTED: 'CONNECTED',
        CLOSED: 'CLOSED',
        MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
        PROCESS_CHANGED: 'PROCESS_CHANGED',
        PROCESS_COMPLETE: 'PROCESS_COMPLETE',
        UPLOAD_FAILED: 'UPLOAD_FAILED',
        UPLOAD_SUCCESS: 'UPLOAD_SUCCESS',
    },

    Method: {
        GET: 'GET',
        FIND: 'FIND',
        ADD: 'ADD',
        MODIFY: 'MODIFY',
        REMOVE: 'REMOVE',
    },
};

const HeartBeatMessageName = '_HEART_BEAT_';

class DataSource extends EventDispatcher {
    constructor(options) {
        super({
            clazzName: DataSource.name,
            connectTest: true,
            state: Network.State.CLOSED,
            uuid: undefined,
        });

        this.assign(options);

        this.addEventListener(HeartBeatMessageName, () => this.onHeartBeat());
    }

    /**
     * 连接服务器
     */
    connect() {
        this.logger.error('connect 方法必须被子类实现');
    }

    /**
     * 关闭连接
     */
    close() {
        this.logger.error('close 方法必须被子类实现');
    }

    /**
     * 发送消息
     */
    send() {
        this.logger.error('send 方法必须被子类实现');
    }

    upload() {
        this.logger.error('upload 方法必须被子类实现');
    }

    /**
     * 通过 id 获取唯一数据
     *
     * @param resourceName 资源名称
     * @param id 资源ID
     * @returns {*}
     */
    getByID(resourceName, id) {
        this.logger.debug('getByID ${resourceName} id=${id}');
        const message = {
            eventName: resourceName,
            from: this.uuid,
            method: Network.Method.GET,
            data: { id },
        };
        return this.send(message, Network.Method.GET);
    }

    /**
     * 通过组合条件，获取一或多条数据
     *
     * @param resourceName 资源名称
     * @param conditions 条件
     * @returns {*}
     */
    find(resourceName, conditions) {
        const message = {
            eventName: resourceName,
            from: this.uuid,
            method: Network.Method.FIND,
            data: conditions,
        };
        return this.send(message, Network.Method.FIND);
    }

    /**
     * 新增一条数据
     * @param resourceName 资源名称
     * @param entity 资源对象
     * @returns {*}
     */
    add(resourceName, entity) {
        const message = {
            eventName: resourceName,
            from: this.uuid,
            method: Network.Method.ADD,
            data: entity,
        };
        return this.send(message, Network.Method.ADD);
    }

    /**
     * 修改一条数据的内容
     *
     * @param resourceName
     * @param entity
     * @returns {*}
     */
    modify(resourceName, entity) {
        const message = {
            eventName: resourceName,
            from: this.uuid,
            method: Network.Method.MODIFY,
            data: entity,
        };
        return this.send(message, Network.Method.MODIFY);
    }

    /**
     * 删除一条数据
     *
     * @param resourceName
     * @param conditions
     * @returns {*}
     */
    remove(resourceName, conditions) {
        const message = {
            eventName: resourceName,
            from: this.uuid,
            method: Network.Method.REMOVE,
            data: conditions,
        };
        return this.send(message, Network.Method.REMOVE);
    }

    /**
     * 发布命令
     *
     * @param event
     * @param data
     * @returns {*}
     */
    sendEvent(event, data) {
        return this.add(event, data);
    }

    /**
     * 发送心跳命令，调用 dispatchServerEvent 方法实现
     *
     * @returns {*}
     */
    sendHeartBeat() {
        if (this.connectTest) {
            return this.sendEvent(HeartBeatMessageName, { uuid: this.uuid });
        }
        return true;
    }

    /**
     * 心跳返回
     * @param e
     */
    onHeartBeatReceived(uuid) {
        this.logger.debug(`心跳请求成功返回：{uuid:${uuid}}`);
        this.uuid = uuid;
        this.onConnected();
    }

    /**
     * 连接成功。Http 方法，不存在永久的连接，所以应该执行一次 sendHeartBeat 确认服务器的正确性。
     */
    onConnected() {
        this.state = Network.State.CONNECTED;
        this.dispatchEvent(Network.Event.CONNECTED);
        this.logger.debug('数据源状态为 "已连接"');
    }

    /**
     * 连接关闭。
     */
    onClosed() {
        this.state = Network.State.CLOSED;
        this.dispatchEvent(Network.Event.CLOSED);
        this.logger.debug('数据源状态为 "已关闭"');
    }

    /**
     * 消息到达
     * 如果消息是心跳请求，返回从服务器发回的 uuid
     * 如果是普通消息，发送数据事件
     */
    onMessageReceived(e) {
        this.state = Network.State.CONNECTED;
        const { eventName, data } = e;
        if (eventName === HeartBeatMessageName) {
            this.onHeartBeatReceived(data.uuid);
        } else {
            this.dispatchEvent(Network.Event.MESSAGE_RECEIVED, data);
            this.dispatchEvent(eventName, data);
        }
    }

    /**
     * 错误发生，指网络错误，请求超时，数据格式错误等，不包括业务异常，业务异常应该通过 onMessage 方式到达。
     * 如果错误发生在心跳请求上，连接状态为 closed
     * 如果错误发生在一般请求上，状态为 error
     */
    onError(eventName, ...error) {
        if (eventName === HeartBeatMessageName) {
            this.onClosed();
        } else {
            this.state = Network.State.ERROR;
            this.dispatchEvent(Network.Event.ERROR, ...error);
        }
    }
}

export default DataSource;
