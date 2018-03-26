import React from 'react';
import { DomLayer, CanvasSprite } from 'tigerface-display';
import { Stage, Tag } from 'tigerface-react';
import { Rectangle } from 'tigerface-shape';
import { Event } from 'tigerface-event';
import $ from 'jquery';

class DemoLayer extends DomLayer {
    constructor(opts) {
        super({
            clazzName: 'DemoDomSprite',
        });
        this.assign(opts);
        this.enableDrag();
        this.pos = { x: 200, y: 150 };
        // this.scale = { x: 2, y: 1 };
        // this.step = 1;
        // this.rotation = 45;
        this.num = 900000;
    }

    paint() {
        // if (this.originX > this.width || this.originX < 0)
        //     this.step = -this.step;
        // this.originX += this.step;
        // this.num += -1;
        // if (this.num > 0) {

        // }
    }
}


class DemoCanvasSprite extends CanvasSprite {
    constructor(opts) {
        super({
            clazzName: DemoCanvasSprite.name,
        });
        this.assign(opts);
        this.addBound(new Rectangle(0, 0, 100, 50));
        this.origin = { x: 50, y: 25 };

        const $input = $('<input tabindex="2" style="border:0;height:50px;width:100%;font-size:16px"/>');
        $input.change((e) => {
            // if (e.keyCode === 13) {
                setTimeout(() => {
                    $input.blur();
                }, 300);
            // }
        });
        $input.blur((e) => {
            this.complateInput($(e.currentTarget).val());
        });
        const $cover = $('<div tabindex="1"></div>').append($input).focus(() => $input.focus());

        this.initCover($cover[0]);

        this.onClick = () => {
            this.showCover();
        };
        // this.mouseInside = false;
        this.on(Event.MouseEvent.MOUSE_OVER, () => {
            this.mouseInside = true;
            this.postChange();
        });
        this.on(Event.MouseEvent.MOUSE_OUT, () => {
            this.mouseInside = false;
            this.postChange();
        });
        this.on(Event.MouseEvent.MOUSE_MOVE, () => {
            // this.postChange();
        });
        this.text = '';
    }

    complateInput(text) {
        this.text = text;
        this.postChange();
        this.hideCover();
    }

    paint() {
        const g = this.graphics;
        if (this.mouseInside) {
            g.fillStyle = 'rgba(255,255,0,0.8)';
        } else {
            g.fillStyle = 'rgba(0,255,0,0.8)';
        }
        g.drawRectangle(this.boundingRect, g.DrawStyle.FILL);
        // g.drawPoint(this.mousePos, 5, g.PointStyle.DEFAULT);
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillStyle = 'black';
        g.drawText(this.text, { x: 50, y: 25 }, '16px Hei', g.DrawStyle.FILL);
        // this.rotation += 1;
    }
}

const StageStyle = {
    backgroundColor: 'rgba(255,255,0,0.3)',
};

const DomStyle = {
    backgroundColor: 'rgba(255,0,0,0.3)',
};

/**
 * User: zyh
 * Date: 2018/3/18.
 * Time: 13:29.
 */
class DomSpriteAppRoot extends React.Component {

    render() {
        return (
            <Stage id="stage" style={StageStyle} width={640} height={480}>
                <Tag.Layer style={DomStyle} clazz={DemoLayer}>
                    <Tag.Surface width={200} height={200} style={{ backgroundColor: 'rgba(0,255,255,1)' }}>
                        <Tag.Sprite x={100} y={100} width={100} height={50} clazz={DemoCanvasSprite} />
                    </Tag.Surface>
                </Tag.Layer>
            </Stage>
        );
    }
}

export default DomSpriteAppRoot;

