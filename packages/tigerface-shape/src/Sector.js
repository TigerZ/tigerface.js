/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:00.
 */
import { Utilities as T } from 'tigerface-common';
import Point from './Point';
import Polygon from './Polygon';

class Sector extends Polygon {
    constructor(x, y, radiusX, radiusY, startAngle, endAngle, precision) {
        super();
        this.p0 = new Point(x, y);
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.precision = (precision === undefined || precision < 5) ? 5 : precision;
        // 转换为多边形处理
        this.initPolygon(this.getVertexes(this.startAngle, this.endAngle, this.precision));
        this.clazzName = 'Sector';
    }

    clone() {
        return new Sector(this.p0.x, this.p0.y, this.radiusX, this.radiusY, this.startAngle, this.endAngle, this.precision);
    }

    _getVertexes(beginAngle = 0, endAngle = 360, precision = 5) {
        // if (!this.points) {
        const points = [];
        const getPos = (i) => {
            const x = (Math.cos(T.degreeToRadian(i)) * this.radiusX) + this.p0.x;
            const y = (Math.sin(T.degreeToRadian(i)) * this.radiusY) + this.p0.y;
            return new Point(x, y);
        };
        let i;
        for (i = beginAngle; i < endAngle; i += precision) {
            points.push(getPos(i));
        }
        if ((i - endAngle) < precision) points.push(getPos(endAngle));

        if (Math.abs(endAngle - beginAngle) < 360) points.push(this.p0);

        // this.points = points;
        // }
        return points;
    }

    scatter(radiusX, radiusY) {
        const angle = this.startAngle + ((this.endAngle - this.startAngle) / 2);
        const x = Math.cos(T.degreeToRadian(angle)) * radiusX;
        const y = Math.sin(T.degreeToRadian(angle)) * radiusY;
        return this.move(x, y);
    }
}

export default Sector;
