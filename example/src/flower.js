import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Ellipse, Rectangle } from 'tigerface-shape';
import { ColorPalette } from 'tigerface-graphics';

const stage = new Stage({
    width: 300,
    height: 200,
    retina: false,
    fps: 1,
}, document.getElementById('flower') || document.documentElement);

const layer = new CanvasLayer();

const shape = new Ellipse(30, 0, 20, 10);

const num = 18;

const { colors } = new ColorPalette(num);

let cur = 0;
let time = 0;

class Petal extends CanvasSprite {
    constructor(idx) {
        super();
        this.idx = idx;
        this.rotation = idx * (360 / num);
    }

    paint(g) {
        if (this.idx !== 0) {
            if (time === 0 && this.idx < cur) return;
            if (time === 1 && this.idx > cur) return;
        }
        const fillStyle = `rgb(${colors[this.idx][0]},${colors[this.idx][1]},${colors[this.idx][2]})`;

        g.shadowColor = 'black';
        g.shadowOffsetX = 1;
        g.shadowOffsetY = 1;
        g.shadowBlur = 1;

        g.drawPolygon(shape, {
            fillStyle,
        });
    }
}

const
    bottom = new CanvasSprite();

for (let

         i = 0;

     i < num;

     i
         +=
         1
) {
    const
        petal = new Petal(i);
    bottom
        .addChild(petal);
}

const top = new CanvasSprite();
top.onBeforeDraw = (e) => {
    const g = e.graphics;
    g.drawRectangle(new Rectangle(0, -60, 60, 120));
    g.clip();
};
for (let i = num * 0.5; i < num * 1.5; i += 1) {
    const idx = i % num;
    const petal = new Petal(idx);
    top.addChild(petal);
}
const panel = new CanvasSprite();

panel.addChild(bottom);
panel.addChild(top);

layer.addChild(panel);
panel.pos = {
    x: 100,
    y: 60,
}
panel.rotation = 180;
panel.scaleX = panel.scaleY = 0.5;
panel.onEnterFrame = () => {
    if (cur < num) {
        cur += 1;
        panel.postChange();
    } else if (time === 0) {
        time = 1;
        cur = 0;
    }
};

stage.addLayer(layer);
