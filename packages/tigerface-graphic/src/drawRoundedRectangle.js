import Graphics from './Graphics';

function drawRoundedRectangle(rectangle, radius, drawStyle) {
    this.save();
    this.translate(rectangle.left, rectangle.top);

    this.beginPath();
    this.moveTo(0, radius);
    this.arcTo(0, 0, radius, 0, radius);
    this.arcTo(rectangle.width, 0, rectangle.width, radius, radius);
    this.arcTo(
        rectangle.width, rectangle.height, rectangle.width - radius, rectangle.height,
        radius,
    );
    this.arcTo(0, rectangle.height, 0, rectangle.height - radius, radius);
    this.lineTo(0, radius);
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

    this.restore();
}

export default drawRoundedRectangle;
