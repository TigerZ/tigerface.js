/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:46.
 */
import { Utilities as T } from 'tigerface-common';
import Polygon from './Polygon';
import Point from './Point';

/**
 * 等边三角形
 *
 * @type {*|void}
 */
class EquilateralTriangle extends Polygon {
    constructor(x, y, l) {
        var radian = T.degreeToRadian(60);
        var x2 = Math.cos(radian) * l;
        var y2 = Math.sin(radian) * l;
        var points = [];
        points.push(new Point(x, y));
        points.push(new Point(x + l, y));
        points.push(new Point(x + x2, y - y2));
        super(points);
        this.clazzName = 'EquilateralTriangle';
    }
}

export default EquilateralTriangle;