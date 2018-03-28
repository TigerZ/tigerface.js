function drawText(text, props = {}) {
    const {
        x = 0,
        y = 0,
        font = '12px default',
        fillStyle,
        strokeStyle,
        textAlign = 'left',
        textBaseline = 'bottom',
    } = props;

    this.save();

    this.font = font;
    this.textAlign = textAlign;
    this.textBaseline = textBaseline;

    if (strokeStyle) {
        this.strokeStyle = strokeStyle;
        this.strokeText(text, x, y);
    }
    if (fillStyle) {
        this.fillStyle = fillStyle;
        this.fillText(text, x, y);
    }

    this.restore();
}

export default drawText;
