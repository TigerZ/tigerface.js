/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 12:58.
 */
import Polygon from "./Polygon";
import Point from './Point';
import {Utilities as T, Logger} from 'tigerface-common';
/**
 * 椭圆
 *
 * @type {*|void}
 */
export default class Ellipse extends Polygon {
    static logger = Logger.getLogger(Ellipse.name);

    constructor(x, y, radiusX, radiusY, precision) {
        super();
        this.p0 = new Point(x, y);
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.precision = precision == undefined ? 5 : precision;
        // 转换为多边形处理
        this.initPolygon(this.getVertexes());
        this.className = Ellipse.name;
    }

    clone() {
        return new Ellipse(this.p0.x, this.p0.y, this.radiusX, this.radiusY);
    }

    _getVertexes() {
        var beginAngle = 0;
        var endAngle = 360;
        // if (!this.points) {
        var points = [];
        for (var i = beginAngle; i <= endAngle; i += this.precision) {
            var x = Math.cos(T.degreeToRadian(i)) * this.radiusX + this.p0.x;
            var y = Math.sin(T.degreeToRadian(i)) * this.radiusY + this.p0.y;
            points.push(new Point(x, y));
        }
        this.points = points;
        // }
        return this.points;
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