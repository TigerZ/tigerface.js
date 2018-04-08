/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:48.
 */
import Point from './Point';
import Polygon from './Polygon';
/**
 * 直角三角形
 *
 * @type {*|void}
 */
class RightTriangle extends Polygon {
    constructor(x, y, l1, l2) {
        super();
        this.clazzName = 'RightTriangle';

        let points = [];
        points.push(new Point(x, y));
        points.push(new Point(x, y - l2));
        points.push(new Point(x + l1, y));
        this.initPolygon(points);
    }
}

export default RightTriangle;