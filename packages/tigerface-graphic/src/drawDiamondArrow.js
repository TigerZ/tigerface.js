import { Utilities as T } from 'tigerface-common';
import { Point } from 'tigerface-shape';


function drawDiamondArrow(point, radian, radius = 10, fillStyle, strokeStyle) {
    let diff = T.degreeToRadian(30);

    const p1 = new Point((Math.cos(radian - diff) * radius) + point.x, (Math.sin(radian - diff) * radius)
        + point.y);

    diff = T.degreeToRadian(-30);
    const p2 = new Point((Math.cos(radian - diff) * radius) + point.x, (Math.sin(radian - diff) * radius)
        + point.y);

    this.save();

    this.beginPath();

    this.lineJoin = 'round';
    this.lineCap = 'round';

    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    const length = 2 * Math.sqrt(((3 / 4) * radius) * radius);
    const p3 = new Point((Math.cos(radian) * length) + point.x, (Math.sin(radian) * length) + point.y);
    this.beginPath();
    this.moveTo(p3.x, p3.y);
    this.lineTo(p1.x, p1.y);
    this.lineTo(point.x, point.y);
    this.lineTo(p2.x, p2.y);
    this.lineTo(p3.x, p3.y);
    this.closePath();
    this.fill();
    this.stroke();

    this.closePath();

    this.restore();
}

export default drawDiamondArrow;
