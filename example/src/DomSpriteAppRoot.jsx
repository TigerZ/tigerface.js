import React from 'react';
import {DomSprite, CanvasSprite} from 'tigerface-display';
import {Stage, Tag} from 'tigerface-react';
import {Rectangle} from 'tigerface-shape';

const cover = new DomSprite({visible: false});

class DemoDomSprite extends DomSprite {
    constructor(opts) {
        super({
            clazzName: 'DemoDomSprite'
        });
        this.assign(opts);
        this.enableDrag();
        this.origin = {x: 0, y: 15};
        this.pos = {x: 200, y: 150};
        this.scale = {x:1.8, y:0.8};
        // this.step = 1;
        this.rotation=90;
    }

    paint() {
        // if (this.originX > this.width || this.originX < 0)
        //     this.step = -this.step;
        // this.originX += this.step;
        this.rotation+=0.1;
    }
}


class DemoCanvasSprite extends CanvasSprite {
    constructor(opts) {
        super(opts);
        this.addBound(new Rectangle(0, 0, 100, 50));
        this.initCover();

        this.onDoubleClick = () => {
            this.cover.visible = true;
        };
    }

    paint() {
        let g = this.graphics;
        g.drawPoint(this.parent.parent.origin, 5, g.PointStyle.DEFAULT);
    }
}

/**
 * User: zyh
 * Date: 2018/3/18.
 * Time: 13:29.
 */
export default class DomSpriteAppRoot extends React.Component {
    constructor() {
        super();
    }

    onblur = () => {
        cover.visible = false;
    };

    render() {
        return (
            <Stage id={'stage'} style={StageStyle} width={640} height={480}>
                <Tag.Dom style={DomStyle} clazz={DemoDomSprite} width={100} height={50}>
                    <Tag.Surface width={100} height={50}>
                        <Tag.Sprite clazz={DemoCanvasSprite}/>
                    </Tag.Surface>
                </Tag.Dom>
            </Stage>
        )
    }
}

const StageStyle = {
    backgroundColor: 'rgba(255,255,0,0.3)'
}

const DomStyle = {
    backgroundColor: 'rgba(255,0,0,0.3)'
}