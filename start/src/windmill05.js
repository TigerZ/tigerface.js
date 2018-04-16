import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Triangle } from 'tigerface-shape';
import { Utilities as T } from "RootPath/packages/tigerface-common";

const stage = new Stage({
    fps: 16,
    width: 200,
    height: 200,
    style: {
        'background-color': 'yellow',
    },
}, document.getElementById('windmill05') || document.documentElement);

const layer = new CanvasLayer();

stage.addLayer(layer);

class Windmill extends CanvasSprite {
    constructor() {
        super({
            clazzName: Windmill.name,
        });

        this.x = 100;
        this.y = 100;
    }

    paint(g) {
        for (let i = 0; i < 6; i += 1) {
            g.drawPolygon(new Triangle(0, 0, 50, 50, 120).move(-50, 0).rotate(T.degreeToRadian(i * 60)), {
                fillStyle: 'skyblue',
            });
        }
        g.drawPoint(this.origin);
        this.rotation -= 1;
    }
}

const windmill = new Windmill();

layer.addChild(windmill);
