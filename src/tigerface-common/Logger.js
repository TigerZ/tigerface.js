/* eslint-disable no-console */
import Debuggable from './Debuggable';
import config from 'log-config.json';
import colors from 'colors/safe';

const OFF = 0, ERROR = 1, WARN = 2, INFO = 3, DEBUG = 4, FULL = 99;

function getClassLogLevel(className) {
    return (config["class-log-level"] !== undefined && config["class-log-level"][className] !== undefined)
        ? Logger.level[config["class-log-level"][className].toUpperCase()] : -1;
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
export default class Logger extends Debuggable {
    static getLogger(clazz, instance) {
        return new Logger(clazz, instance);
    }


    static level = {
        OFF: OFF,
        ERROR: ERROR,
        WARN: WARN,
        INFO: INFO,
        DEBUG: DEBUG,
        FULL: FULL
    };

    constructor(className, instance) {
        super();
        this.instance = instance;
        this.clazz = className ? className : (instance && instance.className ? instance.className : '');
        this.name = instance && instance.name ? `[${instance.name}]` : '';
        this._last_debug_time_ = 0;
    }

    static get LOG_LEVEL() {
        let envLevel = process.env.LOG_LEVEL ? Logger.level[process.env.LOG_LEVEL.toUpperCase()] : FULL;
        let localLevel = config["log-level"] ? Logger.level[config["log-level"].toUpperCase()] : FULL;
        return Math.min(envLevel, localLevel);
    }


    info(msg) {
        if (this._isForbidden_(INFO)) return;
        isBrowserEnv() ?
            console.info(`%c${now()} [INFO] ${this.clazz}${this.name}: ${msg}`, 'color:green') :
            console.info(colors.green(`${now()} [INFO] ${this.clazz}${this.name}: ${msg}`));
    }

    warn(msg) {
        if (this._isForbidden_(WARN)) return;
        isBrowserEnv() ? console.warn(`%c${now()} [WARN] ${this.clazz}${this.name}: ${msg}`, 'color:orange') :
            console.warn(colors.yellow(`${now()} [WARN] ${this.clazz}${this.name}: ${msg}`));
    }

    error(msg) {
        // console.error(`${now()} [ERROR] ${this.clazz}: ${msg}`);
        throw new Error(`${now()} [ERROR] ${this.clazz}${this.name}: ${msg}`);
    }

    _isForbidden_(level) {
        let clazzLevel = getClassLogLevel(this.clazz);
        if (clazzLevel >= 0) {
            return clazzLevel < level;
        }
        return Logger.LOG_LEVEL < level;
    }

    debug(...msg) {
        if (this._isForbidden_(DEBUG)) return;
        isBrowserEnv() ? console.debug(`%c${now()} [DEBUG] ${this.clazz}${this.name}:`, 'color:blue', ...msg) :
            console.debug(colors.blue(`${now()} [DEBUG] ${this.clazz}${this.name}:`), ...msg);
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
        isBrowserEnv() ? console.log(`%c${now()} (+${this.debugTimingReset()}) [DEBUG] ${this.clazz}${this.name}:`, 'color:blue;font-weight:bold', ...msg) :
            console.log(colors.blue.bold(`${now()} (+${this.debugTimingReset()}) [DEBUG] ${this.clazz}${this.name}:`), ...msg);
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