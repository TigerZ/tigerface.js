function drawCircle(circle, props = {}) {
    const {
        fillStyle,
    } = props;

    let { strokeStyle } = props;

    if (!fillStyle && !strokeStyle) strokeStyle = 'black';

    const center = circle.p0;

    this.save();
    this.beginPath();

    this.arc(center.x, center.y, circle.radius, 0, Math.PI * 2);

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

export default drawCircle;
