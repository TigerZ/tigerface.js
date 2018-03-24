import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Triangle } from 'tigerface-shape';
import { Event } from 'tigerface-event';
import { Utilities as T } from 'tigerface-common';

const dom = document.getElementById('root');

const stage = new Stage({
    fps: 60,
    width: 200,
    height: 200,
    style: {
        'background-color': 'rgba(255,255,0,0.3)',
    },
}, dom);

const surface = new CanvasLayer();
surface.enableDrag();

class Bar extends CanvasSprite {
    constructor() {
        super();

        this.x = 100;
        this.y = 100;

        this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0));
        this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(90)));
        this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(180)));
        this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(270)));
        // this.origin = { x: 50, y: 0 };

        this.onDoubleClick = () => {
            this.cover.visible = true;
        };
        // this.mouseInside = false;
        this.on(Event.MouseEvent.MOUSE_OVER, () => {
            this.mouseInside = true;
            this.postChange();
        });
        this.on(Event.MouseEvent.MOUSE_OUT, () => {
            this.mouseInside = false;
            this.postChange();
        });
        this.on(Event.MouseEvent.MOUSE_MOVE, () => {
            this.postChange();
        });
        this.on(Event.ENTER_FRAME, () => this.onEnterFrame());
    }

    onEnterFrame() {
        this.rotation += -1;
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
    }
}

surface.addChild(new Bar());

stage.addChild(surface);

