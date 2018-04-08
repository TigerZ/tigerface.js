import { Utilities as T } from 'tigerface-common';
import Polygon from './Polygon';
import Shape from './Shape';
import Point from './Point';
import Line from './Line';

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

    /**
     * 获得与点的切线
     * @param p1
     * @return {*[]}
     */
    getTangentWithPoint(p1) {
        const dist = T.distance(this.p0, p1);
        const radian = Math.asin(this.radius / dist);
        const slope = new Line(this.p0, p1).getSlope();
        const p2 = this.p0.move(0, -this.radius).rotate(slope + radian, this.p0);
        const p3 = this.p0.move(0, this.radius).rotate(slope - radian, this.p0);
        return [new Line(p2, p1), new Line(p3, p1)];
    }


    /**
     * 获得与圆的切线
     * @param c1
     */
    getTangentWithCircle(c1) {
        const c0 = this;
        const tools = {
            get distance() {
                return T.distance(c0.p0, c1.p0);
            },
            get radiusDiff() {
                return Math.abs(c0.radius - c1.radius);
            },
            get slope() {
                return T.slope(c0.p0, c1.p0);
            },
            get sum() {
                return c0.radius + c1.radius;
            },
            get ratio() {
                return c1.radius / c0.radius;
            },
            get outerLen() {
                // 外公切线的长=根号下圆心距的平方-大圆半径减小圆半径的平方
                return Math.sqrt((this.distance ** 2) - (Math.abs(c0.radius - c1.radius) ** 2));
            },

            get innerLen() {
                // 内公切线的长=根号下圆心距的平方-大圆半径加小圆半径的平方
                return Math.sqrt((this.distance ** 2) - ((c0.radius + c1.radius) ** 2));
            },

            get outerRadian() {
                // 外公切线与连心线夹角的正弦值=圆心距分之大圆半径减小圆半径
                return Math.asin(Math.abs(c0.radius - c1.radius) / this.distance);
            },

            get innerRadian() {
                // 外公切线与连心线夹角的正弦值=圆心距分之大圆半径减小圆半径
                return Math.asin(Math.abs(c0.radius + c1.radius) / this.distance);
            },

            get outerTangentLines() {
                // 上切线两点
                const p0 = new Point(c0.p0).move(0, -c0.radius).rotate(this.slope + this.outerRadian, c0.p0);
                const p1 = new Point(c1.p0).move(0, -c1.radius).rotate(this.slope + this.outerRadian, c1.p0);

                // 下切线两点
                const p2 = new Point(c0.p0).move(0, c0.radius).rotate(this.slope - this.outerRadian, c0.p0);
                const p3 = new Point(c1.p0).move(0, c1.radius).rotate(this.slope - this.outerRadian, c1.p0);

                return [new Line(p0, p1), new Line(p2, p3)];
            },

            get innerTangentLines() {
                // 上切线两点
                const p0 = new Point(c0.p0).move(0, -c0.radius).rotate(this.slope + this.innerRadian, c0.p0);
                const p3 = new Point(c1.p0).move(0, -c1.radius).rotate(this.slope - this.innerRadian, c1.p0);

                // 下切线两点
                const p2 = new Point(c0.p0).move(0, c0.radius).rotate(this.slope - this.innerRadian, c0.p0);
                const p1 = new Point(c1.p0).move(0, c1.radius).rotate(this.slope + this.innerRadian, c1.p0);

                return [new Line(p0, p1), new Line(p2, p3)];
            }
        }
        return tools;
    }
}

export default Circle;