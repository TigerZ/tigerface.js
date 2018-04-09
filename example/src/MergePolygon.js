import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Polygon } from 'tigerface-shape';

const stage = new Stage({
    width: 350,
    height: 200,
}, document.getElementById('MergePolygon') || document.documentElement);


const s1 = new Polygon([{ x: 309, y: 96 }, { x: 329, y: 149 }, { x: 389, y: 150 }, {
    x: 344,
    y: 188,
}, { x: 364, y: 250 }, { x: 311, y: 214 }, { x: 264, y: 252 }, { x: 279, y: 189 }, { x: 229, y: 155 }, {
    x: 289,
    y: 151,
}]);

const s2 = new Polygon([{ x: 411, y: 104 }, { x: 457, y: 64 }, { x: 506, y: 96 }, {
    x: 512,
    y: 184,
}, { x: 419, y: 170 }]);

class PS extends CanvasSprite {
    paint(g) {
        this.bounds.forEach((bound) => {
            g.drawPolygon(bound, {
                fillStyle: 'rgba(0,0,255,0.1)',
            });
        });
    }
}

const p1 = new PS();
p1.addBound(s1.scale(0.8, 0.8).move(-240, -144));
p1.pos = { x: 150, y: 100 };
p1.onRedraw = () => {
    p1.rotation += 0.5;
    if (p1.rotation > 360) p1.rotation -= 360;
};

let direct = 0.5;
const p2 = new PS();
p2.addBound(s2.scale(0.8, 0.8).move(-360, -104));
p2.pos = { x: 100, y: 100 };
p2.onRedraw = () => {
    p2.x += direct;
    if (p2.x < 50 || p2.x > 250) {
        direct = -direct;
    }
};

const surface = new CanvasLayer();
stage.addLayer(surface);
surface.addChild(p1);
surface.addChild(p2);


surface.onRedraw = (e) => {
    const g = e.graphics;

    if (p1.hitTestObject(p2)) {
        const m1 = p1.mirror().bounds[0];
        const m2 = p2.mirror().bounds[0];
        const s3 = m1.merge(m2, g);

        if (s3) {
            g.drawPolygon(s3, {
                fillStyle: 'rgba(255,0,0,0.1)',
                strokeStyle: 'rgba(255,0,0,0.5)',
                lineWidth: 1,
            });
        } else {
            surface.stop();
        }
    }
};
