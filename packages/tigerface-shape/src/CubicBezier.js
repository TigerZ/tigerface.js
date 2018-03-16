/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:36.
 */
import {Utilities as T, Logger} from 'tigerface-common';
import Curve from './Curve';
/**
 * 三次贝塞尔曲线<br>
 * 为了高效，曲线在初始化时就已经确定了采样点，以后不会再次计算。如果要改变采样精度，调用refresh方法
 */
export default class CubicBezier extends Curve {
    /**
     * 三次贝塞尔曲线构造器
     * @param startPoint 开始点
     * @param controlPoint1 控制点1
     * @param controlPoint2 控制点2
     * @param endPoint 结束点
     * @param precision 精度
     */
    constructor(startPoint, controlPoint1, controlPoint2, endPoint, precision) {
        super();
        this.p0 = convertVertex(startPoint);
        this.p1 = convertVertex(controlPoint1);
        this.p2 = convertVertex(controlPoint2);
        this.p3 = convertVertex(endPoint);
        this.precision = precision ? precision : T.round((this.p0.getDistance(this.p1)
            + this.p1.getDistance(this.p2) + this.p2.getDistance(this.p3)) / 10);

        // 调用曲线构造器，创建实例
        this.initCurve(this._getPoints());

        this.clazz = CubicBezier.name;

    }

    /**
     * 获取点
     * @param t 点位置（0~1之间）<br>
     *     公式：P0*(1-t)^3+3*P1*t*(1-t)^2+3*P2*t^2*(1-t)+P3*t^3, 0 <= t <= 1
     * @returns {Point}
     * @private
     */
    _getPoint(t) {
        // 未优化的直接算法
        var x = this.p0.x * (1 - t) * (1 - t) * (1 - t) + 3 * this.p1.x * t * (1 - t) * (1 - t) + 3 * this.p2.x * t * t
            * (1 - t) + this.p3.x * t * t * t;
        var y = this.p0.y * (1 - t) * (1 - t) * (1 - t) + 3 * this.p1.y * t * (1 - t) * (1 - t) + 3 * this.p2.y * t * t
            * (1 - t) + this.p3.y * t * t * t;
        return new Point(x, y);
    }

    /**
     * 得到三次曲线的点数组
     * @returns {Array}
     * @private
     */
    _getPoints(precision) {
        var points = [];
        var dt = 1 / (this.precision - 1);
        for (var i = 0; i < this.precision; i++)
            points.push(this._getPoint(i * dt));

        return points;
    }

    /**
     * 改变精度，重新计算曲线
     * @param precision
     */
    refresh(precision) {
        this.precision = precision ? precision : T.round((this.p0.getDistance(this.p1)
            + this.p1.getDistance(this.p2) + this.p2.getDistance(this.p3)) / 10);
        this.points = this._getPoints();
        this.segments = this._getSegments();
    }
};