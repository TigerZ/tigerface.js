/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:03.
 */
import Polygon from './Polygon';
import Point from './Point';
import {Utilities as T, Logger} from 'tigerface-common';
/**
 * 根据两边长夹角创建三角形
 *
 * @type {*|void}
 */
class Triangle extends Polygon {
    static logger = Logger.getLogger(Triangle.name);
    constructor(x, y, l1, l2, angle) {
        super();

        var radian = T.degreeToRadian(angle);
        var x2 = Math.cos(radian) * l2;
        var y2 = Math.sin(radian) * l2;
        var points = [];
        points.push(new Point(x, y));
        points.push(new Point(x + l1, y));
        points.push(new Point(x + x2, y - y2));
        this.initPolygon(points);
        this.clazzName = Triangle.name;
    }
}

export default Triangle;