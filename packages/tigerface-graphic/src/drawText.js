function drawText(text, props = {}) {
    const {
        x = 0,
        y = 0,
        font = '14px system',
        strokeStyle,
        textAlign = 'left',
        textBaseline = 'bottom',
        lineWidth = 1,
    } = props;

    let { fillStyle } = props;

    if (!fillStyle && !strokeStyle) fillStyle = 'black';

    this.save();

    this.font = font;
    this.textAlign = textAlign;
    this.textBaseline = textBaseline;
    this.lineWidth = lineWidth;
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
