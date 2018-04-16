import { Line } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';

function _drawCurve(g, points, props) {
    const {
        lineStyle,
        strokeStyle,
        lineWidth,
    } = props;

    const lineProps = {
        lineStyle,
        strokeStyle,
        lineWidth,
        stroke: false,
        save: false,
        beginPath: false,
        closePath: false,
        restore: false,
    };

    if (points.length > 1) {
        for (let i = 1; i < points.length; i += 1) {
            const p1 = points[i - 1];
            const p2 = points[i];
            g.drawLine(new Line(p1, p2), lineProps);
        }
    }
}

function drawCurve(curve, props = {}) {
    const {
        lineStyle = this.LineStyle.SOLID,
        strokeStyle = 'black',
        lineWidth = 1,
        stroke = true,
        save = false,
        beginPath = true,
        closePath = true,
    } = props;

    if (save) this.save();
    if (beginPath) this.beginPath();

    if (T.isArray(curve)) {
        _drawCurve(this, curve, {
            lineStyle,
            strokeStyle,
            lineWidth,
        });
    } else {
        _drawCurve(this, curve.getPoints(), {
            lineStyle,
            strokeStyle,
            lineWidth,
        });
    }

    if (closePath) this.closePath();

    if (strokeStyle) {
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;
        if (stroke) this.stroke();
    }

    if (save) this.restore();
}

export default drawCurve;
