import { Utilities as T } from 'tigerface-common';
import { Point } from 'tigerface-shape';

function drawArrow(point, props = {}) {
    const {
        angle = 60,
        rotation = 0,
        radius = 10,
        lineWidth = 1,
        fillStyle,
    } = props;

    let { strokeStyle } = props;

    if (!fillStyle && !strokeStyle) strokeStyle = 'black';

    const radian = T.degreeToRadian(rotation);
    let diff = T.degreeToRadian(angle / 2);
    const p1 = new Point((Math.cos(radian - diff) * radius) + point.x, (Math.sin(radian - diff) * radius)
        + point.y);
    diff = T.degreeToRadian(-angle / 2);
    const p2 = new Point((Math.cos(radian - diff) * radius) + point.x, (Math.sin(radian - diff) * radius)
        + point.y);

    this.save();
    this.beginPath();

    this.lineJoin = 'round';
    this.lineCap = 'round';

    this.moveTo(p1.x, p1.y);
    this.lineTo(point.x, point.y);
    this.lineTo(p2.x, p2.y);
    this.lineTo(p1.x, p1.y);

    this.lineWidth = lineWidth;

    if (fillStyle) {
        this.fillStyle = fillStyle;
        this.fill();
    }
    if (strokeStyle) {
        this.strokeStyle = strokeStyle;
        this.stroke();
    }

    this.closePath();
    this.restore();
}

export default drawArrow;

