import React from 'react';
import { DomLayer, CanvasSprite } from 'tigerface-display';
import { Stage, Tag } from 'tigerface-react';
import { Rectangle } from 'tigerface-shape';
import { Event } from 'tigerface-event';

const { $ } = global;

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

    paint(g) {
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

        const $input = $('<input tabindex="2" style="border:0;outline:none;height:50px;width:100%;font-size:16px"/>');
        $input.change(() => {
            $input.blur();
        });
        $input.keydown((e) => {
            if (e.keyCode === 13) {
                $input.blur();
            }
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

    paint(g) {
        if (this.mouseInside) {
            g.drawRectangle(this.boundingRect, { fillStyle: 'rgba(255,255,0,0.8)' });
        } else {
            g.drawRectangle(this.boundingRect, { fillStyle: 'rgba(0,255,0,0.8)' });
        }

        g.drawText(this.text, {
            x: 50,
            y: 25,
            font: '16px Hei',
            textAlign: 'center',
            textBaseline: 'middle',
            fillStyle: 'blue',
        });
        // this.rotation += 1;
    }
}

const StageStyle = {
    backgroundColor: 'rgba(255,255,0,0.3)',
};

const DomStyle = {
    backgroundColor: 'rgba(255,0,0,0.3)',
};

function DomSpriteAppRoot() {
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

export default DomSpriteAppRoot;

