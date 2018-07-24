function drawText(text, props = {}) {
    const {
        x = 0,
        y = 0,
        font = '12px system',
        strokeStyle,
        textAlign = 'left',
        textBaseline = 'bottom',
        lineWidth = 1,
        fill = true,
        stroke = true,
        save = false,
        restore = false,
    } = props;

    let { fillStyle } = props;

    if (!fillStyle && !strokeStyle) fillStyle = 'black';

    if (save) this.save();

    this.font = font;
    this.textAlign = textAlign;
    this.textBaseline = textBaseline;
    this.lineWidth = lineWidth;

    if (fillStyle) {
        this.fillStyle = fillStyle;
        if (fill) this.fillText(text, x, y);
    }

    if (strokeStyle) {
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;
        if (stroke) this.strokeText(text, x, y);
    }

    if (restore) this.restore();
}

export default drawText;
