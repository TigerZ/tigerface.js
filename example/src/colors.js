import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Line, EquilateralStar } from 'tigerface-shape';
import { ColorPalette } from 'tigerface-graphics';
import { Utilities as T } from 'tigerface-common';

const stage = new Stage({
    width: 350,
    height: 200,
}, document.getElementById('colors') || document.documentElement);

const surface = new CanvasLayer();

const sprite = new CanvasSprite();

const p0 = { x: 150, y: 100 };
sprite.pos = p0;

const polygon = new EquilateralStar(0, 0, 80, 50, 6).rotate(T.degreeToRadian(30));

const points = polygon.convertPoints(3);

const lines = [];
points.forEach((p1) => {
    lines.push(new Line({ x: 0, y: 0 }, p1));
});

const { colors } = new ColorPalette(lines.length);

sprite.onRedraw = (e) => {
    const g = e.graphics;
    lines.forEach((line, i) => {
        g.drawLine(line, {
            strokeStyle: `rgb(${colors[i][0]},${colors[i][1]},${colors[i][2]})`,
        });
    });
};

stage.addLayer(surface.addChild(sprite));
