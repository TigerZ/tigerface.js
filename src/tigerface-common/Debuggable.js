/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 14:08.
 *
 * Debuggable 最底层功能基础类，用来读取环境或设置 debug 标识
 */
export default class Debuggable {

    /**
     * 构造器。debug 状态缺省设置为 true，可通过设置环境变量 process.env.NODE_ENV 为 'production' 全局关闭 debug 状态。
     */
    constructor() {
        this._debugging_ = true;
    }

    /**
     * 读取 debug 状态
     * @returns {boolean} 当前 debug 状态
     */
    get debugging() {
        return process.env.NODE_ENV !== 'production' && this._debugging_;
    }

    /**
     * 设置 debug 状态
     * @param v {boolean} 要设置的 debug 状态
     */
    set debugging(v) {
        this._debugging_ = v;
    }
}
