/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:00.
 */

import Point from "./Point";
import {Utilities as T} from "tigerface-common";
import Polygon from "./Polygon";

export default class Sector extends Polygon {
    constructor(x, y, radiusX, radiusY, startAngle, endAngle, precision) {
        super();
        this.p0 = new Point(x, y);
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.precision = (precision == undefined || precision < 5) ? 5 : precision;
        // 转换为多边形处理
        this.initPolygon(this.getVertexes(this.startAngle, this.endAngle, this.precision));
        this.clazz = Sector.name;
    }

    clone() {
        return new Sector(this.p0.x, this.p0.y, this.radiusX, this.radiusY, this.startAngle, this.endAngle, this.precision);
    }

    _getVertexes(beginAngle = 0, endAngle = 360, precision = 5) {
        // if (!this.points) {
        let points = [];
        let getPos = (i) => {
            let x = Math.cos(T.degreeToRadian(i)) * this.radiusX + this.p0.x;
            let y = Math.sin(T.degreeToRadian(i)) * this.radiusY + this.p0.y;
            return new Point(x, y);
        }
        for (var i = beginAngle; i < endAngle; i += precision) {
            points.push(getPos(i));
        }
        if ((i - endAngle) < precision) points.push(getPos(endAngle));

        if (Math.abs(endAngle - beginAngle) < 360) points.push(this.p0);

        // this.points = points;
        // }
        return points;
    }

    scatter(radiusX, radiusY) {
        let angle = this.startAngle + (this.endAngle - this.startAngle) / 2;
        let x = Math.cos(T.degreeToRadian(angle)) * radiusX;
        let y = Math.sin(T.degreeToRadian(angle)) * radiusY;
        return this.move(x, y);
    }
}