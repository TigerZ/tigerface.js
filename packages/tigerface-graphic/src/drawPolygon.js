function drawPolygon(shape, props = {}) {
    const {
        lineWidth = 1,
        fillStyle,
        fill = true,
        stroke = true,
        save = false,
        beginPath = true,
        closePath = true,
        restore = false,
    } = props;
    let { strokeStyle } = props;

    if (!fillStyle && !strokeStyle) strokeStyle = 'black';

    if (save) this.save();
    if (beginPath) this.beginPath();

    this.lineJoin = 'round';
    this.lineCap = 'round';

    const points = shape.getVertexes();
    let p1 = points[0];
    let p2;

    this.moveTo(p1.x, p1.y);
    // 注意：下面for循环的边界故意越界，因为第一点既是起始端点又是结束端点。但获取端点时，一定要用[i %
    // this.points.length]来获取
    for (let i = 1; i <= points.length; i += 1) {
        p2 = points[i % points.length];
        this.lineTo(p2.x, p2.y);
        p1 = p2;
    }

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

export default drawPolygon;
