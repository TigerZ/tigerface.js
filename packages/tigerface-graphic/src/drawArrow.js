import { Utilities as T } from 'tigerface-common';
import { Point } from 'tigerface-shape';
import Graphics from './Graphics';


function drawArrow(point, radian, radius, style) {
    if (style === undefined) {
        style = Graphics.ArrowStyle.DEFAULT;
    }
    let diff = T.degreeToRadian(30);
    if (radius === undefined) {
        radius = 10;
    }
    const p1 = new Point((Math.cos(radian - diff) * radius) + point.x, (Math.sin(radian - diff) * radius)
        + point.y);
    // let line1 = new Line(point, p1);

    diff = T.degreeToRadian(-30);
    const p2 = new Point((Math.cos(radian - diff) * radius) + point.x, (Math.sin(radian - diff) * radius)
        + point.y);

    // let line2 = new Line(point, p2);
    this.save();
    // this.beginPath();
    this.lineJoin = 'round';
    this.lineCap = 'round';
    if (style === Graphics.ArrowStyle.LINE) {
        this.moveTo(p1.x, p1.y);
        this.lineTo(point.x, point.y);
        this.lineTo(p2.x, p2.y);
        this.closePath();
        if (this.autoApply) this.stroke();
    } else if (style === Graphics.ArrowStyle.WHITE) {
        this.fillStyle = 'rgb(255,255,255)';
        this.beginPath();
        this.moveTo(p1.x, p1.y);
        this.lineTo(point.x, point.y);
        this.lineTo(p2.x, p2.y);
        this.lineTo(p1.x, p1.y);
        this.closePath();
        if (this.autoApply) this.fill();
        if (this.autoApply) this.stroke();
    } else if (style === Graphics.ArrowStyle.WHITE_DIAMOND) {
        this.fillStyle = 'rgb(255,255,255)';
        const length = 2 * Math.sqrt(((3 / 4) * radius) * radius);
        const p3 = new Point((Math.cos(radian) * length) + point.x, (Math.sin(radian) * length) + point.y);
        this.beginPath();
        this.moveTo(p3.x, p3.y);
        this.lineTo(p1.x, p1.y);
        this.lineTo(point.x, point.y);
        this.lineTo(p2.x, p2.y);
        this.lineTo(p3.x, p3.y);
        this.closePath();
        if (this.autoApply) this.fill();
        if (this.autoApply) this.stroke();
    } else if (style === Graphics.ArrowStyle.BLACK_DIAMOND) {
        this.fillStyle = 'rgb(0,0,0)';
        const length = 2 * Math.sqrt(((3 / 4) * radius) * radius);
        const p3 = new Point((Math.cos(radian) * length) + point.x, (Math.sin(radian) * length) + point.y);
        this.beginPath();
        this.moveTo(p3.x, p3.y);
        this.lineTo(p1.x, p1.y);
        this.lineTo(point.x, point.y);
        this.lineTo(p2.x, p2.y);
        this.lineTo(p3.x, p3.y);
        this.closePath();
        if (this.autoApply) this.fill();
        if (this.autoApply) this.stroke();
    } else if (style === Graphics.ArrowStyle.BLACK) {
        this.fillStyle = 'rgb(0,0,0)';
        this.beginPath();
        this.moveTo(p1.x, p1.y);
        this.lineTo(point.x, point.y);
        this.lineTo(p2.x, p2.y);
        this.lineTo(p1.x, p1.y);
        this.closePath();
        if (this.autoApply) this.fill();
        if (this.autoApply) this.stroke();
    }
    // this.closePath();
    this.restore();
}

export default drawArrow;

