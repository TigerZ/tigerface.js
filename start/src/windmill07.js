import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Triangle } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';

let speed = 1;

const stage = new Stage({
    width: 200,
    height: 200,
    style: {
        'background-color': 'yellow',
    },
}, document.getElementById('windmill07') || document.documentElement);

const layer = new CanvasLayer();

stage.addLayer(layer);

let mouseInStage = false;
stage.onMouseOver = () => {
    mouseInStage = true;
};
stage.onMouseOut = () => {
    mouseInStage = false;
};


class Windmill extends CanvasSprite {
    constructor() {
        super({
            clazzName: Windmill.name,
        });

        this.x = 100;
        this.y = 100;

        for (let i = 0; i < 6; i += 1) {
            this.addBound(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(i * 60)));
        }

        this.onMouseMove = () => {
            if (speed < 35) speed += 1;
            this.postChange();
        };
    }

    paint(g) {
        this.bounds.forEach((shape) => {
            g.drawPolygon(shape, {
                fillStyle: 'skyblue',
            });
        });
        g.drawPoint(this.origin);

        if (!mouseInStage && speed > 1) speed -= 0.2;

        this.rotation -= speed;
    }
}

const windmill = new Windmill();

layer.addChild(windmill);
