import SockJS from 'sockjs-client';
import Stomp from '@stomp/stompjs';
import { Utilities as T } from 'tigerface-common';

import DataSource from './DataSource';

class WebsocketDataSource extends DataSource {
    constructor(baseUrl, options) {
        super({
            clazzName: WebsocketDataSource.name,
            destination: '/topic/events',
            debug: true,
            uuid: T.uuid(),
            retryDelay: 5000,
        });
        this.assign({ baseUrl }, options);
        this.subscriptions = {};
    }

    subscribe(destination, callback) {
        const { subscriptions, stompClient } = this;
        if (!stompClient) return;
        subscriptions[destination] = stompClient.subscribe(destination, callback);
    }

    connect() {
        const self = this;
        const {
            baseUrl,
            token,
            destination,
            debug,
            retryDelay,
        } = this;
        const socket = new SockJS(baseUrl);
        this.stompClient = Stomp.over(socket);
        if (!debug) this.stompClient.debug = null;

        this.stompClient.connect({ token }, () => {
            this.subscribe(destination, (data) => {
                const jsonData = JSON.parse(data.body);
                Object.keys(jsonData).forEach((key) => {
                    self.onMessageReceived({
                        eventName: key,
                        data: jsonData[key],
                    });
                });
            });
        });

        socket.onclose = () => {
            this.logger.info(`连接中断，${Math.floor(retryDelay / 1000)} 秒后重试`);
            setTimeout(() => {
                this.connect(token);
            }, retryDelay);
        };
    }

    /**
     * 关闭连接
     */
    close() {
        Object.keys(this.subscriptions).forEach((topic) => {
            this.subscriptions[topic].unsubscribe();
        });

        if (this.stompClient) this.stompClient.disconnect();
    }

    /**
     * 发送消息
     */
    send(message) {
        const { eventName, data, method } = message;

        if (this.stompClient) {
            this.stompClient.send(this.destination, {}, JSON.stringify({
                eventName,
                method,
                data: data || {},
            }));
        }
    }

    upload() {
        this.logger.error('Websocket DataSource 暂时不支持数据上传');
    }
}

export default WebsocketDataSource;
