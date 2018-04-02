import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Circle } from 'tigerface-shape';
import { TweenAction, Tween } from 'tigerface-action';

const dom = document.getElementById('root');

const stage = new Stage({
    fps: 16,
    width: 200,
    height: 200,
    style: {
        'background-color': 'rgba(255,255,0,0.3)',
    },
}, dom);


class Ball extends CanvasSprite {
    constructor(opt) {
        super({
            clazzName: Ball.name,
        });
        this.assign(opt);
        this.addBound(new Circle(0, 0, 10));
        this.tween = new TweenAction(this, {
            prop: 'y',
            end: 150,
            effect: Tween.Elastic.easeOut,
        });
        this.tween.start();
        this.tween.onFinish = () => this.tween.yoyo();
    }

    paint(g) {
        g.drawCircle(this.bounds[0], {
            fillStyle: 'red',
            strokeStyle: 'black',
        });
    }
}

stage
    .addLayer(new CanvasLayer().addChild(new Ball({
        x: 100,
        y: 50,
    })), 'snow1');

