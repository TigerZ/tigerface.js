/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:03.
 */
import { Utilities as T, Logger } from 'tigerface-common';
import Polygon from './Polygon';

/**
 * 根据两边长夹角创建三角形
 *
 * @type {*|void}
 */
class EquilateralPolygon extends Polygon {
    static logger = Logger.getLogger('EquilateralPolygon');

    constructor(x, y, radius, sideNum) {
        super();
        const angle = 360 / sideNum;
        const points = [];
        for (let i = 0; i < 360; i += angle) {
            const radian = T.degreeToRadian(i);
            points.push({
                x: Math.cos(radian) * radius,
                y: Math.sin(radian) * radius,
            });
        }

        this.initPolygon(points);
        this.clazzName = 'EquilateralPolygon';
    }
}

export default EquilateralPolygon;
