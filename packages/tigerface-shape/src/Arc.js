import { Utilities as T } from 'tigerface-common';
import Curve from './Curve';
import Point from './Point';


/**
 * User: zyh
 * Date: 2018/3/29.
 * Time: 07:29.
 */
class Arc extends Curve {
    /**
     * 通过对象参数创建实例
     * @param opt 初始化参数
     * @return {Arc}
     */
    static create(opt) {
        const {
            x, y, radiusX, radiusY, startAngle, endAngle, precision,
        } = opt;
        return new Arc(x, y, radiusX, radiusY, startAngle, endAngle, precision);
    }

    constructor(x, y, radiusX, radiusY, startAngle, endAngle, precision) {
        super();
        this.p0 = new Point(x, y);
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.precision = (precision === undefined || precision < 5) ? 5 : precision;
        // 转换为曲线处理
        this.initCurve(this.getVertexes(this.startAngle, this.endAngle, this.precision));
        this.clazzName = 'Arc';
    }

    clone() {
        return new Arc(this.p0.x, this.p0.y, this.radiusX, this.radiusY, this.startAngle, this.endAngle, this.precision);
    }

    getVertexes(...args) {
        if (!this.vertexes) this.vertexes = this._getVertexes(...args);
        return this.vertexes;
    }

    _getVertexes(beginAngle = 0, endAngle = 360, precision = 5) {
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
        return points;
    }
}

export default Arc;
