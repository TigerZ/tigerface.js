function drawBezier(bezier, props = {}) {
    const {
        strokeStyle,
        lineWidth = 1,
        stroke = true,
        save = false,
        beginPath = true,
        closePath = true,
        restore = false,
    } = props;

    if (save) this.save();
    if (beginPath) this.beginPath();

    if (bezier.clazzName === 'QuadraticBezier') {
        this.moveTo(bezier.p0.x, bezier.p0.y);
        this.quadraticCurveTo(bezier.p1.x, bezier.p1.y, bezier.p2.x, bezier.p2.y);
    } else if (bezier.clazzName === 'CubicBezier') {
        this.moveTo(bezier.p0.x, bezier.p0.y);
        this.bezierCurveTo(bezier.p1.x, bezier.p1.y, bezier.p2.x, bezier.p2.y, bezier.p3.x, bezier.p3.y);
    } else {
        this.drawCurve(bezier.getPoints(), {
            strokeStyle,
            lineWidth,
            stroke: false,
            save: false,
            beginPath: false,
            closePath: false,
            restore: false,
        });
    }

    if (strokeStyle) {
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;
        if (stroke) this.stroke();
    }

    if (closePath) this.closePath();

    if (restore) this.restore();
}

export default drawBezier;
