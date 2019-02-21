/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */

import { Utilities as T } from 'tigerface-common';
import DataSource, { Network } from './DataSource';

const { $ } = global;

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
            eventName,
            url,
            httpMethod: type,
            httpData: data,
        } = this._convertHttpMethod_(message);

        this.logger.debug(`send ${type} ${url} data=`, data);

        const jqxhr = $.ajax({
            url,
            cache: false,
            async: true,
            type,
            contentType: 'application/json;charset=utf-8',
            data,
            dataType: 'json',
            crossDomain: true,
        });
        jqxhr.done((jsonData, textStatus, jqXHR) => this._proccess_(eventName, jsonData, textStatus, jqXHR));
        jqxhr.fail((jqXHR, textStatus, errorThrown) => {
            const { status, responseJSON } = jqXHR;
            if ([403, 404, 500].indexOf(status) && responseJSON) {
                this._proccess_(eventName, responseJSON, textStatus, jqXHR);
            } else this.onError(eventName, jqXHR, textStatus, errorThrown);
        });
    }

    _withSeparator_(url, separator) {
        return url.endsWith(separator) ? url : (url + separator);
    }

    _convertHttpMethod_(message) {
        const { eventName, data, method } = message;

        this.logger.debug('_convertHttpMethod_', message);

        let httpMethod;
        let httpData;
        let url = this._withSeparator_(this.baseUrl, '/') + eventName;

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
                httpData = JSON.stringify(data);
                break;
            default:
                break;
        }
        return {
            eventName,
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
    _proccess_(eventName, jsonData, textStatus, jqXHR) {
        this.logger.debug('请求成功返回', eventName, jsonData);
        const eventNames = jqXHR.getResponseHeader('TigerFace-Event');
        this.logger.debug('TigerFace-Event: ', eventNames);
        if (eventNames) {
            if (eventNames.indexOf(',') > -1) {
                const events = eventNames.split(',');
                events.forEach((name) => {
                    name = name.trim();
                    this.onMessageReceived({
                        eventName: name,
                        data: jsonData[name],
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
                eventName,
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
        const url = this._withSeparator_(this.baseUrl, '/') + resourceName;
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
        const url = this._withSeparator_(this.baseUrl, '/') + resourceName;
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
