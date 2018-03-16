/* eslint-disable no-console */
const path = require("path");
let config = {};
if(isBrowserEnv()) {
    config = require('log-config.json');
} else {
    config = require(path.join(process.cwd(),'log-config.json'));
}

import colors from 'colors/safe';

const OFF = 0, ERROR = 1, WARN = 2, INFO = 3, DEBUG = 4, FULL = 99;

function getClassLogLevel(clazz) {
    return (config["class-log-level"] !== undefined && config["class-log-level"][clazz] !== undefined)
        ? Logger.level[config["class-log-level"][clazz].toUpperCase()] : -1;
}

function now() {
    let d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
}

function isBrowserEnv() {
    return typeof window !== "undefined" && window === global;
}

/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 23:26.
 */
export default class Logger {
    static getLogger(arg) {
        return new Logger(arg);
    }


    static level = {
        OFF: OFF,
        ERROR: ERROR,
        WARN: WARN,
        INFO: INFO,
        DEBUG: DEBUG,
        FULL: FULL
    };

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
            else if (this._target_.clazz) return this._target_.clazz;
        }

        return '';
    }

    get clazz() {
        if (this._name_) return this._name_;

        if (this._target_) {
            if (this._target_.clazz) return this._target_.clazz;
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
        let envLevel = process.env.LOG_LEVEL ? Logger.level[process.env.LOG_LEVEL.toUpperCase()] : FULL;
        let localLevel = config["log-level"] ? Logger.level[config["log-level"].toUpperCase()] : FULL;
        return Math.min(envLevel, localLevel);
    }


    info(msg) {
        if (this._isForbidden_(INFO)) return;
        isBrowserEnv() ?
            console.info(`%c${now()} [INFO] ${this.target}: ${msg}`, 'color:green') :
            console.info(colors.green(`${now()} [INFO] ${this.target}: ${msg}`));
    }

    warn(msg) {
        if (this._isForbidden_(WARN)) return;
        isBrowserEnv() ? console.warn(`%c${now()} [WARN] ${this.target}: ${msg}`, 'color:orange') :
            console.warn(colors.yellow(`${now()} [WARN] ${this.target}: ${msg}`));
    }

    error(msg) {
        // console.error(`${now()} [ERROR] ${this.target}: ${msg}`);
        throw new Error(`${now()} [ERROR] ${this.target}: ${msg}`);
    }

    _isForbidden_(level) {
        let targetLevel = getClassLogLevel(this.target);

        if (targetLevel >= 0) {
            return targetLevel < level;
        }

        let clazzLevel = getClassLogLevel(this.clazz);

        if (clazzLevel >= 0) {
            return clazzLevel < level;
        }

        return Logger.LOG_LEVEL < level;
    }

    debug(...msg) {
        if (this._isForbidden_(DEBUG)) return;
        isBrowserEnv() ? console.debug(`%c${now()} [DEBUG] ${this.target}:`, 'color:blue', ...msg) :
            console.debug(colors.blue(`${now()} [DEBUG] ${this.target}:`), ...msg);
    }

    debugTimingReset() {
        let t = 0, n = new Date().getTime();
        if (this._last_debug_time_) {
            t = n - this._last_debug_time_;
        }
        this._last_debug_time_ = n;
        return t > 60000 ? '60s more' : `${t}ms`;
    }

    debugTiming(...msg) {
        if (this._isForbidden_(DEBUG)) return;
        isBrowserEnv() ? console.log(`%c${now()} (+${this.debugTimingReset()}) [DEBUG] ${this.target}:`, 'color:blue;font-weight:bold', ...msg) :
            console.log(colors.blue.bold(`${now()} (+${this.debugTimingReset()}) [DEBUG] ${this.target}:`), ...msg);
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