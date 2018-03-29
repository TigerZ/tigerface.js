import { Line } from 'tigerface-shape';

function distance(x0, y0, x1, y1) {
    return Math.sqrt(((x1 - x0) ** 2) + ((y1 - y0) ** 2));
}

export const LineStyle = {
    SOLID: 1,
    DOT: 2,
    DASH: 3,
    DASHDOT: 4,
    DASHDOTDOT: 5,
};

function _drawDottedLine(g, line, props = {}) {
    const {
        lineWidth = 1,
    } = props;

    const {
        dotLength = 3 * lineWidth,
        blankLength = 3 * lineWidth,
    } = props;

    const { x: x0, y: y0 } = line.p0;
    const { x: x1, y: y1 } = line.p1;

    const sectionLength = dotLength + blankLength;
    const deltaX = x1 - x0;
    const deltaY = y1 - y0;
    const slope = Math.atan2(deltaY, deltaX);
    const length = distance(x0, y0, x1, y1);
    const countSection = Math.floor(length / sectionLength);

    const xLen = Math.cos(slope) * sectionLength;
    const yLen = Math.sin(slope) * sectionLength;
    const dotXlen = (xLen * dotLength) / sectionLength;
    const dotYlen = (yLen * dotLength) / sectionLength;

    let x;
    let y;
    for (let i = 0; i < countSection; i += 1) {
        x = x0 + (xLen * i);
        y = y0 + (yLen * i);

        g.moveTo(x, y);
        g.lineTo(x + dotXlen, y + dotYlen);
    }
    x = x0 + (xLen * countSection);
    y = y0 + (yLen * countSection);

    // 因为前面用的Math.floor，所以会不到一段的距离，下面补上
    g.moveTo(x, y);
    if (distance(x, y, x1, y1) >= dotLength) {
        g.lineTo(x + dotXlen, y + dotYlen);
    } else {
        g.lineTo(x1, y1);
    }
}

function _drawLine(g, line) {
    g.moveTo(line.p0.x, line.p0.y);
    g.lineTo(line.p1.x, line.p1.y);
}

function drawLine(line, props = {}) {
    const {
        strokeStyle = 'black',
        lineWidth = 1,
        lineStyle = LineStyle.SOLID,
        stroke = true,
        save = false,
        beginPath = true,
        closePath = true,
        restore = false,
    } = props;

    const {
        dotLength = 3 * lineWidth,
        blankLength = 3 * lineWidth,
        dashLength = 9 * lineWidth,
    } = props;

    const _props = {
        lineWidth,
        strokeStyle,
        stroke,
        save,
        beginPath,
        closePath,
        restore,
    };

    if (save) this.save();
    if (beginPath) this.beginPath();

    if (lineStyle === LineStyle.SOLID) {
        _drawLine(this, line);
    } else if (lineStyle === LineStyle.DOT) {
        _drawDottedLine(
            this,
            line,
            Object.assign(_props, {
                dotLength,
                blankLength,
            }),
        );
    } else if (lineStyle === LineStyle.DASH) {
        _drawDottedLine(
            this,
            line,
            Object.assign(_props, {
                dotLength: dashLength,
                blankLength,
            }),
        );
    } else if (lineStyle === LineStyle.DASHDOT) {
        _drawDottedLine(
            this,
            line,
            Object.assign(_props, {
                dotLength: dashLength,
                blankLength: (blankLength + dotLength) + blankLength,
            }),
        );

        const xLen = Math.cos(line.getSlope()) * (dashLength + blankLength);
        const yLen = Math.sin(line.getSlope()) * (dashLength + blankLength);

        _drawDottedLine(
            this,
            new Line({ x: line.p0.x + xLen, y: line.p0.y + yLen }, { x: line.p1.x, y: line.p1.y }),
            Object.assign(_props, {
                dotLength,
                blankLength: (blankLength + dashLength) + blankLength,
            }),
        );
    } else if (lineStyle === LineStyle.DASHDOTDOT) {
        _drawDottedLine(
            this,
            line,
            Object.assign(_props, {
                dotLength: dashLength,
                blankLength: ((blankLength + dotLength) * 2) + blankLength,
            }),
        );

        let xLen = Math.cos(line.getSlope()) * (dashLength + blankLength);
        let yLen = Math.sin(line.getSlope()) * (dashLength + blankLength);

        _drawDottedLine(
            this,
            new Line({ x: line.p0.x + xLen, y: line.p0.y + yLen }, { x: line.p1.x, y: line.p1.y }),
            Object.assign(_props, {
                dotLength,
                blankLength: ((blankLength + dotLength) + (blankLength + dashLength)) + blankLength,
            }),
        );

        xLen = Math.cos(line.getSlope())
            * (dashLength + blankLength + dotLength + blankLength);
        yLen = Math.sin(line.getSlope())
            * (dashLength + blankLength + dotLength + blankLength);

        _drawDottedLine(
            this,
            new Line({ x: line.p0.x + xLen, y: line.p0.y + yLen }, { x: line.p1.x, y: line.p1.y }),
            Object.assign(_props, {
                dotLength,
                blankLength: blankLength + dotLength + blankLength + dashLength + blankLength,
            }),
        );
    }

    if (closePath) this.closePath();

    if (strokeStyle) {
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;
        if (stroke) this.stroke();
    }

    if (restore) this.restore();
}


export default drawLine;
