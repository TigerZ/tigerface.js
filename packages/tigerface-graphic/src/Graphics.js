/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */

import Context from './Context';
import plugins from './plugins';

/*
static PointStyle = {
        SOLID: 'solid_circle', // 实心圆
        HOLLOW: 'hollow_circle', // 空心圆
        MULTIPLICATION: 'multiplication_sign', // 乘号
        PLUS: 'plus_sign', // 加号
        DEFAULT: 'hollow_circle', // 缺省是空心圆
    };
    static LineStyle = {
        SOLID: 'solid', // 实线
        DOT: 'dot', // 点虚线 .....
        DASH: 'dash', // 划虚线 -----
        DASHDOT: 'dashdot', // 划点虚线 _._._._._
        DASHDOTDOT: 'dashdotdot', // 划点点虚线 _.._.._..
        DEFAULT: 'solid', // 缺省是实线
    };
    static ArrowStyle = {
        NONE: 'none', // 箭头
        LINE: 'line',
        WHITE: 'white',
        BLACK: 'black',
        WHITE_DIAMOND: 'white_diamond',
        BLACK_DIAMOND: 'black_diamond',
        DEFAULT: 'line',
    };
    static DrawStyle = {
        NONE: 'none',
        STROKE: 'stroke',
        FILL: 'fill',
        STROKE_FILL: 'stroke_fill',
        DEFAULT: 'stroke',
    };

    this.PointStyle = Graphics.PointStyle;
        this.LineStyle = Graphics.LineStyle;
        this.ArrowStyle = Graphics.ArrowStyle;
        this.DrawStyle = Graphics.DrawStyle;

        this.lineStyle = {
            dotLength: 3 * this.lineWidth,
            dashLength: 9 * this.lineWidth,
            blankLength: 3 * this.lineWidth,
        };

        this.autoApply = true;
        this._saved_ = {};
 */

class Graphics extends Context {
    constructor(...args) {
        super(...args);
        Object.assign(this, plugins);
    }

    get canvas() {
        return this.context.canvas;
    }

    flipH(height) {
        this.translate(0, height);
        this.scale(1, -1);
    }

    flip(width) {
        this.translate(width, 0);
        this.scale(-1, 1);
    }
}

export default Graphics;

