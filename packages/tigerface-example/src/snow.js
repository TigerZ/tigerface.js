import { Stage, CanvasLayer, CanvasSprite, DomLayer } from 'tigerface-display';
import { Triangle, EquilateralStar, Rectangle } from 'tigerface-shape';
import { Utilities as T } from 'tigerface-common';

const stage = new Stage({
    fps: 16,
    width: 200,
    height: 200,
    style: {
        'background-color': 'rgba(255,255,0,0.3)',
    },
});

class Snow extends CanvasSprite {
    constructor(opt) {
        super({
            clazzName: Snow.name,
        });
        this.assign(opt);
        this.addBound(new EquilateralStar(0, 0, 5, 2.5, 6));
        this.init();
        this.y = -T.random(200) - 10;
    }

    init() {
        this.stop = false;
        this.x = T.random(200);
        this.y = -10;
        this.speed = (T.random(5) + 0.5) / 20;
        this.rotationSpeed = (T.random(5) + 0.5) / 10;
        this.alpha = 1;
        this.scaleX = (T.random(5) / 10) + this.radius;
        this.scaleY = this.scaleX;
    }

    paint(g) {
        this.bounds.forEach((bound) => {
            g.drawPolygon(bound, {
                fillStyle: 'white',
            });
        });
        let restart = false;

        if (!this.stop && (this.noHitTest || !this.stage.find('tree').hitTestPoint(this.getStagePos()))) {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            if (this.y > 198) this.stop = true;
        } else {
            this.stop = true;
            this.alpha -= 0.005;
            if (this.alpha < 0) restart = true;
        }

        if (restart) {
            this.init();
        }
    }
}

// 继承的方式
class ViewPort extends CanvasSprite {
    constructor(opt) {
        super({
            clazzName: ViewPort.name,
            max: 10,
        });
        this.assign(opt);

        for (let i = 0; i < this.max; i += 1) {
            this.addChild(new Snow({ noHitTest: this.noHitTest, radius: this.radius }));
        }
    }

    paint() {
        this.postChange();
    }
}

class Tree extends CanvasSprite {
    constructor(opt) {
        super();
        this.assign(opt);
        this.addBound(new Triangle(0, 0, 50, 50, 90).rotate(T.degreeToRadian(45)))
            .addBound(new Triangle(15, 15, 80, 80, 90).rotate(T.degreeToRadian(45)))
            .addBound(new Rectangle(-10, 75, 20, 20));
    }

    paint(g) {
        this.bounds.forEach((bound) => {
            g.drawPolygon(bound, {
                fillStyle: 'Green',
            });
        });
    }
}

stage
    .addLayer(new DomLayer({
        style: {
            backgroundColor: 'DeepSkyBlue',
        },
    }), 'background')
    .addLayer(new CanvasLayer({
        retina: false,
    }).addChild(new ViewPort({ max: 50, radius: 0.2, noHitTest: true })), 'snow1')
    .addLayer(new CanvasLayer().addChild(new Tree({
        pos: { x: 100, y: 110 },
        name: 'tree',
    })), 'tree')
    .addLayer(new CanvasLayer({
        retina: false,
    }).addChild(new ViewPort({ max: 50, radius: 0.3 })), 'snow2')
    .addLayer(new CanvasLayer({
        retina: false,
    }).addChild(new ViewPort({ max: 50, radius: 0.5, noHitTest: true })), 'snow3');

(document.getElementById('snow') || document.documentElement).append(stage.dom);
