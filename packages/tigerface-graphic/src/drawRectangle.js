function drawRectangle(rectangle, props = {}) {
    const { fillStyle, strokeStyle } = props;

    this.save();
    this.beginPath();

    this.rect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);

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
