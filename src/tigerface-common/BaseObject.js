import {Logger} from "./index";

/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 14:08.
 *
 * Debuggable 最底层功能基础类，用来读取环境或设置 debug 标识
 */
export default class BaseObject {

    /**
     * 构造器。debug 状态缺省设置为 true，可通过设置环境变量 process.env.NODE_ENV 为 'production' 全局关闭 debug 状态。
     */
    constructor(options) {

        this.className = BaseObject.name;

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
                Object.assign(this, opt);
                this.logger.debug(`设置对象属性`, opt);
            }
        }
    }
}
