function drawRectangle(rectangle, props = {}) {
    const { fillStyle, lineWidth = 1 } = props;
    let { strokeStyle } = props;
    if (!fillStyle && !strokeStyle) strokeStyle = 'black';

    this.save();
    this.beginPath();

    this.rect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);

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

export default drawRectangle;
