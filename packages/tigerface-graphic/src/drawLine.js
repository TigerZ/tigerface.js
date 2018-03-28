function drawLine(line, props = {}) {
    this.save();

    const { fillStyle, strokeStyle, lineWidth } = props;
    this.beginPath();

    this.moveTo(line.p0.x, line.p0.y);
    this.lineTo(line.p1.x, line.p1.y);

    if (lineWidth) {
        this.lineWidth = lineWidth;
    }

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

export default drawLine;
