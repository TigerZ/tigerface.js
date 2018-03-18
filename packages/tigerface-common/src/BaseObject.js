import Logger from "./Logger";

/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 14:08.
 *
 * Debuggable 最底层功能基础类，用来读取环境或设置 debug 标识
 */
export default class BaseObject {
    static logger = Logger.getLogger(BaseObject.name);

    /**
     * 构造器。debug 状态缺省设置为 true，可通过设置环境变量 process.env.NODE_ENV 为 'production' 全局关闭 debug 状态。
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
     * @param props
     */
    assign(...opts) {
        for (let opt of opts) {
            if (opt) {
                this.logger.debug(`设置对象属性`, opt);
                let _opt = Object.assign({}, opt);
                // 删除无效属性
                for (let key in _opt) {
                    if (_opt[key] === undefined || _opt[key] === null) {
                        delete _opt[key];
                        this.logger.debug(`放弃无效属性：${key}`);
                    }
                }
                Object.assign(this, _opt);
            }
        }
    }

    update(options) {
        this.assign(options);
    }
}
