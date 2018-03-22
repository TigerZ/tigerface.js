import Polygon from './Polygon';
import Shape from './Shape';
import Point from './Point';
import {Utilities as T} from 'tigerface-common';

/**
 * 圆
 *
 *
 */
class Circle extends Shape {
    /**
     * 圆构造器
     *
     * @param x 圆心X坐标
     * @param y 圆心Y坐标
     * @param radius 半径
     */
    constructor(x, y, radius) {
        super();
        this.clazzName = Circle.name;
        this.p0 = new Point(x, y);
        this.radius = radius;
        // 转换为多边形处理
        // this.initPolygon(this.getVertexes());
    }

    clone() {
        return new Circle(this.p0.x, this.p0.y, this.radius);
    }

    /**
     *
     * @param precision {integer} 精度
     * @returns {Array}
     * @private
     */
    _getVertexes(precision = 5, beginAngle = 0, endAngle = 360) {
        // if (!this.points) {
        let points = [];
        for (let i = beginAngle; i <= endAngle; i += precision) {
            let x = Math.cos(T.degreeToRadian(i)) * this.radius + this.p0.x;
            let y = Math.sin(T.degreeToRadian(i)) * this.radius + this.p0.y;
            points.push(new Point(x, y));
        }
        return points;
    }

    /**
     * 转化为多边形
     * @param precision {integer}
     * @returns {Polygon}
     */
    toPolygon(precision = 5) {
        return new Polygon(this._getVertexes(precision));
    }

    /**
     * 提取外接矩形
     *
     * @returns {{left: Number, top: Number, width: Number, height: Number}}
     * @private
     */
    _getBoundingRect_() {
        let left = this.p0.x - this.radius;
        let right = this.p0.x + this.radius;
        let top = this.p0.y - this.radius;
        let bottom = this.p0.y + this.radius;
        return {
            left: left,
            top: top,
            right: right,
            bottom: bottom,
            width: right - left,
            height: bottom - top
        };
    }

    /**
     * 点碰撞检测
     *
     * @param point
     * @returns {boolean}
     */
    hitTestPoint(point) {
        return this.p0.getDistance(point) <= this.radius;
    }

    /**
     * 线碰撞检测
     * @param line {Line}
     * @returns {boolean}
     */
    hitTestLine(line) {
        return line.getDistance(this.p0) <= this.radius;
    }

    /**
     * 多边形碰撞测试
     *
     * @param polygon
     * @returns {boolean}
     */
    hitTestPolygon(polygon) {
        if (polygon.clazzName === "Circle") {
            return this.p0.getDistance(polygon.p0) <= this.radius + polygon.radius;
        }

        // 点碰撞
        let points = polygon.getVertexes();
        for (let i in points) {
            if (this.hitTestPoint(points[i])) {
                return true;
            }
        }
        // 边碰撞
        let sides = polygon.getSides();
        for (let i in sides) {
            if (this.hitTestLine(sides[i])) {
                return true;
            }
        }
        return false;
    }

    /**
     * 旋转
     * @param radian 弧度
     * @param origin 原点 可选，缺省为（0，0）
     * @returns {Circle}
     */
    rotate(radian, origin) {
        let p = this.p0.rotate(radian, origin);
        return new Circle(p.x, p.y, this.radius);
    }

    /**
     * 移动
     * @param offsetX X轴平移量
     * @param offsetY Y轴平移量
     * @returns {Circle}
     */
    move(offsetX, offsetY) {
        let p = this.p0.move(offsetX, offsetY);
        return new Circle(p.x, p.y, this.radius);
    }

    scale(scaleX, scaleY) {
        return new Circle(this.p0.x, this.p0.y, this.radius * Math.max(scaleX, scaleY));
    }
}

export default Circle;