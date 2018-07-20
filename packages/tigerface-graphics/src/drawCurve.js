import { Line } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';

function _drawCurve(g, points, props) {
    const {
        lineStyle,
        strokeStyle,
        lineWidth,
        lineJoin,
    } = props;

    const lineProps = {
        lineStyle,
        strokeStyle,
        lineWidth,
        lineJoin,
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
        lineJoin = 'round',
        lineCap = 'round',
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
            lineJoin,
            lineCap,
        });
    } else {
        _drawCurve(this, curve.getPoints(), {
            lineStyle,
            strokeStyle,
            lineWidth,
            lineJoin,
            lineCap,
        });
    }

    if (closePath) this.closePath();

    if (strokeStyle) {
        this.lineWidth = lineWidth;
        this.lineJoin = lineJoin;
        this.lineCap = lineCap;
        this.strokeStyle = strokeStyle;
        if (stroke) this.stroke();
    }

    if (save) this.restore();
}

export default drawCurve;
