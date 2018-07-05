/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:05.
 */
import { Utilities as T, Logger } from 'tigerface-common';

/**
 * Point类，描述一个点坐标
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-shape
 */
class Point {
    /**
     * @param args {{x:*,y:*}}
     * @param args.x {number} X 轴坐标
     * @param args.y {number} Y 轴坐标
     * @param args.z {number} Z 轴坐标
     */
    constructor(...args) {
        this.clazzName = 'Point';
        this.logger = Logger.getLogger(this);
        // 支持对象参数
        if ((args.length === 1)) {
            if (typeof args[0] !== 'object') {
                this.logger.error('初始化 Point 对象');
            }
            const { x, y, z } = args[0];
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        } else {
            const [x, y, z] = args;
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
    }

    /**
     * 返回坐标相同的新点实例
     *
     * @returns {module:tigerface-shape.Point}
     */
    clone() {
        return new Point(this.x, this.y, this.z);
    }

    /**
     * 判断与另一点坐标是否相等
     *
     * @param p {module:tigerface-shape.Point} 比较点
     * @param [precision=0.01] {number} 精度
     * @returns {boolean}
     */
    equals(p, precision = 0.01) {
        return (Math.abs(this.x - p.x) < precision
            && Math.abs(this.y - p.y) < precision
            && Math.abs(this.z - p.z) < precision);
    }

    /**
     * 计算与另一点之间的距离
     *
     * @param [p = new Point(0, 0)] {module:tigerface-shape.Point} 计算点
     * @returns {number} 距离
     */
    getDistance(p = new Point(0, 0, 0)) {
        // if (this.x == p.x) return Math.abs(this.y - p.y);
        // if (this.y == p.y) return Math.abs(this.x - p.x);
        // // 原理：勾股定理
        // var dx = this.x - p.x;
        // var dy = this.y - p.y;
        // return Math.sqrt(dx * dx + dy * dy);

        return T.distance(this, p);
    }

    /**
     * 移动
     *
     * @param offsetX {number} X 轴偏移量（可负）
     * @param offsetY {number} Y 轴偏移量（可负）
     * @param offsetZ {number} Z 轴偏移量（可负）
     * @returns {module:tigerface-shape.Point} 移动后的坐标点
     */
    move(offsetX = 0, offsetY = 0, offsetZ = 0) {
        return new Point(this.x + offsetX, this.y + offsetY, this.z + offsetZ);
    }

    /**
     * 以指定点为原点，旋转指定角度（弧度）后得到的坐标
     *
     * @param radian {number} 旋转的角度（弧度）
     * @param [origin = new Point(0, 0)] {module:tigerface-shape.Point} 指定原点
     * @returns {module:tigerface-shape.Point} 返回旋转后的坐标点
     */
    rotate(radian, origin = new Point(0, 0, 0)) {
        // 坐标到原点的距离
        const radius = this.getDistance(new Point(origin.x, origin.y));

        // 当前的角度（斜度）
        const slope = Math.atan2(this.y - origin.y, this.x - origin.x);

        // 计算mouse坐标反向补偿后的坐标，加上原点坐标，作为测试点
        const newX = (Math.cos(radian + slope) * radius) + origin.x;
        const newY = (Math.sin(radian + slope) * radius) + origin.y;

        return new Point(newX, newY);
    }

    /**
     * 缩放
     *
     * @param scaleX {number} X 轴缩放比例
     * @param scaleY {number} Y 轴缩放比例
     * @param scaleZ {number} Z 轴缩放比例
     * @returns {module:tigerface-shape.Point} 缩放后的坐标点
     */
    scale(scaleX = 1, scaleY = 1, scaleZ = 1) {
        return new Point(this.x * scaleX, this.y * scaleY, this.z * scaleZ);
    }

    toString() {
        return `Point(${this.x}, ${this.y}, ${this.z})`;
    }

    toJSON() {
        return `{x:${this.x},y:${this.y},z:${this.z}}`;
    }
}

export default Point;
