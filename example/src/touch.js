import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';
import { Triangle } from 'tigerface-shape';
import { Event } from 'tigerface-event';
import { Utilities as T } from 'tigerface-common';

const dom = document.getElementById('root');

const stage = new Stage({
    fps: 16,
    width: 400,
    height: 400,
    style: {
        'background-color': 'rgba(255,255,0,0.3)',
    },
}, dom);

const Style = {
    backgroundColor: 'rgba(255,0,0,0.3)',
}

// 继承的方式
class Panel extends CanvasSprite {
    constructor(opt) {
        super();
        this.assign(opt);
        // this.enableDrag();
        this.text = '汉字汉字';
        this.onTouchStart = (data) => {
            this.logger.debug('触摸开始', data);
        };
    }

    paint() {
        const g = this.graphics;
        g.fillStyle = 'rgba(255,0,0,0.2)';
        g.drawRectangle(this.boundingRect, g.DrawStyle.FILL);
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillStyle = 'rgba(0,0,0,0.8)';
        g.drawText(this.text, { x: 100, y: 100 }, '12px Hei', g.DrawStyle.FILL);
    }
}

const layer = new CanvasLayer({ width: 400, height: 400 });
const panel = new Panel({ width: 200, height: 200, style: Style });
layer.addChild(panel);
stage.addChild(layer);

