function drawPolygon(shape, props = {}) {
    const { fillStyle, strokeStyle, lineWidth } = props;
    this.save();

    this.lineJoin = 'round';
    this.lineCap = 'round';
    const points = shape.getVertexes();
    let p1 = points[0];
    let p2;

    this.beginPath();
    this.moveTo(p1.x, p1.y);
    // 注意：下面for循环的边界故意越界，因为第一点既是起始端点又是结束端点。但获取端点时，一定要用[i %
    // this.points.length]来获取
    for (let i = 1; i <= points.length; i += 1) {
        p2 = points[i % points.length];
        this.lineTo(p2.x, p2.y);
        p1 = p2;
    }

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

export default drawPolygon;
