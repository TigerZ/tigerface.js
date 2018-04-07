import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Circle, Line, Point, QuadraticBezier } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';

const stage = new Stage({
    width: 400,
    height: 400,
    style: {
        backgroundColor: 'rgba(255,255,0,0.3)',
    },
}, document.getElementById('root') || document.documentElement);


class Ball extends CanvasSprite {
    constructor(opt) {
        super({});
        this.assign(opt);
        this.addBound(new Circle(0, 0, this.radius));
        this.enableDrag();
    }

    paint(g) {
        g.drawCircle(this.bounds[0], {
            strokeStyle: 'rgba(0,0,0.5)',
        });
    }
}

class Panel extends CanvasSprite {
    constructor(opt) {
        super({
            width: 400,
            height: 400,
        });
        this.assign(opt);
        this.big = new Ball({
            name: 'big',
            radius: 50,
            x: 100,
            y: 100,
        });
        this.small = new Ball({
            name: 'small',
            radius: 30,
            x: 230,
            y: 100,
        });
        this.addChild(this.big);
        this.addChild(this.small);
    }

    outerLen() {
        // 外公切线的长=根号下圆心距的平方-大圆半径减小圆半径的平方
        return Math.sqrt((T.distance(this.big.pos, this.small.pos) ** 2) - (Math.abs(this.big.radius - this.small.radius) ** 2));
    }

    innerLen() {
        // 内公切线的长=根号下圆心距的平方-大圆半径加小圆半径的平方
        return Math.sqrt((T.distance(this.big.pos, this.small.pos) ** 2) - ((this.big.radius + this.small.radius) ** 2));
    }

    outerRadian() {
        // 外公切线与连心线夹角的正弦值=圆心距分之大圆半径减小圆半径
        return Math.asin(Math.abs(this.big.radius - this.small.radius) / T.distance(this.big.pos, this.small.pos));
    }

    paint(g) {
        const style = {
            strokeStyle: 'rgba(0,0,0,.5)',
        };
        const dist = T.distance(this.big.pos, this.small.pos);
        const diff = this.big.radius - this.small.radius;
        const sum = this.big.radius + this.small.radius;
        const control = (dist - sum) / 2;
        const ratio = this.small.radius / this.big.radius;
        const slope = T.slope(this.big.pos, this.small.pos);
        const outerRadian = this.outerRadian();

        // 上切线两点
        const p0 = new Point(this.big.pos).move(0, -this.big.radius).rotate(slope + outerRadian, this.big.pos);
        const p1 = new Point(this.small.pos).move(0, -this.small.radius).rotate(slope + outerRadian, this.small.pos);

        // 下切线两点
        const p2 = new Point(this.big.pos).move(0, this.big.radius).rotate(slope - outerRadian, this.big.pos);
        const p3 = new Point(this.small.pos).move(0, this.small.radius).rotate(slope - outerRadian, this.small.pos);
        // 中间点
        const p4 = Line.bySlope(this.big.pos, slope, dist * ratio).p1;

        // 上中间交点
        const p5 = p4.move(0, -(this.big.radius - (diff * ratio))).rotate(slope, p4);
        // 下中间交点
        const p6 = p4.move(0, (this.big.radius - (diff * ratio))).rotate(slope, p4);
        // 变化控制点
        const p7 = p4.move(0, -(this.big.radius - (diff * ratio) - control)).rotate(slope, p4);
        const p8 = p4.move(0, (this.big.radius - (diff * ratio) - control)).rotate(slope, p4);
        // const b1 = new QuadraticBezier(p0, p7, p1);
        // const b2 = new QuadraticBezier(p2, p8, p3);
        g.drawPoint(this.big.pos);
        g.drawPoint(this.small.pos);
        // g.drawLine(new Line(this.big.pos, this.small.pos), style);
        // g.drawLine(new Line(this.big.pos, new Point(this.big.pos).move(0, -this.big.radius).rotate(outerRadian, this.big.pos)), style);
        // g.drawLine(Line.bySlope(this.big.pos, outerRadian, this.outerLen()), style);
        // g.drawLine(new Line(p0, p1), style);
        // g.drawLine(new Line(p2, p3), style);
        g.drawPoint(p4);
        // g.drawLine(new Line(p5, p6), style);
        // g.drawBezier(b1, style);
        // g.drawBezier(b2, style);

        // g.drawLine(new Line(p7, p8), style);
        const tangent1 = new Circle(this.big.x, this.big.y, this.big.radius).getTangent(p7);
        // g.drawLine(tangent1[0], style);
        const p00 = tangent1[0].p0;
        g.drawPoint(p00);
        const tangent2 = new Circle(this.big.x, this.big.y, this.big.radius).getTangent(p8);
        // g.drawLine(tangent2[1], style);
        const p20 = tangent2[1].p0;
        g.drawPoint(p20);
        const tangent3 = new Circle(this.small.x, this.small.y, this.small.radius).getTangent(p8);
        // g.drawLine(tangent3[0], style);
        const p30 = tangent3[0].p0;
        g.drawPoint(p30);
        const tangent4 = new Circle(this.small.x, this.small.y, this.small.radius).getTangent(p7);
        // g.drawLine(tangent4[1], style);
        const p10 = tangent4[1].p0;
        g.drawPoint(p10);
        const b3 = new QuadraticBezier(p00, p7, p10);
        const b4 = new QuadraticBezier(p20, p8, p30);

        g.drawBezier(b3, style);
        g.drawBezier(b4, style);
    }
}


stage.addLayer(new CanvasLayer().addChild(new Panel()));

