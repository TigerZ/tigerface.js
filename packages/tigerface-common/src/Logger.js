/* eslint-disable no-console */
import colors from 'colors/safe';

function isBrowserEnv() {
    return typeof window !== 'undefined' && window === global;
}

let config = {};
if (isBrowserEnv()) {
// eslint-disable-next-line global-require,import/no-unresolved
    config = require('log-config.json');
} else {
// eslint-disable-next-line import/no-dynamic-require,global-require
    config = require(`${process.cwd()}/log-config.json`);
}

const OFF = 0;
const ERROR = 1;
const WARN = 2;
const INFO = 3;
const DEBUG = 4;
const FULL = 99;

const Level = {
    OFF,
    ERROR,
    WARN,
    INFO,
    DEBUG,
    FULL,
};

function now() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
}

function getClassLogLevel(clazzName) {
    return (config['class-log-level'] !== undefined && config['class-log-level'][clazzName] !== undefined)
        ? Level[config['class-log-level'][clazzName].toUpperCase()] : -1;
}

/**
 * 日志类
 *
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-common
 */
class Logger {
    static getLogger(arg) {
        return new Logger(arg);
    }

    constructor(arg) {
        this._debugging_ = true;

        if (typeof arg === 'object') {
            this._target_ = arg;
        } else if (typeof arg === 'string') {
            this._name_ = arg;
        }
        this._last_debug_time_ = 0;
    }

    get target() {
        if (this._name_) return this._name_;

        if (this._target_) {
            if (this._target_.name) return this._target_.name;
            else if (this._target_.clazzName) return this._target_.clazzName;
        }

        return '';
    }

    get clazzName() {
        if (this._name_) return this._name_;

        if (this._target_) {
            if (this._target_.clazzName) return this._target_.clazzName;
        }

        return '';
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

    static get LOG_LEVEL() {
        const envLevel = process.env.LOG_LEVEL ?
            Level[process.env.LOG_LEVEL.toUpperCase()] : FULL;
        const localLevel = config['log-level'] ? Level[config['log-level'].toUpperCase()] : FULL;
        return Math.min(envLevel, localLevel);
    }


    info(msg) {
        if (this._isForbidden_(INFO)) return;
        if (isBrowserEnv()) {
            console.info(`%c${now()} [INFO] ${this.target}: ${msg}`, 'color:green');
        } else {
            console.info(colors.green(`${now()} [INFO] ${this.target}: ${msg}`));
        }
    }

    warn(msg) {
        if (this._isForbidden_(WARN)) return;
        if (isBrowserEnv()) {
            console.warn(`%c${now()} [WARN] ${this.target}: ${msg}`, 'color:orange');
        } else {
            console.warn(colors.yellow(`${now()} [WARN] ${this.target}: ${msg}`));
        }
    }

    error(msg) {
        // console.error(`${now()} [ERROR] ${this.target}: ${msg}`);
        throw new Error(`${now()} [ERROR] ${this.target}: ${msg}`);
    }

    _isForbidden_(level) {
        const targetLevel = getClassLogLevel(this.target);

        if (targetLevel >= 0) {
            return targetLevel < level;
        }

        const clazzLevel = getClassLogLevel(this.clazzName);

        if (clazzLevel >= 0) {
            return clazzLevel < level;
        }

        return Logger.LOG_LEVEL < level;
    }

    debug(...msg) {
        if (this._isForbidden_(DEBUG)) return;
        if (isBrowserEnv()) {
            console.debug(`%c${now()} [DEBUG] ${this.target}:`, 'color:blue', ...msg);
        } else {
            console.debug(colors.blue(`${now()} [DEBUG] ${this.target}:`), ...msg);
        }
    }

    debugTimingReset() {
        let t = 0;
        const n = new Date().getTime();
        if (this._last_debug_time_) {
            t = n - this._last_debug_time_;
        }
        this._last_debug_time_ = n;
        return t > 60000 ? '60s more' : `${t}ms`;
    }

    debugTiming(...msg) {
        if (this._isForbidden_(DEBUG)) return;
        if (isBrowserEnv()) {
            console.log(`%c${now()} (+${this.debugTimingReset()}) [DEBUG] ${this.target}:`, 'color:blue;font-weight:bold', ...msg);
        } else {
            console.log(colors.blue.bold(`${now()} (+${this.debugTimingReset()}) [DEBUG] ${this.target}:`), ...msg);
        }
    }

    debugTimingBegin(...msg) {
        this.debugTimingReset();
        this.debugTiming(...msg);
    }

    debugTimingEnd(...msg) {
        this.debugTiming(...msg);
        this.debugTimingReset();
    }
}

export default Logger;
