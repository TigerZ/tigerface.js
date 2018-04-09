/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:03.
 */
import { Utilities as T, Logger } from 'tigerface-common';
import Polygon from './Polygon';


class EquilateralStar extends Polygon {
    static logger = Logger.getLogger('EquilateralStar');

    constructor(x, y, outerRadius, innerRadius, vertexNum) {
        super();

        const points = [];
        const outerAngle = 360 / vertexNum;
        const innerAngle = outerAngle / 2;
        for (let i = 0; i < 360; i += outerAngle) {
            const r1 = T.degreeToRadian(i);
            points.push({
                x: Math.cos(r1) * outerRadius + x,
                y: Math.sin(r1) * outerRadius + y,
            });
            const r2 = T.degreeToRadian(i + innerAngle);
            points.push({
                x: Math.cos(r2) * innerRadius + x,
                y: Math.sin(r2) * innerRadius + y,
            });
        }

        this.initPolygon(points);
        this.clazzName = 'EquilateralStar';
    }
}

export default EquilateralStar;
