import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Line, EquilateralPolygon } from 'tigerface-shape';
import { ColorPalette } from 'tigerface-graphic';

const stage = new Stage({
    width: 350,
    height: 200,
}, document.getElementById('colors') || document.documentElement);

const surface = new CanvasLayer();

const sprite = new CanvasSprite();

const p0 = { x: 150, y: 100 };
sprite.pos = p0;

const polygon = new EquilateralPolygon(0, 0, 80, 6);

const points = polygon.convertPoints();

const lines = [];
points.forEach((p1) => {
    lines.push(new Line({ x: 0, y: 0 }, p1));
});

const { colors } = new ColorPalette(lines.length);

sprite.onRedraw = (e) => {
    const g = e.graphics;
    const style = {
        strokeStyle: 'rgba(255,0,0,1)',
        lineWidth: 0.5,
    };

    g.drawPolygon(polygon, style);
    lines.forEach((line, i) => {
        g.drawLine(line, {
            strokeStyle: `rgb(${colors[i][0]},${colors[i][1]},${colors[i][2]})`,
        });
    });
    // e.target.rotation += 1;
};

stage.addLayer(surface.addChild(sprite));
