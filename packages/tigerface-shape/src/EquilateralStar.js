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
class EquilateralStar extends Polygon {
    static logger = Logger.getLogger(EquilateralStar.name);

    constructor(x, y, outerRadius, innerRadius, vertexNum) {
        super();

        const points = [];
        const outerAngle = 360 / vertexNum;
        const innerAngle = outerAngle / 2;
        for (let i = 0; i < 360; i += outerAngle) {
            const r1 = T.degreeToRadian(i);
            points.push({
                x: Math.cos(r1) * outerRadius,
                y: Math.sin(r1) * outerRadius,
            });
            const r2 = T.degreeToRadian(i + innerAngle);
            points.push({
                x: Math.cos(r2) * innerRadius,
                y: Math.sin(r2) * innerRadius,
            });
        }

        this.initPolygon(points);
        this.clazzName = EquilateralStar.name;
    }
}

export default EquilateralStar;
