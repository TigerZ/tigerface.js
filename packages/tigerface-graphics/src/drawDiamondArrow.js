import { Utilities as T } from 'tigerface-common';
import { Point } from 'tigerface-shape';


function drawDiamondArrow(point, props = {}) {
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

    if (save) this.save();
    if (beginPath) this.beginPath();

    let { strokeStyle } = props;

    if (!fillStyle && !strokeStyle) strokeStyle = 'black';

    const radian = T.degreeToRadian(rotation);
    let diff = T.degreeToRadian(angle / 2);
    const p1 = new Point((Math.cos(radian - diff) * radius) + point.x, (Math.sin(radian - diff) * radius)
        + point.y);
    diff = T.degreeToRadian(-angle / 2);
    const p2 = new Point((Math.cos(radian - diff) * radius) + point.x, (Math.sin(radian - diff) * radius)
        + point.y);

    this.lineJoin = 'round';
    this.lineCap = 'round';

    const length = 2 * Math.sqrt(((3 / 4) * radius) * radius);
    const p3 = new Point((Math.cos(radian) * length) + point.x, (Math.sin(radian) * length) + point.y);
    this.moveTo(p3.x, p3.y);
    this.lineTo(p1.x, p1.y);
    this.lineTo(point.x, point.y);
    this.lineTo(p2.x, p2.y);
    this.lineTo(p3.x, p3.y);

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

export default drawDiamondArrow;
