/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:30.
 */
/**
 * 向量，向量是在X轴和Y轴上的有方向的力
 */
export default class Vector {
    static byRadian(radian, magnitude) {
        if (magnitude == undefined)
            magnitude = 1;
        var x = Math.cos(radian) * magnitude;
        var y = Math.sin(radian) * magnitude;
        return new Vector(x, y);
    }

    static byLine(line) {
        return Vector.byPoint(line.p0, line.p1);
    }

    static byPoint(p0, p1) {
        return new Vector(p1.x - p0.x, p1.y - p0.y);
    }

    /**
     * 向量构造器
     *
     * @param x X轴上的力
     * @param y Y轴上的力
     */
    constructor(x, y) {

        // 支持对象参数
        if ((arguments.length == 1) && typeof x == 'object') {
            this.x = x.x || 0;
            this.y = x.y || 0;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }

        this.className = Vector.name;

    }

    /**
     * 返回与此向量相同的新向量实例
     *
     * @returns {Vector}
     */
    clone() {
        return new Vector(this.x, this.y);
    }

    /**
     * 向量大小（矩形对角线，勾股定理）
     *
     * @returns
     */
    getMagnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    /**
     * 设置向量的大小<br>
     *     此算法会导致重新计算X轴和Y轴上的力，导致此实例的X，Y值改变
     * @param magnitude
     */
    setMagnitude(magnitude) {
        var unit = this.unit();
        this.x = unit.x * magnitude;
        this.y = unit.y * magnitude;
    }

    /**
     * 单位向量
     *
     * @returns {Vector}
     */
    unit() {
        var magnitude = this.getMagnitude();
        return new Vector(this.x / magnitude, this.y / magnitude);
    }

    /**
     * 同时反转此向量的X轴和Y轴上的值
     */
    reverse() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * 向量相加（求和）
     *
     * @param v 求和的另一个向量
     * @returns {Vector}
     */
    sum(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    /**
     * 向量相减（求差）
     *
     * @param v 求差的另一个向量
     * @returns {Vector}
     */
    subtraction(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    /**
     * 向量点积（数量积、点乘）
     *
     * 如果：点积 = 0 向量相互垂直；
     * 如果：点积 > 0 两向量夹角小于90度；
     * 如果：点积 < 0 两向量夹角大于90度；
     *
     * @param v 求点积的另一个向量
     * @returns {Number}
     */
    dotProduct(v) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * 向量叉积
     *
     * 两向量P(x1, y1)和Q(x2, y2)<br>
     * 叉积 = x1 * y2 - x2 * y1<br>
     * 在直角坐标系中：<br>
     * 如果：叉积 > 0，则 P 在 Q 的顺时针方向<br>
     * 如果：叉积 < 0, 则 P 在 Q 的逆时针方向<br>
     * 如果：叉积 = 0，则 P 与 Q 共线，但不确定 P, Q 的方向是否相同<br>
     * 注意：计算机坐标系，Y轴是反的<br>
     *
     * @param v
     * @returns {Number}
     */
    crossProduct(v) {
        return this.x * v.y - v.x * this.y;
    }

    /**
     * 返回向量的弧度
     *
     * @returns {number}
     */
    getRadian() {
        return Math.atan2(this.y, this.x);
    }

    /**
     * 设置向量的弧度<br>
     *     此算法会导致重新计算X轴和Y轴上的力，导致此实例的X，Y值改变
     *
     * @param radian 弧度
     */
    setRadian(radian) {
        var magnitude = this.getMagnitude();
        this.x = Math.cos(radian) * magnitude;
        this.y = Math.sin(radian) * magnitude;
    }

    /**
     * 旋转指定的弧度
     *
     * @param radian
     */
    rotate(radian) {
        var newRadian = this.getRadian() + radian;
        this.setRadian(newRadian);
    }

    getAngle(v) {
        // 算法：cos<a,b>=a*b/[|a|*|b|]
        return Math.acos(this.dotProduct(v) / Math.abs(this.getModel() * v.getModel()));
    }

    equals(v) {
        return this.x == v.x && this.y == v.y;
    }

    getModel() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}