/* eslint-disable no-console,global-require */
function isBrowserEnv() {
    return typeof window !== 'undefined' && window === global;
}

let config;
if (isBrowserEnv()) {
// eslint-disable-next-line global-require,import/no-unresolved
    config = require('log-config.json');
} else {
// eslint-disable-next-line import/no-dynamic-require,global-require
    config = require(`${process.cwd()}/log-config.json`);
}

function now() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
}

const Level = {
    OFF: 1,
    ERROR: 2,
    WARN: 3,
    INFO: 4,
    DEBUG: 5,
    FULL: 99,
};

const colors = isBrowserEnv() ? {} : require('colors/safe');

function exclude(msg) {
    if (typeof msg !== 'string') return false;
    const keywords = config.exclude || [];
    for (let i = 0; i < keywords.length; i += 1) {
        const keyword = keywords[i];
        if (msg.search(keyword) >= 0) return true;
    }
    return false;
}

function logout(logLevel, target, msg, ...others) {
    if (exclude(msg)) return;
    if (isBrowserEnv()) {
        switch (logLevel) {
            case Level.DEBUG:
                console.debug(`%c${now()} [Level.DEBUG] ${target}: ${msg}`, 'color:blue', ...others);
                break;
            case Level.INFO:
                console.info(`%c${now()} [Level.INFO] ${target}: ${msg}`, 'color:green', ...others);
                break;
            case Level.WARN:
                console.warn(`%c${now()} [Level.WARN] ${target}: ${msg}`, 'color:orange', ...others);
                break;
            case Level.ERROR:
                throw new Error(`${now()} [Level.ERROR] ${target}: ${msg}`);
            default:
                throw new Error(`不支持的 Logger 级别: ${logLevel}`);
        }
    } else {
        switch (logLevel) {
            case Level.DEBUG:
                console.debug(colors.blue(`${now()} [Level.DEBUG] ${target}: ${msg}`), ...others);
                break;
            case Level.INFO:
                console.info(colors.green(`${now()} [Level.INFO] ${target}: ${msg}`), ...others);
                break;
            case Level.WARN:
                console.info(colors.green(`${now()} [Level.INFO] ${this.target}: ${msg}`), ...others);
                break;
            case Level.ERROR:
                throw new Error(`${now()} [Level.ERROR] ${target}: ${msg}`);
            default:
                throw new Error(`不支持的 Logger 级别: ${logLevel}`);
        }
    }
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
            Level[process.env.LOG_LEVEL.toUpperCase()] : Level.ERROR;
        const localLevel = config['log-level'] ? Level[config['log-level'].toUpperCase()] : Level.ERROR;
        return Math.min(envLevel, localLevel);
    }

    _isForbidden_(level) {
        if (!this.debugging) return true;
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

    info(msg, ...others) {
        if (this._isForbidden_(Level.INFO)) return;
        logout(Level.INFO, this.target, msg, ...others);
    }

    warn(msg, ...others) {
        if (this._isForbidden_(Level.WARN)) return;
        logout(Level.WARN, this.target, msg, ...others);
    }

    error(msg, ...others) {
        if (this._isForbidden_(Level.ERROR)) return;
        logout(Level.ERROR, this.target, msg, ...others);
    }

    debug(msg, ...others) {
        if (this._isForbidden_(Level.DEBUG)) return;
        logout(Level.DEBUG, this.target, msg, ...others);
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

    debugTiming(msg, ...others) {
        if (this._isForbidden_(Level.DEBUG)) return;
        logout(Level.DEBUG, this.target, msg, ...others);
    }

    debugTimingBegin(msg, ...others) {
        this.debugTimingReset();
        this.debugTiming(msg, ...others);
    }

    debugTimingEnd(msg, ...others) {
        this.debugTiming(msg, ...others);
        this.debugTimingReset();
    }
}

export default Logger;
