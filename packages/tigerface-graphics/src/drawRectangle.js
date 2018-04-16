function drawRectangle(rectangle, props = {}) {
    const {
        lineWidth = 1,
        fillStyle,
        strokeStyle,
        fill = true,
        stroke = true,
        save = false,
        beginPath = true,
        closePath = true,
        restore = false,
    } = props;

    if (save) this.save();
    if (beginPath) this.beginPath();

    this.rect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);

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

export default drawRectangle;
