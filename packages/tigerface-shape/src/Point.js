/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:05.
 */
import {Utilities as T, Logger} from 'tigerface-common';

/**
 * Point类，描述一个点坐标
 */

class Point {

    /**
     * 点构造器
     *
     * @param x X轴坐标
     * @param y Y轴坐标
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

        this.clazzName = Point.name;
        this.logger = Logger.getLogger(this);
    }

    /**
     * 返回坐标相同的新点实例
     *
     * @returns {Point}
     */
    clone() {
        return new Point(this.x, this.y);
    }

    /**
     * 判断与另一点坐标是否相等
     *
     * @param p 比较点
     * @returns {Boolean}
     */
    equals(p, precision) {
        if (precision == undefined) precision = 0.01;
        return (Math.abs(this.x - p.x) < precision && Math.abs(this.y - p.y) < precision);
        //return this.x == p.x && this.y == p.y;
    }

    /**
     * 计算与另一点之间的距离
     *
     * @param p
     * @returns {number}
     */
    getDistance(p) {
        p || (p = new Point(0, 0));
        //if (this.x == p.x) return Math.abs(this.y - p.y);
        //if (this.y == p.y) return Math.abs(this.x - p.x);
        //// 原理：勾股定理
        //var dx = this.x - p.x;
        //var dy = this.y - p.y;
        //return Math.sqrt(dx * dx + dy * dy);

        return T.distance(this, p);
    }

    /**
     * 移动
     *
     * @param offsetX X轴偏移量（可负）
     * @param offsetY Y轴偏移量（可负）
     * @returns {Point} 移动后的坐标点
     */
    move(offsetX, offsetY) {
        return new Point(this.x + offsetX, this.y + offsetY);
    }

    /**
     * 以指定点为原点，旋转指定角度（弧度）后得到的坐标
     *
     * @param radian 旋转的角度（弧度）
     * @param origin 指定原点。可选，缺省为（0，0）
     * @returns {Point} 返回旋转后的坐标点
     */
    rotate(radian, origin) {
        origin || (origin = new Point(0, 0));
        // 坐标到原点的距离
        var radius = this.getDistance(new Point(origin.x, origin.y));

        // 当前的角度（斜度）
        var slope = Math.atan2(this.y - origin.y, this.x - origin.x);

        // 计算mouse坐标反向补偿后的坐标，加上原点坐标，作为测试点
        var newX = Math.cos(radian + slope) * radius + origin.x;
        var newY = Math.sin(radian + slope) * radius + origin.y;

        return new Point(newX, newY);
    }

    /**
     * 缩放
     *
     * @param scaleX X轴缩放比例
     * @param scaleY Y轴缩放比例
     * @returns {Point} 缩放后的坐标点
     */
    scale(scaleX, scaleY) {
        return new Point(this.x * scaleX, this.y * scaleY);
    }

    toString() {
        return "Point(" + this.x + ", " + this.y + ")";
    }

    toJSON() {
        return "{x:" + this.x + ",y:" + this.y + "}";
    }
}

export default Point;