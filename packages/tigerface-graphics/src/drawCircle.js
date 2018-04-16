function drawCircle(circle, props = {}) {
    const {
        strokeStyle,
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

    const center = circle.p0;

    this.arc(center.x, center.y, circle.radius, 0, Math.PI * 2);

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

export default drawCircle;
