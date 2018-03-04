/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */
import {Utilities as T} from 'tigerface-common';
import {Shape} from 'tigerface-shape';
import Context from './Context';

export default class Graphics extends Context {
    static PointStyle = {
        SOLID: "solid_circle", // 实心圆
        HOLLOW: "hollow_circle", // 空心圆
        MULTIPLICATION: "multiplication_sign", // 乘号
        PLUS: "plus_sign", // 加号
        DEFAULT: "hollow_circle" // 缺省是空心圆
    };
    static LineStyle = {
        SOLID: "solid", // 实线
        DOT: "dot", // 点虚线 .....
        DASH: "dash", // 划虚线 -----
        DASHDOT: "dashdot", // 划点虚线 _._._._._
        DASHDOTDOT: "dashdotdot", // 划点点虚线 _.._.._..
        DEFAULT: "solid" // 缺省是实线
    };
    static ArrowStyle = {
        NONE: "none", // 箭头
        LINE: "line",
        WHITE: "white",
        BLACK: "black",
        WHITE_DIAMOND: "white_diamond",
        BLACK_DIAMOND: "black_diamond",
        DEFAULT: "line"
    };
    static DrawStyle = {
        NONE: "none",
        STROKE: "stroke",
        FILL: "fill",
        STROKE_FILL: "stroke_fill",
        DEFAULT: "stroke"
    };

    constructor(...args) {
        super(...args);

        this.PointStyle = Graphics.PointStyle;
        this.LineStyle = Graphics.LineStyle;
        this.ArrowStyle = Graphics.ArrowStyle;
        this.DrawStyle = Graphics.DrawStyle;

        this.lineStyle = {
            dotLength: 3 * this.lineWidth,
            dashLength: 9 * this.lineWidth,
            blankLength: 3 * this.lineWidth
        }

        this.autoApply = true;
        this._saved_ = {};
    }

    save() {
        super.save();
        this._saved_.autoApple = this.autoApply;
        this._saved_.lineStyle = this.lineStyle;
    }

    restore() {
        super.restore();
        this.autoApple = this._saved_.autoApply;
        this.lineStyle = this._saved_.lineStyle;
    }

    drawText(text, pos, font, drawStyle) {
        if (font)
            this.font = font;
        if (!drawStyle) drawStyle = Graphics.DrawStyle.DEFAULT;

        if (drawStyle == Graphics.DrawStyle.STROKE || drawStyle == Graphics.DrawStyle.STROKE_FILL) {
            this.strokeText(text, pos.x, pos.y);
        }
        if (drawStyle == Graphics.DrawStyle.FILL || drawStyle == Graphics.DrawStyle.STROKE_FILL) {
            this.fillText(text, pos.x, pos.y);
        }
    }

    drawPoint(point, radius, pointStyle) {
        this.save();

        if (radius == undefined)
            radius = 3;
        if (pointStyle == undefined)
            pointStyle = Graphics.PointStyle.DEFAULT;

        //this.beginPath();
        switch (pointStyle) {
            case Graphics.PointStyle.SOLID: // 实心圆十字
                this.beginPath();
                this.arc(point.x, point.y, radius, 0, Math.PI * 2);
                this.closePath();
                this.autoApply && this.fill();
                // 绘制 +
                this.translate(point.x, point.y);
                this.lineWidth = 0.5;
                var p0 = Shape.Line.bySlope(new Shape.Point(0, 0), 0, radius).p1;
                var p1 = Shape.Line.bySlope(new Shape.Point(0, 0), Math.PI, radius).p1;
                this._drawLine(Shape.Line.byPoint(p0, p1), Graphics.LineStyle.SOLID);
                this.rotate(Math.PI / 2);
                this._drawLine(Shape.Line.byPoint(p0, p1), Graphics.LineStyle.SOLID);
                this.autoApply && this.stroke();
                break;
            case Graphics.PointStyle.HOLLOW: // 空心圆十字
                this.arc(point.x, point.y, radius, 0, Math.PI * 2);
                // 绘制 +
                this.translate(point.x, point.y);
                this.lineWidth = 0.5;
                var p0 = Shape.Line.bySlope(new Shape.Point(0, 0), 0, radius).p1;
                var p1 = Shape.Line.bySlope(new Shape.Point(0, 0), Math.PI, radius).p1;
                this._drawLine(Shape.Line.byPoint(p0, p1), Graphics.LineStyle.SOLID);
                this.rotate(Math.PI / 2);
                this._drawLine(Shape.Line.byPoint(p0, p1), Graphics.LineStyle.SOLID);
                this.autoApply && this.stroke();
                break;
            case Graphics.PointStyle.MULTIPLICATION: // 叉子
                this.translate(point.x, point.y);
                var p0 = Shape.Line.bySlope(new Shape.Point(0, 0), T.degreeToRadian(225), radius).p1;
                var p1 = Shape.Line.bySlope(new Shape.Point(0, 0), T.degreeToRadian(45), radius).p1;
                this._drawLine(Shape.Line.byPoint(p0, p1), Graphics.LineStyle.SOLID);
                this.rotate(T.degreeToRadian(90));
                this._drawLine(Shape.Line.byPoint(p0, p1), Graphics.LineStyle.SOLID);
                this.autoApply && this.stroke();
                break;
            case Graphics.PointStyle.PLUS: // 十字
                this.translate(point.x, point.y);
                var p0 = Shape.Line.bySlope(new Shape.Point(0, 0), 0, radius).p1;
                var p1 = Shape.Line.bySlope(new Shape.Point(0, 0), Math.PI, radius).p1;
                this._drawLine(Shape.Line.byPoint(p0, p1), Graphics.LineStyle.SOLID);
                this.rotate(Math.PI / 2);
                this._drawLine(Shape.Line.byPoint(p0, p1), Graphics.LineStyle.SOLID);
                this.autoApply && this.stroke();
                break;
        }

        this.restore();
        //this.closePath();
    }

    drawLine(line, lineStyle, noPath) {
        //if (!noPath) this.beginPath();
        this._drawLine(line, lineStyle);
        //if (!noPath) this.closePath();
    }

    _drawLine(line, style) {
        if (style == undefined)
            style = Graphics.LineStyle.DEFAULT;

        switch (style) {
            case Graphics.LineStyle.SOLID:
                this.moveTo(line.p0.x, line.p0.y);
                this.lineTo(line.p1.x, line.p1.y);
                this.autoApply && this.stroke();
                break;
            case Graphics.LineStyle.DOT:
                this._drawSimpleDotLine(line.p0.x, line.p0.y, line.p1.x, line.p1.y, this.lineStyle.dotLength,
                    this.lineStyle.blankLength);
                break;
            case Graphics.LineStyle.DASH:
                this._drawSimpleDotLine(line.p0.x, line.p0.y, line.p1.x, line.p1.y, this.lineStyle.dashLength,
                    this.lineStyle.blankLength);
                break;
            case Graphics.LineStyle.DASHDOT:
                this._drawSimpleDotLine(line.p0.x, line.p0.y, line.p1.x, line.p1.y, this.lineStyle.dashLength,
                    this.lineStyle.blankLength + this.lineStyle.dotLength + this.lineStyle.blankLength);
                var xLen = Math.cos(line.getSlope()) * (this.lineStyle.dashLength + this.lineStyle.blankLength);
                var yLen = Math.sin(line.getSlope()) * (this.lineStyle.dashLength + this.lineStyle.blankLength);
                this._drawSimpleDotLine(line.p0.x + xLen, line.p0.y + yLen, line.p1.x, line.p1.y, this.lineStyle.dotLength,
                    this.lineStyle.blankLength + this.lineStyle.dashLength + this.lineStyle.blankLength);
                break;
            case Graphics.LineStyle.DASHDOTDOT:
                this._drawSimpleDotLine(line.p0.x, line.p0.y, line.p1.x, line.p1.y, this.lineStyle.dashLength,
                    (this.lineStyle.blankLength + this.lineStyle.dotLength) * 2 + this.lineStyle.blankLength);
                var xLen = Math.cos(line.getSlope()) * (this.lineStyle.dashLength + this.lineStyle.blankLength);
                var yLen = Math.sin(line.getSlope()) * (this.lineStyle.dashLength + this.lineStyle.blankLength);
                this._drawSimpleDotLine(line.p0.x + xLen, line.p0.y + yLen, line.p1.x, line.p1.y, this.lineStyle.dotLength,
                    this.lineStyle.blankLength + this.lineStyle.dotLength + this.lineStyle.blankLength + this.lineStyle.dashLength + this.lineStyle.blankLength);
                xLen = Math.cos(line.getSlope())
                    * (this.lineStyle.dashLength + this.lineStyle.blankLength + this.lineStyle.dotLength + this.lineStyle.blankLength);
                yLen = Math.sin(line.getSlope())
                    * (this.lineStyle.dashLength + this.lineStyle.blankLength + this.lineStyle.dotLength + this.lineStyle.blankLength);
                this._drawSimpleDotLine(line.p0.x + xLen, line.p0.y + yLen, line.p1.x, line.p1.y, this.lineStyle.dotLength,
                    this.lineStyle.blankLength + this.lineStyle.dotLength + this.lineStyle.blankLength + this.lineStyle.dashLength + this.lineStyle.blankLength);
                break;
        }

    }

    drawArrow(point, radian, radius, style) {
        if (style == undefined)
            style = Graphics.ArrowStyle.DEFAULT;
        var diff = T.degreeToRadian(30);
        if (radius == undefined)
            radius = 10;
        var p1 = new Shape.Point(Math.cos(radian - diff) * radius + point.x, Math.sin(radian - diff) * radius
            + point.y);
        // var line1 = new Shape.Line(point, p1);

        diff = T.degreeToRadian(-30);
        var p2 = new Shape.Point(Math.cos(radian - diff) * radius + point.x, Math.sin(radian - diff) * radius
            + point.y);

        // var line2 = new Shape.Line(point, p2);
        this.save();
        //this.beginPath();
        this.lineJoin = "round";
        this.lineCap = "round";
        switch (style) {
            case Graphics.ArrowStyle.LINE:
                this.moveTo(p1.x, p1.y);
                this.lineTo(point.x, point.y);
                this.lineTo(p2.x, p2.y);
                this.closePath();
                this.autoApply && this.stroke();
                break;
            case Graphics.ArrowStyle.WHITE:
                this.fillStyle = "rgb(255,255,255)";
                this.beginPath();
                this.moveTo(p1.x, p1.y);
                this.lineTo(point.x, point.y);
                this.lineTo(p2.x, p2.y);
                this.lineTo(p1.x, p1.y);
                this.closePath();
                this.autoApply && this.fill();
                this.autoApply && this.stroke();
                break;
            case Graphics.ArrowStyle.WHITE_DIAMOND:
                this.fillStyle = "rgb(255,255,255)";
                var length = 2 * Math.sqrt(3 / 4 * radius * radius);
                var p3 = new Shape.Point(Math.cos(radian) * length + point.x, Math.sin(radian) * length + point.y);
                this.beginPath();
                this.moveTo(p3.x, p3.y);
                this.lineTo(p1.x, p1.y);
                this.lineTo(point.x, point.y);
                this.lineTo(p2.x, p2.y);
                this.lineTo(p3.x, p3.y);
                this.closePath();
                this.autoApply && this.fill();
                this.autoApply && this.stroke();
                break;
            case Graphics.ArrowStyle.BLACK_DIAMOND:
                this.fillStyle = "rgb(0,0,0)";
                var length = 2 * Math.sqrt(3 / 4 * radius * radius);
                var p3 = new Shape.Point(Math.cos(radian) * length + point.x, Math.sin(radian) * length + point.y);
                this.beginPath();
                this.moveTo(p3.x, p3.y);
                this.lineTo(p1.x, p1.y);
                this.lineTo(point.x, point.y);
                this.lineTo(p2.x, p2.y);
                this.lineTo(p3.x, p3.y);
                this.closePath();
                this.autoApply && this.fill();
                this.autoApply && this.stroke();
                break;
            case Graphics.ArrowStyle.BLACK:
                this.fillStyle = "rgb(0,0,0)";
                this.beginPath();
                this.moveTo(p1.x, p1.y);
                this.lineTo(point.x, point.y);
                this.lineTo(p2.x, p2.y);
                this.lineTo(p1.x, p1.y);
                this.closePath();
                this.autoApply && this.fill();
                this.autoApply && this.stroke();
                break;
        }
        //this.closePath();
        this.restore();
    }

    drawBezier(bezier, lineStyle, noPath) {
        if (lineStyle && lineStyle != Graphics.LineStyle.SOLID) {
            this._drawCurve(bezier.getPoints(), lineStyle);
        } else if (bezier.className == "QuadraticBezier") {
            this._drawQuadraticBezier_(bezier);
        } else if (bezier.className == "CubicBezier") {
            this._drawCubicBezier_(bezier);
        } else {
            this._drawCurve(bezier.getPoints());
        }
    }

    _drawQuadraticBezier_(bezier) {
        //this.beginPath();
        this.moveTo(bezier.p0.x, bezier.p0.y);
        this.quadraticCurveTo(bezier.p1.x, bezier.p1.y, bezier.p2.x, bezier.p2.y);
        //this.closePath();
        this.autoApply && this.stroke();
    }

    _drawCubicBezier_(bezier) {
        //this.beginPath();
        this.moveTo(bezier.p0.x, bezier.p0.y);
        this.bezierCurveTo(bezier.p1.x, bezier.p1.y, bezier.p2.x, bezier.p2.y, bezier.p3.x, bezier.p3.y);
        //this.closePath();
        this.autoApply && this.stroke();
    }

    drawCurve(curve, lineStyle) {
        //this.beginPath();
        this.lineJoin = "round";
        this.lineCap = "round";
        if (T.isArray(curve))
            this._drawCurve(curve, lineStyle);
        else
            this._drawCurve(curve.getPoints(), lineStyle);
        //this.closePath();
    }

    _drawCurve(points, lineStyle) {
        if (lineStyle == undefined)
            lineStyle = Graphics.LineStyle.DEFAULT;

        if (points.length > 1) {
            for (var i = 1; i < points.length; i++) {
                var p1 = points[i - 1];
                var p2 = points[i];
                this.drawLine(new Shape.Line(p1, p2), lineStyle);
            }
        }
    }

    drawCircle(circle, drawStyle) {
        var center = circle.p0;

        this.beginPath();
        this.arc(center.x, center.y, circle.radius, 0, Math.PI * 2);
        this.closePath();

        if (drawStyle == undefined)
            drawStyle = Graphics.DrawStyle.DEFAULT;

        if (drawStyle == Graphics.DrawStyle.FILL || drawStyle == Graphics.DrawStyle.STROKE_FILL) {
            this.autoApply && this.fill();
        }
        if (drawStyle == Graphics.DrawStyle.STROKE || drawStyle == Graphics.DrawStyle.STROKE_FILL) {
            this.autoApply && this.stroke();
        }

    }

    drawEllipse(ellipse, drawStyle) {
        this.drawPolygon(ellipse, drawStyle);
    }

    drawRectangle(rectangle, drawStyle) {
        this.beginPath();
        this.rect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
        this.closePath();
        if (drawStyle == undefined)
            drawStyle = Graphics.DrawStyle.DEFAULT;
        if (drawStyle == Graphics.DrawStyle.FILL || drawStyle == Graphics.DrawStyle.STROKE_FILL) {
            this.autoApply && this.fill();
        }
        if (drawStyle == Graphics.DrawStyle.STROKE || drawStyle == Graphics.DrawStyle.STROKE_FILL) {
            this.autoApply && this.stroke();
        }
    }

    drawRoundedRectangle(rectangle, radius, drawStyle) {
        this.save();
        this.translate(rectangle.left, rectangle.top);

        this.beginPath();
        this.moveTo(0, radius);
        this.arcTo(0, 0, radius, 0, radius);
        this.arcTo(rectangle.width, 0, rectangle.width, radius, radius);
        this.arcTo(rectangle.width, rectangle.height, rectangle.width - radius, rectangle.height,
            radius);
        this.arcTo(0, rectangle.height, 0, rectangle.height - radius, radius);
        this.lineTo(0, radius);
        this.closePath();

        if (drawStyle == undefined)
            drawStyle = Graphics.DrawStyle.DEFAULT;
        if (drawStyle == Graphics.DrawStyle.FILL || drawStyle == Graphics.DrawStyle.STROKE_FILL) {
            this.autoApply && this.fill();
        }
        if (drawStyle == Graphics.DrawStyle.STROKE || drawStyle == Graphics.DrawStyle.STROKE_FILL) {
            this.autoApply && this.stroke();
        }

        this.restore();
    }

    drawPolygon(shape, drawStyle) {

        this.lineJoin = "round";
        this.lineCap = "round";
        var points = shape.getVertexes();
        var p1, p2;
        p1 = points[0];

        this.beginPath();
        this.moveTo(p1.x, p1.y);
        // 注意：下面for循环的边界故意越界，因为第一点既是起始端点又是结束端点。但获取端点时，一定要用[i %
        // this.points.length]来获取
        for (var i = 1; i <= points.length; i++) {
            p2 = points[i % points.length];
            this.lineTo(p2.x, p2.y);
            p1 = p2;
        }
        this.closePath();

        if (drawStyle == undefined)
            drawStyle = Graphics.DrawStyle.DEFAULT;
        if (drawStyle == Graphics.DrawStyle.FILL || drawStyle == Graphics.DrawStyle.STROKE_FILL) {
            this.autoApply && this.fill();
        }
        if (drawStyle == Graphics.DrawStyle.STROKE || drawStyle == Graphics.DrawStyle.STROKE_FILL) {
            this.autoApply && this.stroke();
        }

    }

    drawRoundedPolygon(shape, radius, drawStyle, precision) {
        this.drawPolygon(shape.convertRounded(radius, precision), drawStyle);
    }

    _drawSimpleDotLine(x0, y0, x1, y1, dotLength, blankLength) {
        var sectionLength = dotLength + blankLength;
        var deltaX = x1 - x0;
        var deltaY = y1 - y0;
        var slope = Math.atan2(deltaY, deltaX);
        var length = this._distance(x0, y0, x1, y1);

        // console.log(dotXlen+", "+dotYlen);
        var countSection = Math.floor(length / sectionLength);

        var xLen = Math.cos(slope) * sectionLength;
        var yLen = Math.sin(slope) * sectionLength;
        var dotXlen = xLen * dotLength / sectionLength;
        var dotYlen = yLen * dotLength / sectionLength;
        var i = 0;
        var x, y;
        for (; i < countSection; ++i) {
            x = x0 + xLen * i;
            y = y0 + yLen * i;
            this.moveTo(x, y);
            this.lineTo(x + dotXlen, y + dotYlen);
        }
        x = x0 + xLen * countSection;
        y = y0 + yLen * countSection;

        // console.log(length / sectionLength - countSection);

        // 因为前面用的Math.floor，所以会不到一段的距离，下面补上
        this.moveTo(x, y);
        if (this._distance(x, y, x1, y1) >= dotLength) {
            this.lineTo(x + dotXlen, y + dotYlen);
        } else {
            this.lineTo(x1, y1);
        }
        this.autoApply && this.stroke();
    }

    _distance(x0, y0, x1, y1) {
        return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
    }
}

