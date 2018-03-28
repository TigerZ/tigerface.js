function distance(x0, y0, x1, y1) {
    return Math.sqrt(((x1 - x0) ** 2) + ((y1 - y0) ** 2));
}

function _drawSimpleDotLine(g, line, lineWidth) {
    const dotLength = 3 * lineWidth;
    const blankLength = 3 * lineWidth;
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
    let i = 0;
    let x;
    let y;
    for (; i < countSection; i += 1) {
        x = x0 + (xLen * i);
        y = y0 + (yLen * i);

        g.moveTo(x, y);
        g.lineTo(x + dotXlen, y + dotYlen);
    }
    x = x0 + (xLen * countSection);
    y = y0 + (yLen * countSection);

    // console.log(length / sectionLength - countSection);

    // 因为前面用的Math.floor，所以会不到一段的距离，下面补上
    g.moveTo(x, y);
    if (distance(x, y, x1, y1) >= dotLength) {
        g.lineTo(x + dotXlen, y + dotYlen);
    } else {
        g.lineTo(x1, y1);
    }
    if (g.autoApply) g.stroke();
}

function drawDottedLine(line, lineWidth) {
    this.beginPath();
    this.lineWidth = lineWidth;

    _drawSimpleDotLine(this, line, lineWidth);

    this.closePath();
}

export default drawDottedLine;
