import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Circle, Line, Point, CubicBezier } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';
import { Tween, TweenAction } from "RootPath/packages/tigerface-action";

const stage = new Stage({
    width: 350,
    height: 200,
    style: {
        // backgroundColor: 'rgba(255,255,0,0.3)',
    },
}, document.getElementById('gum') || document.documentElement);


class Ball extends CanvasSprite {
    constructor(opt) {
        super({});
        this.assign(opt);
        this.addBound(new Circle(0, 0, this.radius));
    }

    paint(g) {
        // g.drawCircle(this.bounds[0], {
        //     strokeStyle: 'rgba(0,0,0.5)',
        // });
    }
}

class Panel extends CanvasSprite {
    constructor(opt) {
        super({
            width: 350,
            height: 200,
        });
        this.assign(opt);
        this.big = new Ball({
            name: 'big',
            radius: 30,
            x: 100,
            y: 50,
        });
        this.small = new Ball({
            name: 'small',
            radius: 20,
            x: 100,
            y: 50,
        });
        this.addChild(this.small);
        this.addChild(this.big);
        this.big.enableDrag();
        this.onMouseOut = () => {
            if (this.big.dragging) this.back();
        };
        this.big.onDragEnd = () => {
            this.back();
        };
        this.big.onDragStart = () => {
            if (this.tweenX) this.tweenX.stop();
            if (this.tweenY) this.tweenY.stop();
        };
    }

    back = () => {
        this.big.disableDrag();

        this.tweenX = new TweenAction(this.big, {
            prop: 'x',
            end: this.small.x,
            time: 800,
            effect: Tween.Elastic.easeOut,
        });
        this.tweenX.start();
        this.tweenY = new TweenAction(this.big, {
            prop: 'y',
            end: this.small.y,
            time: 800,
            effect: Tween.Elastic.easeOut,
        });
        this.tweenY.start();
        this.big.enableDrag();
    };


    paint(g) {
        const style = {
            // fillStyle: '#006699',
            save: false,
            restore: false,
            beginPath: false,
            closePath: false,
        };
        const c0 = new Circle(this.big.x, this.big.y, this.big.radius);
        const c1 = new Circle(this.small.x, this.small.y, this.small.radius);
        const tangent = c0.getTangentWithCircle(c1);
        // const dist = T.distance(this.big.pos, this.small.pos);
        const { distance: dist, radiusDiff: diff, sum, ratio, slope, innerTangentLines, outerTangentLines } = tangent;

        const control = (dist - sum) / 3;
        // const pi = innerTangentLines[0].getIntersection(innerTangentLines[1]);
        const pi = Line.bySlope(c0.p0, slope, dist * ratio).p1;
        // g.drawPoint(pi);
        // const p0 = innerTangentLines[0].p0;
        // const p1 = innerTangentLines[1].p1;
        // const p2 = innerTangentLines[1].p0;
        // const p3 = innerTangentLines[0].p1;
        const p0 = outerTangentLines[0].p0;
        const p1 = outerTangentLines[0].p1;
        const p2 = outerTangentLines[1].p0;
        const p3 = outerTangentLines[1].p1;
        // 变化控制点
        const p01 = pi.move(0, -(this.big.radius - (diff * ratio) - control)).rotate(slope, pi);
        const p23 = pi.move(0, (this.big.radius - (diff * ratio) - control)).rotate(slope, pi);
        // g.drawPoint(p01);
        // g.drawPoint(p23);
        // const rect0 = new Rectangle(x, -).rotate(slope, c0.p0);
        // g.drawPolygon(rect0, style);
        // const p001 = rect0.points[1];
        // const p223 = rect0.points[2];
        const p001 = Line.bySlope(p0, outerTangentLines[0].getSlope(), c0.radius).p1;
        const p223 = Line.bySlope(p2, outerTangentLines[1].getSlope(), c0.radius).p1;
        // const p223 = new Point(c0.p0.x + (c0.radius / 2), c0.p0.y + c0.radius).rotate(slope, c0.p0);
        // g.drawPoint(p001);
        // g.drawPoint(p223);
        // const rect1 = c1.getBoundingRect().rotate(slope, c1.p0);
        // g.drawPolygon(rect1, style);
        // const p011 = rect1.points[0];
        // const p323 = rect1.points[3];
        const p011 = Line.bySlope(p1, outerTangentLines[0].getSlope() + T.degreeToRadian(180), c1.radius).p1;
        const p323 = Line.bySlope(p3, outerTangentLines[1].getSlope() + T.degreeToRadian(180), c1.radius).p1;
        // g.drawPoint(p011);
        // g.drawPoint(p323);
        const b01 = new CubicBezier(p0, p001, p01, p1);
        const b10 = new CubicBezier(p1, p011, p01, p0);

        const b23 = new CubicBezier(p2, p223, p23, p3);
        const b32 = new CubicBezier(p3, p323, p23, p2);
        //
        g.fillStyle = 'rgb(254,231,155)';
        g.strokeStyle = g.fillStyle;
        g.beginPath();
        if (dist > sum) {
            g.drawBezier(b01, style);
            g.lineTo(p3.x, p3.y);
            g.drawBezier(b32, style);
            g.lineTo(p0.x, p0.y);
            g.closePath();
            // g.stroke();
            g.fill();
            g.beginPath();
            g.drawBezier(b23, style);
            g.lineTo(p1.x, p1.y);
            g.drawBezier(b10, style);
            g.lineTo(p2.x, p2.y);
            // g.stroke();
            g.fill();
        } else {
            g.moveTo(p0.x, p0.y);
            g.lineTo(p1.x, p1.y);
            g.lineTo(p3.x, p3.y);
            g.lineTo(p2.x, p2.y);
            // g.stroke();
            g.fill();
        }
        g.closePath();
        g.drawCircle(c0);
        // g.stroke();
        g.fill();
        g.drawCircle(c1);
        // g.stroke();
        g.fill();

        if (dist > 200) {
            this.back();
        }
    }
}


stage.addLayer(new CanvasLayer().addChild(new Panel()));

