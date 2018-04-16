import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Triangle } from 'tigerface-shape';

const stage = new Stage({
    fps: 16,
    width: 200,
    height: 200,
    style: {
        'background-color': 'yellow',
    },
}, document.getElementById('windmill03') || document.documentElement);

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
        const shape = new Triangle(0, 0, 50, 50, 120).move(-50, 0);
        g.drawPolygon(shape, {
            fillStyle: 'skyblue',
        });
        g.drawPoint(this.origin);
    }
}

const windmill = new Windmill();

layer.addChild(windmill);
