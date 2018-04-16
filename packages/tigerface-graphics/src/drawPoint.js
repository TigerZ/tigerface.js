import { Line, Point } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';

export const PointStyle = {
    ROUND_PLUS: 1,
    PLUS: 2,
    MULTIPLY: 3,
};

function drawPoint(point, props = {}) {
    const {
        radius = 3,
        lineWidth = 1,
        pointStyle = PointStyle.ROUND_PLUS,
        strokeStyle = 'black',
        stroke = true,
        save = true,
        beginPath = true,
        closePath = true,
        restore = true,
    } = props;

    if (save) this.save();
    if (beginPath) this.beginPath();


    if (pointStyle === PointStyle.ROUND_PLUS) {
        // 空心圆十字
        this.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.closePath();

        if (strokeStyle) {
            this.strokeStyle = strokeStyle;
            this.stroke();
        }
        // 绘制 +
        this.translate(point.x, point.y);
        const { p1: p0 } = Line.bySlope(new Point(0, 0), 0, radius);
        const { p1 } = Line.bySlope(new Point(0, 0), Math.PI, radius);

        this.drawLine(Line.byPoint(p0, p1), { lineWidth: 0.5, strokeStyle });
        this.rotate(Math.PI / 2);
        this.drawLine(Line.byPoint(p0, p1), { lineWidth: 0.5, strokeStyle });
    } else if (pointStyle === PointStyle.MULTIPLY) {
        // 叉子
        this.translate(point.x, point.y);
        const { p1: p0 } = Line.bySlope(new Point(0, 0), T.degreeToRadian(225), radius);
        const { p1 } = Line.bySlope(new Point(0, 0), T.degreeToRadian(45), radius);

        this.drawLine(Line.byPoint(p0, p1), { lineWidth: 0.5, strokeStyle });
        this.rotate(T.degreeToRadian(90));
        this.drawLine(Line.byPoint(p0, p1), { lineWidth: 0.5, strokeStyle });
    } else if (pointStyle === PointStyle.PLUS) {
        // 十字
        this.translate(point.x, point.y);
        const { p1: p0 } = Line.bySlope(new Point(0, 0), 0, radius);
        const { p1 } = Line.bySlope(new Point(0, 0), Math.PI, radius);
        this.drawLine(Line.byPoint(p0, p1), { lineWidth: 0.5, strokeStyle });
        this.rotate(Math.PI / 2);
        this.drawLine(Line.byPoint(p0, p1), { lineWidth: 0.5, strokeStyle });
    }

    if (closePath) this.closePath();

    if (strokeStyle) {
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;
        if (stroke) this.stroke();
    }

    if (restore) this.restore();
}

export default drawPoint;
