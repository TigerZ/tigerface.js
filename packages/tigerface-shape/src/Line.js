/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:06.
 */
import Point from './Point';
import Vertex from './Vertex';
import Vector from './Vector';
import {Logger} from 'tigerface-common';
/**
 * Line类，由两点坐标描述一个直线段
 */
class Line {
    static byPoint(p0, p1) {
        return new Line(p0, p1);
    }

    static bySlope(p0, radian, length) {
        let x = Math.cos(radian) * length + p0.x;
        let y = Math.sin(radian) * length + p0.y;
        return new Line(p0, new Point(x, y));
    }

    static byVector(p0, vector, length) {
        let radian = vector.getRadian();
        return Line.bySlope(p0, radian, length);
    }

    /**
     * 直线段构造器（两点法）
     * @param p0 起始点
     * @param p1 结束点
     */
    constructor(p0, p1) {

        this.p0 = Vertex.convertVertex(p0);
        this.p1 = Vertex.convertVertex(p1);

        this.clazzName = Line.name;
        this.logger = Logger.getLogger(this);
    }

    toString() {
        return "Line { p0:" + this.p0.toString() + ", p1:" + this.p1.toString() + " }";
    }

    /**
     * 判断与另一个直线段是否相同
     * @param line
     * @returns {Boolean|*}
     */
    equals(line) {
        return this.p0.equals(line.p0) && this.p1.equals(line.p1);
    }

    /**
     * 计算线段长度，用的算法是两点间距离
     *
     * @returns {number}
     */
    getLength() {
        return this.p0.getDistance(this.p1);
    }

    /**
     * 判断指定点是否在直线端上
     * @param p2 指定点
     * @param precision {number} 精度
     * @returns {boolean}
     */
    hitTestPoint(p2, precision = 0.01) {
        // 如果p2与两端点之一相等，返回true
        if (p2.equals(this.p0) || p2.equals(this.p1)) return true;

        // 设点 Q = (x, y), P1 = (x1, y1), P2 = (x2, y2)
        // 若 (Q - P1)*(P2 - P1) = 0
        // 且 min(x1, x2) <= x <= max(x1, x2)
        // && min(y1, y2) <= y <= max(y1, y2)，则点 Q 在线段 P1P2 上

        // precision !== undefined || (precision = 0.01);
        // 如果测试点p位于两顶点之间，那么带入两点式方程，方程成立
        if (p2.x >= Math.min(this.p0.x, this.p1.x) && p2.x <= Math.max(this.p0.x, this.p1.x)
            && p2.y >= Math.min(this.p0.y, this.p1.y) && p2.y <= Math.max(this.p0.y, this.p1.y)) {
            // 叉积等于0，说明共线
            let cp = Vector.byPoint(this.p0, this.p1).unit().crossProduct(Vector.byPoint(this.p0, p2).unit());
            return (-precision < cp && cp < precision);
        }
        return false;
    }

    /**
     * 判断本线段与指定线段是否存在交点（快速排斥试验 && 跨立试验）
     *
     * @param line
     * @returns {Boolean}
     */
    hasIntersection(line) {

        // 叉积
        let crossProduct = function (p0, p1, p2) {
            // return (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y -
            // p0.y);
            return new Vector(p1.x - p0.x, p1.y - p0.y).crossProduct(new Vector(p2.x - p0.x, p2.y - p0.y));
        };
        let s1 = this.p0, e1 = this.p1;
        let s2 = line.p0, e2 = line.p1;

        //console.log(line.toString(), this.toString());
        //console.log(Math.max(s2.x, e2.x), ">", Math.min(s1.x, e1.x));
        // 快速排斥试验 && 跨立试验
        return Math.max(s1.x, e1.x) >= Math.min(s2.x, e2.x) //
            && Math.max(s2.x, e2.x) >= Math.min(s1.x, e1.x) //
            && Math.max(s1.y, e1.y) >= Math.min(s2.y, e2.y) //
            && Math.max(s2.y, e2.y) >= Math.min(s1.y, e1.y) //
            && crossProduct(s1, s2, e1) * crossProduct(s1, e1, e2) >= 0
            && crossProduct(s2, s1, e2) * crossProduct(s2, e2, e1) >= 0;
    }

    /**
     * 求本线段与指定线段的交点坐标
     *
     * @param line 指定直线
     * @returns {Point | undefined}
     */
    getIntersection(line) {

        let a = this.p0, b = this.p1, c = line.p0, d = line.p1;

        // 先判断是否存在交点，因为内部的求交点算法是用直线方程计算的，得到的交点可能不在线段范围内。
        if (this.hasIntersection(line)) {

            // 如果叉积为0 则平行或共线, 不相交
            // let cross = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y -
            // d.y);
            let cross = Vector.byPoint(a, b).crossProduct(Vector.byPoint(d, c));

            // 线段所在直线的交点坐标 (x , y)
            let x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y) + (b.y - a.y) * (d.x - c.x) * a.x - (d.y - c.y)
                * (b.x - a.x) * c.x)
                / cross;
            let y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x) + (b.x - a.x) * (d.y - c.y) * a.y - (d.x - c.x)
                * (b.y - a.y) * c.y)
                / cross;
            return new Point(x, y);
        }
        return undefined;
    }

    /**
     * 获取指定点到本线段的距离<br>
     *     注意：如果线段不存在与线段的直角垂线，那么距离就是到最近顶点的距离
     *
     * @param p
     * @returns {number}
     */
    getDistance(p) {
        // 算法来自网络，有修改。经测试，确实比较快，海量运算情况下，有优势

        let a = this.p0;
        let b = this.p1;

        let l = this.getLength();
        if (l === 0.0) /* a = b */
            return (p.getDistance(a));

        let r = ((a.y - p.y) * (a.y - b.y) - (a.x - p.x) * (b.x - a.x)) / (l * l);

        // P 的垂线投影位于 AB 的向前延伸线
        if (r > 1)
            return (Math.min(p.getDistance(b), p.getDistance(a)));

        // P 的垂线投影位于 AB 的向后延伸线
        if (r < 0)
            return (Math.min(p.getDistance(b), p.getDistance(a)));

        let s = ((a.y - p.y) * (b.x - a.x) - (a.x - p.x) * (b.y - a.y)) / (l * l);

        return Math.abs(s * l);
    }

    /**
     * 获取指定点到本线段的距离<br>
     *     注意：如果线段不存在与线段的直角垂线，那么距离就是到最近顶点的距离
     *
     * @param p
     * @returns {number}
     */
    getDistance_method2(p) {
        // 本算法比较容易理解，但慢

        let v = Vector.byPoint(this.p0, this.p1);

        let v0 = Vector.byPoint(this.p0, p);
        if (v.dotProduct(v0) <= 0) { // 对于 p0 大于等于90度
            // console.log("对于 p0 大于等于90度");
            return this.p0.getDistance(p);
        }

        let v1 = Vector.byPoint(this.p1, p);
        if (v.reverse().dotProduct(v1) <= 0) { // 对于 p1 大于等于90度
            // console.log("对于 p1 大于等于90度");
            return this.p1.getDistance(p);
        }

        return Math.sin(v.getAngle(v0)) * this.p0.getDistance(p);
    }

    /**
     * 求线段斜率（单位以弧度表示）
     *
     * @returns {number}
     */
    getSlope() {
        if (!this.slope) {
            this.slope = Math.atan2(this.p1.y - this.p0.y, this.p1.x - this.p0.x);
        }
        return this.slope;
    }

    getFootPoint(point) {
        let v0 = Vector.byPoint(this.p0, this.p1);
        let v1 = Vector.byPoint(this.p0, point);
        let ac = this.p0.getDistance(point);
        let a0 = v0.getAngle(v1);
        let ab = ac * Math.cos(a0);
        let a1 = v0.getRadian();
        let x = Math.cos(a1) * ab + this.p0.x;
        let y = Math.sin(a1) * ab + this.p0.y;
        return new Point(x, y);
    }
}

export default Line;