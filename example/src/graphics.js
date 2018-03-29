import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Point, Line, Circle, Rectangle, Polygon, Curve, Sector, Arc } from 'tigerface-shape';

const dom = document.getElementById('root');

const stage = new Stage({
    fps: 16,
    width: 400,
    height: 400,
    style: {
        'background-color': 'rgba(255,255,0,0.3)',
    },
}, dom);

// 继承的方式
class Panel extends CanvasSprite {
    constructor(opt) {
        super(opt);
        this.enableDrag();
    }

    paint() {
        const g = this.graphics;
        const fillStyle = 'white';
        const strokeStyle = 'black';

        // 图片绘制时异步的，所以可能先调用，却后绘制
        const url = './b.jpeg';
        g.drawImageUrl(url, {
            applyDevicePixelRatio: true,
            pos: { x: 0, y: 0 },
            size: { width: 200, height: 50 },
            clip: {
                x: 1 / 3,
                y: 1 / 6,
                width: 400,
                height: 100,
            },
        });

        const p0 = new Point(100, 100);
        const p1 = p0.move(0, 100);

        const polygon = new Polygon([
            { x: 10, y: 10 },
            { x: 120, y: 20 },
            { x: 200, y: 40 },
            { x: 300, y: 120 },
            { x: 350, y: 250 },
            { x: 200, y: 350 },
            { x: 150, y: 300 },
            { x: 120, y: 200 },
        ]);

        g.drawPolygon(polygon, {
            fillStyle,
            strokeStyle,
        });

        g.drawRoundedPolygon(polygon.scale(0.8, 0.8).move(50, 50), {
            fillStyle,
            strokeStyle,
        });

        g.drawCircle(new Circle(p0.x, p0.y, 60), {
            fillStyle,
            strokeStyle,
        });

        const rect = new Rectangle(p1.x - 25, p1.y + 25, 100, 50);

        g.drawRectangle(rect, {
            fillStyle,
            strokeStyle,
        });

        g.drawRoundedPolygon(rect.scale(0.8, 0.8).move(0, 100), {
            fillStyle,
            strokeStyle,
        });

        g.drawLine(new Line(p0, p1));
        g.drawArrow(p0, {
            angle: 45,
            rotation: 90,
            fillStyle,
            strokeStyle,
        });

        const p2 = p0.move(50, 0);
        const p3 = p1.move(50, 0);
        g.drawLine(new Line(p2, p3), {
            lineWidth: 1,
            lineStyle: g.LineStyle.DOT,
        });
        g.drawDiamondArrow(p2, {
            angle: 45,
            rotation: 90,
            fillStyle,
            strokeStyle,
        });

        const p4 = p2.move(50, 0);
        const p5 = p3.move(50, 0);
        g.drawLine(new Line(p4, p5), {
            lineWidth: 1,
            lineStyle: g.LineStyle.DASH,
        });

        const p6 = p4.move(50, 0);
        const p7 = p5.move(50, 0);
        g.drawLine(new Line(p6, p7), {
            lineWidth: 1,
            lineStyle: g.LineStyle.DASHDOT,
        });

        const p8 = p6.move(50, 0);
        const p9 = p7.move(50, 0);

        g.drawLine(new Line(p8, p9), {
            lineWidth: 1,
            lineStyle: g.LineStyle.DASHDOTDOT,
        });

        g.drawText('你好，画笔！', { x: p9.x, y: p9.y + 150 });

        g.drawCurve(new Curve([
            { x: 100, y: 140 },
            { x: 130, y: 120 },
            { x: 180, y: 120 },
            { x: 280, y: 200 },
        ]));

        const arc = new Arc(p8.x, p8.y, 100, 50, 210, 330, 5);
        g.lineJoin = 'round';
        g.lineCap = 'round';
        g.drawCurve(arc, {
            strokeStyle: 'rgba(0,0,0,0.5)',
            lineWidth: 15,
        });
    }
}

stage.addLayer(new CanvasLayer({ width: 400, height: 400 }).addChild(new Panel()));
