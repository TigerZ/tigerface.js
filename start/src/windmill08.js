import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Triangle } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';
import { ColorPalette } from 'tigerface-graphics';

let speed = 1;

const stage = new Stage({
    width: 200,
    height: 200,
    style: {
        'background-color': 'yellow',
    },
}, document.getElementById('windmill08') || document.documentElement);

const layer = new CanvasLayer();

stage.addLayer(layer);

let mouseInStage = false;
stage.onMouseOver = () => {
    mouseInStage = true;
};
stage.onMouseOut = () => {
    mouseInStage = false;
};

const { colors } = new ColorPalette(6, {
    0: 'rgb(222,63,24)',
    0.3: 'rgb(254,212,90)',
    0.6: 'rgb(102,172,188)',
    0.9: 'rgb(161,240,158)',
    1.0: 'rgb(222,63,24)',
});


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
        this.bounds.forEach((shape, idx) => {
            g.drawPolygon(shape, {
                fillStyle: `rgba(${colors[idx][0]},${colors[idx][1]},${colors[idx][2]},1)`,
            });
        });
        g.drawPoint(this.origin);

        if (!mouseInStage && speed > 1) speed -= 0.2;

        this.rotation -= speed;
    }
}

const windmill = new Windmill();

layer.addChild(windmill);
