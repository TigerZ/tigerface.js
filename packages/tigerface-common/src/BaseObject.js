import Logger from './Logger';

/**
 * 最底层功能基础类
 *
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-common
 */
class BaseObject {
    static logger = Logger.getLogger(BaseObject.name);

    /**
     * @param options {object} 可选初始属性
     */
    constructor(options) {
        this.props = {};
        this.state = {};

        this.clazzName = BaseObject.name;

        this.logger = Logger.getLogger(this);

        this.assign(options);
    }

    /**
     * 批量设置对象属性
     * @param opts
     */
    assign(...opts) {
        opts.forEach((opt) => {
            if (opt) {
                this.logger.debug('设置对象属性', opt);
                const filtered = { ...opt };
                // 删除无效属性
                Object.keys(filtered).forEach((key) => {
                    if (filtered[key] === undefined || filtered[key] === null) {
                        delete filtered[key];
                        this.logger.debug(`放弃无效属性：${key}`);
                    }
                });
                Object.assign(this, filtered);
            }
        });
    }

    update(options) {
        this.assign(options);
    }
}

export default BaseObject;
