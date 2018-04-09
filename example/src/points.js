import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { EquilateralStar, EquilateralPolygon } from 'tigerface-shape';

const stage = new Stage({
    width: 350,
    height: 200,
    style: {
        backgroundColor: 'rgba(255,255,0,.3)',
    },
}, document.getElementById('points') || document.documentElement);

const surface = new CanvasLayer();

const sprite = new CanvasSprite();

const polygon = new EquilateralPolygon(150, 100, 80, 5);

const points = polygon.convertPoints();

sprite.onRedraw = (e) => {
    const g = e.graphics;
    g.drawPolygon(polygon, {
        strokeStyle: 'black',
    });
    points.forEach((point) => {
        g.drawPoint(point);
    });
}

stage.addLayer(surface.addChild(sprite));
