import Graphics from './Graphics';

function drawCircle(circle, drawStyle) {
    const center = circle.p0;

    this.beginPath();
    this.arc(center.x, center.y, circle.radius, 0, Math.PI * 2);
    this.closePath();

    if (drawStyle === undefined) {
        drawStyle = Graphics.DrawStyle.DEFAULT;
    }

    if (drawStyle === Graphics.DrawStyle.FILL || drawStyle === Graphics.DrawStyle.STROKE_FILL) {
        if (this.autoApply) this.fill();
    }
    if (drawStyle === Graphics.DrawStyle.STROKE || drawStyle === Graphics.DrawStyle.STROKE_FILL) {
        if (this.autoApply) this.stroke();
    }
}

export default drawCircle;
