import { Line, Point } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';

const PointStyle = {
    SOLID: 1,
    HOLLOW: 2,
    MULTIPLICATION: 3,
    PLUS: 4,
};

function drawPoint(point, props) {
    const {
        radius = 3,
        pointStyle = PointStyle.SOLID,
        strokeStyle,
        fillStyle,
    } = props;

    this.save();

    this.beginPath();


    if (pointStyle === PointStyle.SOLID) {
        // 实心圆十字
        this.arc(point.x, point.y, radius, 0, Math.PI * 2);
        this.closePath();

        if (fillStyle) {
            this.fillStyle = fillStyle;
            this.fill();
        }

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
    } else if (pointStyle === PointStyle.HOLLOW) {
        // 空心圆十字
        this.arc(point.x, point.y, radius, 0, Math.PI * 2);
        // 绘制 +
        this.translate(point.x, point.y);
        const { p1: p0 } = Line.bySlope(new Point(0, 0), 0, radius);
        const { p1 } = Line.bySlope(new Point(0, 0), Math.PI, radius);

        this.drawLine(Line.byPoint(p0, p1), { lineWidth: 0.5, strokeStyle });
        this.rotate(Math.PI / 2);
        this.drawLine(Line.byPoint(p0, p1), { lineWidth: 0.5, strokeStyle });
    } else if (pointStyle === PointStyle.MULTIPLICATION) {
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

    if (strokeStyle) {
        this.strokeStyle = strokeStyle;
        this.stroke();
    }


    this.closePath();

    this.restore();
}

export default drawPoint;
