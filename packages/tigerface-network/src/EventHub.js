import { Logger } from 'tigerface-common';
import DataEventDispatcher from './DataEventDispatcher';

/**
 * @memberof module:tigerface-network
 * @extends DataEventDispatcher
 */
class EventHub extends DataEventDispatcher {
    // static logger = Logger.getLogger(EventHub.name);

    static register(name) {
        if (global[name]) EventHub.logger(`全局上下文中已存在 "${name}"，注册失败！`);
        global[name] = new EventHub();
        return global[name];
    }

    constructor(options) {
        // 缺省配置
        const props = {
            clazzName: EventHub.name,
            fps: 60,
            dataSources: {},
        };

        super(props);
        this.assign(options);
    }

    addDS(name, ds) {
        this.dataSources[name] = ds;
        ds.addEventSubscriber(this);
    }

    ds(name) {
        if (name) return this.dataSources[name];
        return Object.values(this.dataSources)[0];
    }
}

export default EventHub;
