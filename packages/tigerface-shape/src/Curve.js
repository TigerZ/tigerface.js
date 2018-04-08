/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:33.
 */
import Line from './Line';
import Vertex from './Vertex';
import QuadraticBezier from "RootPath/packages/tigerface-shape/src/QuadraticBezier";
import Polygon from "RootPath/packages/tigerface-shape/src/Polygon";
import Point from "RootPath/packages/tigerface-shape/src/Point";

/**
 * 曲线基类
 */
class Curve {
    /**
     * 曲线构造器<br>
     *
     * @param points
     */
    constructor(points) {
        if (points) this.initCurve(points);
        this.clazzName = 'Curve';
    }

    initCurve(points) {
        this.points = Vertex.convertVertexArray(points);
        this.segments = this.points ? this._getSegments() : [];
    }

    /**
     * 根据点提取线段数组
     *
     * @returns {Array}
     */
    _getSegments() {
        const lines = [];
        const points = this.getPoints();
        let [p1] = points;
        let p2;
        for (let i = 1; i <= points.length; i += 1) {
            p2 = points[i % points.length];
            lines.push(new Line(p1, p2));
            p1 = p2;
        }
        return lines;
    }

    /**
     * 返回曲线的点数组
     *
     * @returns {Array}
     */
    getPoints() {
        return this.points;
    }

    /**
     * 返回曲线的线段数组。<br>
     *     因为线段数组被缓存，所以如果修改了曲线的点数组，需要重新提取线段
     *
     * @returns {Array}
     */
    getSegments() {
        return this.segments;
    }

    /**
     * 判断曲线是否和直线是否有交点<br>
     *     遍历构成曲线的线段数组，判断每条线段是否与指定直线有交点。
     *
     * @param line 判断交点的直线段
     * @returns {boolean}
     */
    hasIntersection(line) {
        const segments = this.getSegments();
        for (let i = 0; i < segments.length; i += 1) {
            if (segments[i].hasIntersection(line)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获得
     * @param line
     * @returns {*}
     */
    getIntersection(line) {
        const segments = this.getSegments();
        for (let i = 0; i < segments.length; i += 1) {
            if (segments[i].hasIntersection(line)) {
                return segments[i].getIntersection(line);
            }
        }
        return undefined;
    }

    /**
     * 连接另一条曲线
     * @param curve
     */
    connect(curve) {
        const points = curve.getPoints();
        if (this.points[this.points.length - 1].equals(points[0])) {
            points.shift();
        }
        // 连接两个点数组
        this.points = this.points.concat(points);
        // 重新提取线段
        this.segments = this._getSegments();
    }

    /**
     * 转换圆角曲线
     *
     * @param radius {number} 圆角半径
     * @param precision {number} 采样精度
     * @returns {Curve}
     */
    convertRounded(radius, precision = 10) {
        if (this.points.length < 3) return this;
        const points = this.getPoints();
        let newPoints = [points[0]];
        let p1;
        let p2;
        let rp1;
        let rp2;

        for (let i = 0; i < points.length - 1; i += 1) {
            p1 = points[i];
            p2 = points[i + 1];
            const slope = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const x = Math.cos(slope) * radius;
            const y = Math.sin(slope) * radius;
            rp1 = new Point(p1.x + x, p1.y + y);
            if (rp2) {
                const curvePoints = new QuadraticBezier(rp2, p1, rp1, precision).getPoints();
                newPoints = newPoints.concat(curvePoints);
            }
            rp2 = new Point(p2.x - x, p2.y - y);
        }
        newPoints.push(points[points.length - 1]);

        return new Curve(newPoints);
    }
}

export default Curve;
