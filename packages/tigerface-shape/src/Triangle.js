/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:03.
 */
import { Utilities as T, Logger } from 'tigerface-common';
import Polygon from './Polygon';
import Point from './Point';

/**
 * 根据两边长夹角创建三角形
 *
 * @type {*|void}
 */
class Triangle extends Polygon {
    static logger = Logger.getLogger('Triangle');

    /**
     * @param x {number} X 轴坐标
     * @param y {number} Y 轴坐标
     * @param l1 {number} 左侧边长
     * @param l2 {number} 右侧边长
     * @param angle {number} 两边夹角
     */
    constructor(x, y, l1, l2, angle) {
        super();

        const radian = T.degreeToRadian(angle);
        const x2 = Math.cos(radian) * l2;
        const y2 = Math.sin(radian) * l2;
        const points = [];
        points.push(new Point(x, y));
        points.push(new Point(x + l1, y));
        points.push(new Point(x + x2, y + y2));
        this.initPolygon(points);
        this.clazzName = 'Triangle';
    }
}

export default Triangle;
