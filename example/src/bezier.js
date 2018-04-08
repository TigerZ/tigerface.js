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
        // g.drawCircle(this.bounds[0], {
        //     strokeStyle: 'rgba(0,0,0.5)',
        // });
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
            radius: 40,
            x: 230,
            y: 100,
        });
        this.addChild(this.big);
        this.addChild(this.small);
    }


    paint(g) {
        const style = {
            // fillStyle: 'gray',
            beginPath: false,
            closePath: false,
        };
        const c0 = new Circle(this.big.x, this.big.y, this.big.radius);
        const c1 = new Circle(this.small.x, this.small.y, this.small.radius);
        const tangent = c0.getTangentWithCircle(c1);
        // const dist = T.distance(this.big.pos, this.small.pos);
        const { distance: dist, radiusDiff: diff, sum, ratio, slope, innerTangentLines, outerTangentLines } = tangent;

        const control = (dist - sum)/3;
        const pi = innerTangentLines[0].getIntersection(innerTangentLines[1]);
        const p0 = innerTangentLines[0].p0;
        const p1 = innerTangentLines[1].p1;
        const p2 = innerTangentLines[1].p0;
        const p3 = innerTangentLines[0].p1;
        // const p0 = outerTangentLines[0].p0;
        // const p1 = outerTangentLines[0].p1;
        // const p2 = outerTangentLines[1].p0;
        // const p3 = outerTangentLines[1].p1;
        // 变化控制点
        const p01 = pi.move(0, -(this.big.radius - (diff * ratio) - control)).rotate(slope, pi);
        const p23 = pi.move(0, (this.big.radius - (diff * ratio) - control)).rotate(slope, pi);
        const b0 = new QuadraticBezier(p0, p01, p1);
        const b1 = new QuadraticBezier(p3, p23, p2);
        //
        g.fillStyle = 'gray';
        g.strokeStyle = g.fillStyle;
        g.beginPath();
        g.drawBezier(b0, style);
        g.stroke();
        g.lineTo(p3.x, p3.y);
        g.stroke();
        g.drawBezier(b1, style);
        g.lineTo(p0.x, p0.y);
        g.closePath();
        g.fill();
        g.drawCircle(c0);
        g.fill();
        g.drawCircle(c1);
        g.fill();
        // g.stroke();
    }
}


stage.addLayer(new CanvasLayer().addChild(new Panel()));

