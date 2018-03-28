import Graphics from './Graphics';

function _drawLine(g, line, style) {
    if (style === undefined) {
        style = Graphics.LineStyle.DEFAULT;
    }
    if (style === Graphics.LineStyle.SOLID) {
        g.moveTo(line.p0.x, line.p0.y);
        g.lineTo(line.p1.x, line.p1.y);
        if (g.autoApply) g.stroke();
    } else if (style === Graphics.LineStyle.DOT) {
        g._drawSimpleDotLine(
            line.p0.x, line.p0.y, line.p1.x, line.p1.y, g.lineStyle.dotLength,
            g.lineStyle.blankLength,
        );
    } else if (style === Graphics.LineStyle.DASH) {
        g._drawSimpleDotLine(
            line.p0.x, line.p0.y, line.p1.x, line.p1.y, g.lineStyle.dashLength,
            g.lineStyle.blankLength,
        );
    } else if (style === Graphics.LineStyle.DASHDOT) {
        g._drawSimpleDotLine(
            line.p0.x, line.p0.y, line.p1.x, line.p1.y, g.lineStyle.dashLength,
            g.lineStyle.blankLength + g.lineStyle.dotLength + g.lineStyle.blankLength,
        );
        const xLen = Math.cos(line.getSlope()) * (g.lineStyle.dashLength + g.lineStyle.blankLength);
        const yLen = Math.sin(line.getSlope()) * (g.lineStyle.dashLength + g.lineStyle.blankLength);
        g._drawSimpleDotLine(
            line.p0.x + xLen, line.p0.y + yLen, line.p1.x, line.p1.y, g.lineStyle.dotLength,
            g.lineStyle.blankLength + g.lineStyle.dashLength + g.lineStyle.blankLength,
        );
    } else if (style === Graphics.LineStyle.DASHDOTDOT) {
        g._drawSimpleDotLine(
            line.p0.x, line.p0.y, line.p1.x, line.p1.y, g.lineStyle.dashLength,
            ((g.lineStyle.blankLength + g.lineStyle.dotLength) * 2) + g.lineStyle.blankLength,
        );
        let xLen = Math.cos(line.getSlope()) * (g.lineStyle.dashLength + g.lineStyle.blankLength);
        let yLen = Math.sin(line.getSlope()) * (g.lineStyle.dashLength + g.lineStyle.blankLength);
        g._drawSimpleDotLine(
            line.p0.x + xLen, line.p0.y + yLen, line.p1.x, line.p1.y, g.lineStyle.dotLength,
            g.lineStyle.blankLength + g.lineStyle.dotLength + g.lineStyle.blankLength + g.lineStyle.dashLength + g.lineStyle.blankLength,
        );
        xLen = Math.cos(line.getSlope())
            * (g.lineStyle.dashLength + g.lineStyle.blankLength + g.lineStyle.dotLength + g.lineStyle.blankLength);
        yLen = Math.sin(line.getSlope())
            * (g.lineStyle.dashLength + g.lineStyle.blankLength + g.lineStyle.dotLength + g.lineStyle.blankLength);
        g._drawSimpleDotLine(
            line.p0.x + xLen, line.p0.y + yLen, line.p1.x, line.p1.y, g.lineStyle.dotLength,
            g.lineStyle.blankLength + g.lineStyle.dotLength + g.lineStyle.blankLength + g.lineStyle.dashLength + g.lineStyle.blankLength,
        );
    }
}

function drawLine(line, lineStyle) {
    this.beginPath();
    _drawLine(this, line, lineStyle);
    this.closePath();
}

export default drawLine;
