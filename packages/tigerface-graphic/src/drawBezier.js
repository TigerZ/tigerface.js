import { Line } from 'tigerface-shape';
import Graphics from './Graphics';

function _drawQuadraticBezier_(g, bezier) {
    // this.beginPath();
    g.moveTo(bezier.p0.x, bezier.p0.y);
    g.quadraticCurveTo(bezier.p1.x, bezier.p1.y, bezier.p2.x, bezier.p2.y);
    // g.closePath();
    if (g.autoApply) g.stroke();
}

function _drawCubicBezier_(g, bezier) {
    // g.beginPath();
    g.moveTo(bezier.p0.x, bezier.p0.y);
    g.bezierCurveTo(bezier.p1.x, bezier.p1.y, bezier.p2.x, bezier.p2.y, bezier.p3.x, bezier.p3.y);
    // g.closePath();
    if (g.autoApply) g.stroke();
}

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

function _drawCurve(g, points, lineStyle = Graphics.LineStyle.DEFAULT) {
    if (points.length > 1) {
        for (let i = 1; i < points.length; i += 1) {
            const p1 = points[i - 1];
            const p2 = points[i];
            _drawLine(g, new Line(p1, p2), lineStyle);
        }
    }
}

function drawBezier(bezier, lineStyle) {
    this.beginPath();
    if (lineStyle && lineStyle !== Graphics.LineStyle.SOLID) {
        _drawCurve(this, bezier.getPoints(), lineStyle);
    } else if (bezier.clazzName === 'QuadraticBezier') {
        _drawQuadraticBezier_(this, bezier);
    } else if (bezier.clazzName === 'CubicBezier') {
        _drawCubicBezier_(this, bezier);
    } else {
        _drawCurve(this, bezier.getPoints());
    }
    this.closePath();
}

export default drawBezier;
