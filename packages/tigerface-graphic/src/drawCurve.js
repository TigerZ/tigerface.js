import { Line } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';
import Graphics from './Graphics';

function _drawCurve(points, lineStyle = Graphics.LineStyle.DEFAULT) {
    if (points.length > 1) {
        for (let i = 1; i < points.length; i += 1) {
            const p1 = points[i - 1];
            const p2 = points[i];
            this._drawLine(new Line(p1, p2), lineStyle);
        }
    }
}

function drawCurve(curve, lineStyle = Graphics.LineStyle.DEFAULT) {
    this.beginPath();
    this.lineJoin = 'round';
    this.lineCap = 'round';
    if (T.isArray(curve)) {
        _drawCurve(curve, lineStyle);
    } else {
        _drawCurve(curve.getPoints(), lineStyle);
    }
    this.closePath();
}

export default drawCurve;
