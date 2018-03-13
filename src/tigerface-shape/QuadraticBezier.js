/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:34.
 */


import {Utilities as T, Logger} from 'tigerface-common';
import Vertex from './Vertex';
import Curve from './Curve';
import Point from './Point';

/**
 * 二次贝塞尔曲线<br>
 * 为了高效，曲线在初始化时就已经确定了采样点，以后不会再次计算。如果要改变采样精度，调用refresh方法
 */
export default class QuadraticBezier extends Curve {
    static logger = Logger.getLogger(QuadraticBezier.name);
    /**
     * 二次贝塞尔曲线构造器
     * @param startPoint 开始点
     * @param controlPoint 控制点
     * @param endPoint 结束点
     * @param precision 精度（可选）
     */
    constructor(startPoint, controlPoint, endPoint, precision) {

        super([startPoint, controlPoint, endPoint]);

        this.p0 = Vertex.convertVertex(startPoint);
        this.p1 = Vertex.convertVertex(controlPoint);
        this.p2 = Vertex.convertVertex(endPoint);

        this.precision = precision ? precision : T.round((this.p0.getDistance(this.p1) + this.p1
            .getDistance(this.p2)) / 10);

        // 调用曲线构造器，创建实例
        this.initCurve(this._getPoints());

        this.clazz = QuadraticBezier.name;
    }

    /**
     * 获取点
     * @param t 点位置（0~1之间）<br>
     *     公式：(1-t)^2 * P0 + 2 * (1-t) * t * P1 + t^2 * P2, 0 <= t <= 1
     * @returns {Point}
     * @private
     */
    _getPoint(t) {
        let x = (1 - t) * (1 - t) * this.p0.x + 2 * (1 - t) * t * this.p1.x + t * t * this.p2.x;
        let y = (1 - t) * (1 - t) * this.p0.y + 2 * (1 - t) * t * this.p1.y + t * t * this.p2.y;
        return new Point(x, y);
    }

    /**
     * 得到二次曲线的点数组
     * @returns {Array}
     * @private
     */
    _getPoints() {
        let points = [];
        let dt = 1 / (this.precision - 1);
        for (let i = 0; i < this.precision; i++)
            points.push(this._getPoint(i * dt));
        return points;
    }

    /**
     * 改变精度，重新计算曲线
     * @param precision
     */
    refresh(precision) {
        this.precision = precision ? precision : T.round((this.p0.getDistance(this.p1) + this.p1
            .getDistance(this.p2)) / 10);
        this.points = this._getPoints();
        this.segments = this._getSegments();
    }
}