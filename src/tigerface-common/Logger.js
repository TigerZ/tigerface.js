import Debuggable from './Debuggable';
import config from 'log-config.json';
import colors from 'colors/safe';

var OFF = 0, ERROR = 1, WARN = 2, INFO = 3, DEBUG = 4, FULL = 99;

function getClassLogLevel(className) {
    return (config["class-log-level"] != undefined && config["class-log-level"][className] != undefined)
        ? Logger.level[config["class-log-level"][className].toUpperCase()] : FULL;
}

function now() {
    let d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
}

/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 23:26.
 */
export default class Logger extends Debuggable {
    static getLogger(clazz) {
        return new Logger(clazz);
    }


    static level = {
        OFF: OFF,
        ERROR: ERROR,
        WARN: WARN,
        INFO: INFO,
        DEBUG: DEBUG,
        FULL: FULL
    };

    constructor(className) {
        super();
        this.clazz = className;
        this._last_debug_time_ = 0;
    }

    static get LOG_LEVEL() {
        let envLevel = process.env.LOG_LEVEL ? Logger.level[process.env.LOG_LEVEL.toUpperCase()] : FULL;
        let localLevel = config["log-level"] ? Logger.level[config["log-level"].toUpperCase()] : FULL;
        return Math.min(envLevel, localLevel);
    }


    info(msg) {
        if (!this.debugging || Logger.LOG_LEVEL < INFO || getClassLogLevel(this.clazz) < INFO) return;
        console.log(colors.green(`${now()} [INFO] ${this.clazz}: ${msg}`));
    }

    warn(msg) {
        if (!this.debugging || Logger.LOG_LEVEL < WARN || getClassLogLevel(this.clazz) < WARN) return;
        console.log(colors.yellow(`${now()} [WARN] ${this.clazz}: ${msg}`));
    }

    error(msg) {
        if (!this.debugging || Logger.LOG_LEVEL < ERROR || getClassLogLevel(this.clazz) < ERROR) return;
        // console.log(`%c${now()} [ERROR] ${this.clazz}: ${msg}`, 'text-decoration:underline;color:red');
        throw new Error(`${now()} [ERROR] ${this.clazz}: ${msg}`);
    }

    _isDebugging_ () {
        return this.debugging && Logger.LOG_LEVEL >= DEBUG && getClassLogLevel(this.clazz) >= DEBUG;
    }

    debug(...msg) {
        if (!this._isDebugging_()) return;
        console.log(colors.blue(`${now()} [DEBUG] ${this.clazz}:`), ...msg);
    }

    debugTimingReset() {
        let t = 0, n = new Date().getTime();
        if (this._last_debug_time_) {
            t = n - this._last_debug_time_;
        }
        this._last_debug_time_ = n;
        return t>60000?'60s more':`${t}ms`;
    }

    debugTiming(...msg) {
        if (!this._isDebugging_()) return;
        console.log(`%c${now()} (+${this.debugTimingReset()}) [DEBUG] ${this.clazz}:`, 'color:blue;font-weight:bold', ...msg);
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