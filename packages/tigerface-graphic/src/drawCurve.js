import { Line } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';

function _drawCurve(g, points, props) {
    if (points.length > 1) {
        for (let i = 1; i < points.length; i += 1) {
            const p1 = points[i - 1];
            const p2 = points[i];
            g.drawLine(new Line(p1, p2), props);
        }
    }
}

function drawCurve(curve, props = {}) {
    if (T.isArray(curve)) {
        _drawCurve(this, curve, props);
    } else {
        _drawCurve(this, curve.getPoints(), props);
    }
}

export default drawCurve;
