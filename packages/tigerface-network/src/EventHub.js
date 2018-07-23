import { Logger } from 'tigerface-common';
import { EventDispatcher } from 'tigerface-event';

/**
 * @memberof module:tigerface-event
 * @extends EventDispatcher
 */
class EventHub extends EventDispatcher {
    static logger = Logger.getLogger(EventHub.name);

    static register(name) {
        if (global[name]) EventHub.logger(`全局上下文中已存在 "${name}"，注册失败！`);
        global[name] = new EventHub();
    }

    constructor(options) {
        // 缺省配置
        const props = {
            clazzName: 'EventHub',
            fps: 60,
            dataSources: {},
        };

        super(props);

        this.assign(options);
    }

    addDataSource(name, url, options = {}) {
        const { type } = options;
    }
}

export default EventHub;
