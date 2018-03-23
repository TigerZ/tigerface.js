import React from 'react';
import { DomSprite, CanvasSprite } from 'tigerface-display';
import { Stage, Tag } from 'tigerface-react';
import { Rectangle } from 'tigerface-shape';
import { Event } from 'tigerface-event';

const cover = new DomSprite({ visible: false });

class DemoDomSprite extends DomSprite {
    constructor(opts) {
        super({
            clazzName: 'DemoDomSprite',
        });
        this.assign(opts);
        this.enableDrag();
        // this.origin = { x: 50, y: 25 };
        this.pos = { x: 200, y: 150 };
        // this.scale = {x:1.8, y:0.8};
        // this.step = 1;
        this.rotation = 45;
        this.num = 900000;
    }

    paint() {
        // if (this.originX > this.width || this.originX < 0)
        //     this.step = -this.step;
        // this.originX += this.step;
        // this.num += -1;
        // if (this.num > 0) {
        this.rotation += 1;
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
        // this.initCover();

        this.onDoubleClick = () => {
            this.cover.visible = true;
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
            this.postChange();
        });
    }

    paint() {
        const g = this.graphics;
        if (this.mouseInside) {
            g.fillStyle = 'rgba(255,0,0,0.8)';
        } else {
            g.fillStyle = 'rgba(255,255,0,0.8)';
        }
        g.drawRectangle(this.boundingRect, g.DrawStyle.FILL);
        g.drawPoint(this.getMousePos(), 5, g.PointStyle.DEFAULT);
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
    onblur = () => {
        cover.visible = false;
    };

    render() {
        return (
            <Stage id="stage" style={StageStyle} width={640} height={480}>
                <Tag.Dom style={DomStyle} clazz={DemoDomSprite} width={100} height={50}>
                    <Tag.Surface width={100} height={50} style={{ backgroundColor: 'rgba(0,255,255,1)' }}>
                        <Tag.Sprite clazz={DemoCanvasSprite} />
                    </Tag.Surface>
                </Tag.Dom>
            </Stage>
        );
    }
}

export default DomSpriteAppRoot;

