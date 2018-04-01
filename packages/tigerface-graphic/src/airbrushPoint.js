import { Circle } from 'tigerface-shape';

function airbrushPoint(point, props = {}) {
    const {
        fillStyle,
        fill = true,
        save = false,
        restore = false,
        radius = 25,
    } = props;

    const {
        blur = 4 * radius,
    } = props;

    let { strokeStyle } = props;

    if (!fillStyle && !strokeStyle) strokeStyle = 'black';

    if (save) this.save();

    this.shadowColor = fillStyle;
    this.shadowOffsetX = 20000;
    this.shadowOffsetY = 20000;
    this.shadowBlur = blur;
    this.drawCircle(new Circle(point.x - 20000, point.y - 20000, radius), {
        fillStyle,
    });

    if (fillStyle) {
        this.fillStyle = fillStyle;
        if (fill) this.fill();
    }

    if (restore) this.restore();
}

export default airbrushPoint;
