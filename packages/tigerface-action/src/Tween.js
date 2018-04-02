/* eslint-disable no-cond-assign,no-return-assign,no-mixed-operators,no-restricted-properties,no-plusplus */
/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 14:06.
 */
/**
 * Linear：无缓动效果； <br>
 * Quadratic：二次方的缓动（t^2）；<br>
 * Cubic：三次方的缓动（t^3）；<br>
 * Quartic：四次方的缓动（t^4）；<br>
 * Quintic：五次方的缓动（t^5）；<br>
 * Sinusoidal：正弦曲线的缓动（sin(t)）；<br>
 * Exponential：指数曲线的缓动（2^t）；<br>
 * Circular：圆形曲线的缓动（sqrt(1-t^2)）；<br>
 * Elastic：指数衰减的正弦曲线缓动；<br>
 * Back：超过范围的三次方缓动（(s+1)*t^3 - s*t^2）；<br>
 * Bounce：指数衰减的反弹缓动。
 *
 * 每个效果都分三个缓动方式（方法），分别是： <br>
 * easeIn：从0开始加速的缓动； <br>
 * easeOut：减速到0的缓动； <br>
 * easeInOut：前半段从0开始加速，后半段减速到0的缓动。 <br>
 * 其中Tween.Linear是无缓动效果。
 *
 * t: current time（当前持续时间）； <br>
 * b: beginning value（初始值）； <br>
 * c: change in value（变化量）； <br>
 * d: duration（持续时间）。
 */

const Event = {
    MOTION_START: 'Event.MOTION_START',
    MOTION_FINISH: 'Event.MOTION_FINISH',
    MOTION_CHANGED: 'Event.MOTION_CHANGED',
    MOTION_STOP: 'Event.MOTION_STOP',
};
const Linear = {
    easeIn(t, b, c, d) {
        return c * t / d + b;
    },
    easeOut(t, b, c, d) {
        return Linear.easeIn(t, b, c, d);
    },
    easeInOut(t, b, c, d) {
        return Linear.easeIn(t, b, c, d);
    },
};
const Quadratic = {
    easeIn(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOut(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
};
const Cubic = {
    easeIn(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOut(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
};
const Quartic = {
    easeIn(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOut(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
};
const Quintic = {
    easeIn(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOut(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
};
const Sinusoidal = {
    easeIn(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOut(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOut(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
};
const Exponential = {
    easeIn(t, b, c, d) {
        return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    easeOut(t, b, c, d) {
        return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOut(t, b, c, d) {
        if (t === 0) return b;
        if (t === d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
};
const Circular = {
    easeIn(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOut(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOut(t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
};
const Elastic = {
    easeIn(t, b, c, d) {
        let s = 1.70158;
        let p = 0;
        let a = c;
        if (t === 0) return b;
        if ((t /= d) === 1) return b + c;
        if (!p) p = d * 0.3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOut(t, b, c, d) {
        let s = 1.70158;
        let p = 0;
        let a = c;
        if (t === 0) return b;
        if ((t /= d) === 1) return b + c;
        if (!p) p = d * 0.3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOut(t, b, c, d) {
        let s = 1.70158;
        let p = 0;
        let a = c;
        if (t === 0) return b;
        if ((t /= d / 2) === 2) return b + c;
        if (!p) p = d * (0.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
};

const Back = {
    easeIn(t, b, c, d) {
        const s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOut(t, b, c, d) {
        const s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOut(t, b, c, d) {
        let s = 1.70158;
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
};
const Bounce = {
    easeIn(t, b, c, d) {
        return c - Bounce.easeOut(d - t, 0, c, d) + b;
    },
    easeOut(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) return c * (7.5625 * t * t) + b;
        else if (t < (2 / 2.75)) return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        else if (t < (2.5 / 2.75)) return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
    },
    easeInOut(t, b, c, d) {
        if (t < d / 2) return Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
        return Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    },
};

module.exports = {
    Event,
    Back,
    Bounce,
    Circular,
    Cubic,
    Elastic,
    Exponential,
    Linear,
    Quadratic,
    Quartic,
    Quintic,
    Sinusoidal,
};
