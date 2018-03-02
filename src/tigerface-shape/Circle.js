import Polygon from "./Polygon";

/**
 * 圆
 *
 * @type {*|void}
 */
export default class Circle extends Polygon {
    /**
     * 圆构造器
     *
     * @param x 圆心X坐标
     * @param y 圆心Y坐标
     * @param radius 半径
     */
    constructor(x, y, radius) {
        super();
        this.p0 = new Point(x, y);
        this.radius = radius;
        // 转换为多边形处理
        this.initPolygon(this.getVertexes());
        this.className = "Circle";
    }

    clone() {
        return new Circle(this.p0.x, this.p0.y, this.radius);
    }

    _getVertexes(precision) {
        if (precision == undefined)
            precision = 5;
        var beginAngle = 0;
        var endAngle = 360;
        // if (!this.points) {
        var points = [];
        for (var i = beginAngle; i <= endAngle; i += precision) {
            var x = Math.cos(T.degreeToRadian(i)) * this.radius + this.p0.x;
            var y = Math.sin(T.degreeToRadian(i)) * this.radius + this.p0.y;
            points.push(new Point(x, y));
        }
        return points;
    }

    /**
     * 转化为多边形
     * @param precision
     * @param beginAngle
     * @param endAngle
     * @returns {Polygon}
     */
    toPolygon(precision, beginAngle, endAngle) {
        return new Polygon(this._getVertexes());
    }

    /**
     * 提取外接矩形
     *
     * @returns {{left: Number, top: Number, width: Number, height: Number}}
     * @private
     */
    _getBoundingRect() {
        var left = this.p0.x - this.radius;
        var right = this.p0.x + this.radius;
        var top = this.p0.y - this.radius;
        var bottom = this.p0.y + this.radius;
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
     * @param point
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
        if (polygon.className == "Circle") {
            return this.p0.getDistance(polygon.p0) <= this.radius + polygon.radius;
        }

        // 点碰撞
        var points = polygon.getVertexes();
        for (var i in points) {
            if (this.hitTestPoint(points[i])) {
                return true;
            }
        }
        // 边碰撞
        var sides = polygon.getSides();
        for (var i in sides) {
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
     * @returns {Polygon}
     */
    rotate(radian, origin) {
        var p = this.p0.rotate(radian, origin);
        return new Circle(p.x, p.y, this.radius);
    }

    /**
     * 移动
     * @param offsetX X轴平移量
     * @param offsetY Y轴平移量
     * @returns {Polygon}
     */
    move(offsetX, offsetY) {
        var p = this.p0.move(offsetX, offsetY);
        return new Circle(p.x, p.y, this.radius);
    }

    scale(scaleX, scaleY) {
        return new Circle(this.p0.x, this.p0.y, this.radius * scaleX);
    }
}