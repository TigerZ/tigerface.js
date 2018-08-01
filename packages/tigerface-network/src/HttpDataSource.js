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
import { Utilities as T } from 'tigerface-common';
import DataSource, { Network } from './DataSource';

const $ = global;

const HttpMethod = {
    GET: 'GET',
    FIND: 'GET',
    ADD: 'POST',
    MODIFY: 'PUT',
    REMOVE: 'DELETE',
};

class HttpDataSource extends DataSource {
    constructor(baseUrl, options) {
        super({
            clazzName: HttpDataSource.name,
        });
        this.assign({ baseUrl }, options);
    }

    /**
     * Http没有长连接，所以用发送心跳来验证连接。
     *
     * @private
     */
    connect() {
        this.sendHeartBeat();
    }

    /**
     * 根据数据操作方法，设置http方法，Restful风格
     * @param jsonData
     * @param method
     * @private
     */
    send(message) {
        const {
            event,
            url,
            httpMethod: type,
            httpData: data,
        } = this._convertHttpMethod_(message);

        $.ajax({
            url,
            cache: false,
            async: true,
            type,
            contentType: 'application/json;charset=UTF-8',
            data,
            dataType: 'json',
            crossDomain: true,
            success: (jsonData, textStatus, jqXHR) => this._proccess_(event, jsonData, textStatus, jqXHR),
            error: (XMLHttpRequest, textStatus, errorThrown) => this.onError(event, XMLHttpRequest, textStatus, errorThrown),
        });
    }

    _withSeparator_(url, separator) {
        return url.endsWith(separator) ? url : (url + separator);
    }

    _convertHttpMethod_(message, method) {
        const { event, data } = message;

        let httpMethod;
        let httpData;
        let url = this._withSeparator_(this.baseUrl, '/') + event;

        switch (method) {
            case Network.Method.GET:
                httpMethod = HttpMethod.GET;
                url = `${url}/${data.id}`;
                break;
            case Network.Method.FIND:
                httpMethod = HttpMethod.FIND;
                httpData = data;
                break;
            case Network.Method.ADD:
                httpMethod = HttpMethod.ADD;
                httpData = JSON.stringify(data);
                break;
            case Network.Method.MODIFY:
                httpMethod = HttpMethod.MODIFY;
                if (data.id !== undefined) url = `${url}/${data.id}`;
                httpData = JSON.stringify(data);
                break;
            case Network.Method.REMOVE:
                httpMethod = HttpMethod.REMOVE;
                if (data.id !== undefined) url = `${url}/${data.id}`;
                httpData = data;
                break;
            default:
                break;
        }
        return {
            event,
            url,
            httpMethod,
            httpData,
        };
    }

    /**
     * 数据返回，调用超类实现数据事件分发
     * @param jsonData
     * @param textStatus
     * @param jqXHR
     * @private
     */
    _proccess_(event, jsonData, textStatus, jqXHR) {
        const eventNames = jqXHR.getResponseHeader('TigerFace-Event');
        if (eventNames) {
            if (eventNames.indexOf(',') > -1) {
                const events = eventNames.split(',');
                events.forEach((eventName) => {
                    eventName = T.trim(eventName);
                    this.onMessageReceived({
                        eventName,
                        data: jsonData[eventName],
                    });
                });
            } else {
                this.onMessageReceived({
                    eventName: eventNames,
                    data: jsonData,
                });
            }
        } else {
            this.onMessageReceived({
                eventName: event,
                data: jsonData,
            });
        }
    }

    _onUploadProgress_() {
        // 进度事件
        const xhr = $.ajaxSettings.xhr();
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', (evt) => {
                if (evt.lengthComputable) {
                    const percentComplete = T.round(evt.loaded / evt.total, 2);
                    this.dispatchEvent(Network.Event.PROCESS_CHANGED, { value: percentComplete });
                }
            }, false);
        }
        xhr.addEventListener('progress', (evt) => {
            if (evt.lengthComputable) {
                const percentComplete = T.round(evt.loaded / evt.total, 2);
                this.dispatchEvent(Network.Event.PROCESS_CHANGED, { value: percentComplete });
            }
        }, false);

        return xhr;
    }

    upload(resourceName, form) {
        const formData = new FormData(form);
        let url = this._withSeparator_(this.baseUrl, '/') + resourceName;
        $.ajax({
            type: 'POST',
            url,
            crossDomain: true,
            contentType: false,
            processData: false,
            data: formData,
            dataType: 'json',
            cache: false,
            xhr: () => this._onUploadProgress_(),
            success: (data, textStatus, jqXHR) => {
                this.dispatchEvent(Network.Event.PROCESS_CHANGED, { value: 100 });
                this.dispatchEvent(Network.Event.UPLOAD_SUCCESS);
                this._proccess_('UPLOAD', data, textStatus, jqXHR);
            },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
                this.dispatchEvent(Network.Event.PROCESS_CHANGED, { value: 0 });
                this.dispatchEvent(Network.Event.UPLOAD_FAILED);
                this.onError('UPLOAD', XMLHttpRequest, textStatus, errorThrown);
            },
        });
        // 开始上传后,初始化进度条
        this.dispatchEvent(Network.Event.PROCESS_CHANGED, { value: 0 });
    }

    uploadData(resourceName, data) {
        let url = this._withSeparator_(this.baseUrl, '/') + resourceName;
        $.ajax({
            type: 'POST',
            url,
            crossDomain: true,
            data,
            dataType: 'json',
            cache: false,
            success: (jsonData, textStatus, jqXHR) => {
                this.dispatchEvent(Network.Event.UPLOAD_SUCCESS);
                this._proccess_('UPLOAD_DATA', jsonData, textStatus, jqXHR);
            },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
                this.dispatchEvent(Network.Event.UPLOAD_FAILED);
                this.onError('UPLOAD_DATA', XMLHttpRequest, textStatus, errorThrown);
            },
        });
    }
}

export default HttpDataSource;
