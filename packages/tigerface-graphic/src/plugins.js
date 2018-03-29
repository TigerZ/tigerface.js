import drawPoint, { PointStyle } from './drawPoint';
import drawText from './drawText';
import drawArrow from './drawArrow';
import drawCurve from './drawCurve';
import drawBezier from './drawBezier';
import drawCircle from './drawCircle';
import drawDiamondArrow from './drawDiamondArrow';
import drawLine, { LineStyle } from './drawLine';
import drawPolygon from './drawPolygon';
import drawRectangle from './drawRectangle';
import drawRoundedPolygon from './drawRoundedPolygon';
import drawImageUrl from './drawImageUrl';

const plugins = {
    PointStyle,
    LineStyle,
    drawArrow,
    drawBezier,
    drawCircle,
    drawCurve,
    drawDiamondArrow,
    drawLine,
    drawPoint,
    drawPolygon,
    drawRectangle,
    drawRoundedPolygon,
    drawText,
    drawImageUrl,
};

export default plugins;
