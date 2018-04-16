import { Utilities as T } from 'tigerface-common';
import { Point } from 'tigerface-shape';

function drawArrow(point, props = {}) {
    const {
        angle = 60,
        rotation = 0,
        radius = 10,
        lineWidth = 1,
        fillStyle,
        fill = true,
        stroke = true,
        save = false,
        beginPath = true,
        closePath = true,
        restore = false,
    } = props;

    let { strokeStyle } = props;
    if (!fillStyle && !strokeStyle) strokeStyle = 'black';

    if (save) this.save();
    if (beginPath) this.beginPath();

    const radian = T.degreeToRadian(rotation);
    let diff = T.degreeToRadian(angle / 2);
    const p1 = new Point((Math.cos(radian - diff) * radius) + point.x, (Math.sin(radian - diff) * radius)
        + point.y);
    diff = T.degreeToRadian(-angle / 2);
    const p2 = new Point((Math.cos(radian - diff) * radius) + point.x, (Math.sin(radian - diff) * radius)
        + point.y);

    this.lineJoin = 'round';
    this.lineCap = 'round';

    this.moveTo(p1.x, p1.y);
    this.lineTo(point.x, point.y);
    this.lineTo(p2.x, p2.y);
    this.lineTo(p1.x, p1.y);

    if (closePath) this.closePath();

    if (fillStyle) {
        this.fillStyle = fillStyle;
        if (fill) this.fill();
    }

    if (strokeStyle) {
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;
        if (stroke) this.stroke();
    }

    if (restore) this.restore();
}

export default drawArrow;

