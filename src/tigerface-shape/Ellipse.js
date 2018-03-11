/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 12:58.
 */

import Point from './Point';
import {Utilities as T, Logger} from 'tigerface-common';
import Sector from "./Sector";

/**
 * 椭圆
 *
 * @type {*|void}
 */
export default class Ellipse extends Sector {
    static logger = Logger.getLogger(Ellipse.name);

    constructor(x, y, radiusX, radiusY, precision) {
        super(x, y, radiusX, radiusY, 0, 360, precision);
        this.className = Ellipse.name;
    }

    clone() {
        return new Ellipse(this.p0.x, this.p0.y, this.radiusX, this.radiusY, this.precision);
    }

    /**
     * 点碰撞
     * @param point 碰撞点
     * @returns {boolean}
     */
    hitTestPoint(p) {
        // 点与椭圆位置关系公式
        //点在圆内： x0^2/a^2+y0^2/b^2＜1
        //点在圆上： x0^2/a^2+y0^2/b^2=1
        //点在圆外： x0^2/a^2+y0^2/b^2＞1
        return Math.pow(p.x - this.p0.x, 2) / Math.pow(this.radiusX, 2) + Math.pow(p.y - this.p0.y, 2) / Math.pow(this.radiusY, 2) <= 1;
    }
}