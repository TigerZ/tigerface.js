import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Triangle } from 'tigerface-shape';
import { Event } from 'tigerface-event';
import { Utilities as T } from 'tigerface-common';

const stage = new Stage({
    fps: 16,
    width: 200,
    height: 200,
}, (document.getElementById('windmill') || document.documentElement));

// 如果不直接把 dom 传给 stage，可以让 stage 自己创建 dom，再获取
// dom.appendChild(stage.dom);

let speed = 1;
let mouseInCanvas = false;

// 外部设置方式
const surface = new CanvasLayer();
surface.name = 'surface';
surface.on(Event.MouseEvent.MOUSE_MOVE, () => {
    mouseInCanvas = true;
});
surface.on(Event.MouseEvent.MOUSE_OUT, () => {
    mouseInCanvas = false;
});
surface.on(Event.ENTER_FRAME, () => {
    if (!mouseInCanvas) {
        if (speed > 1) speed -= 1;
    }
});

// 继承的方式
class Panel extends CanvasSprite {
    constructor(opt) {
        super({
            clazzName: Panel.name,
            size: { width: 200, height: 200 },
        });
        this.assign(opt);
        // this.enableDrag();
    }

    paint(g) {
        const textAlign = 'right';
        const textBaseline = 'bottom';
        const fillStyle = 'black';
        g.drawText(`V:${speed}`, {
            x: 200,
            y: 200,
            font: '12px monaco',
            textAlign,
            textBaseline,
            fillStyle,
        });
    }
}

// 嵌套两层
class Windmill extends CanvasSprite {
    constructor() {
        super({
            clazzName: Windmill.name,
        });

        this.x = 100;
        this.y = 100;

        this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0));
        this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(60)));
        this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(120)));
        this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(180)));
        this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(240)));
        this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(300)));

        // this.origin = { x: 50, y: 0 };

        this.onDoubleClick = () => {
            this.cover.visible = true;
        };
        this.mouseInside = false;
        this.on(Event.MouseEvent.MOUSE_OVER, () => {
            this.mouseInside = true;
            this.postChange();
        });
        this.on(Event.MouseEvent.MOUSE_OUT, () => {
            this.mouseInside = false;
            this.postChange();
        });
        this.on(Event.MouseEvent.MOUSE_MOVE, () => {
            if (speed < 35) speed += 1;
            this.postChange();
        });

        speed = 1;
    }

    foo() {
        this.logger.debug('Hi, 这是蓝色的调试日志');
        this.logger.info('Hi, 这是绿色的信息日志');
        this.logger.warn('Hi, 这是橙色的警告日志');
        this.logger.error('Hi, 这是红色的错误');
    }

    paint(g) {
        let fillStyle;
        if (this.mouseInside) {
            fillStyle = 'rgba(255,0,0,0.5)';
        } else {
            fillStyle = 'rgba(0,0,255,0.5)';
        }

        this.bounds.forEach((shape) => {
            g.drawPolygon(shape, {
                fillStyle,
            });
        });
        g.drawPoint(this.origin, { radius: 5, pointStyle: g.PointStyle.ROUND_PLUS });
        this.rotation += -speed;
    }
}

const windmill = new Windmill();

const panel = new Panel().addChild(windmill);

stage.addLayer(surface.addChild(panel));
