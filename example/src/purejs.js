import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Triangle } from 'tigerface-shape';
import { Event } from 'tigerface-event';
import { Utilities as T } from 'tigerface-common';

const dom = document.getElementById('root');

const stage = new Stage({
    fps: 16,
    width: 200,
    height: 200,
    style: {
        'background-color': 'rgba(255,255,0,0.3)',
    },
}, dom);

let speed = 1;
let mouseInCanvas = false;

const surface = new CanvasLayer();
surface.enableDrag();
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

class Panel extends CanvasSprite {
    paint() {
        const g = this.graphics;
        g.textAlign = 'right';
        g.drawText(speed, { x: 200, y: 200 }, '12px monaco', g.DrawStyle.FILL);
    }
}

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

    paint() {
        const g = this.graphics;
        if (this.mouseInside) {
            g.fillStyle = 'rgba(255,0,0,0.5)';
        } else {
            g.fillStyle = 'rgba(0,0,255,0.5)';
        }

        this.bounds.forEach((shape) => {
            g.drawPolygon(shape, g.DrawStyle.FILL);
        });
        g.drawPoint(this.origin, 5, g.PointStyle.DEFAULT);
        this.rotation += -speed;
    }
}

surface.addChild(new Panel().addChild(new Windmill()));

stage.addChild(surface);

