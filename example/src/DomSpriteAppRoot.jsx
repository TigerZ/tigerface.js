import React from 'react';
import {DomSprite, CanvasSprite} from 'tigerface-display';
import {Stage, Tag} from 'tigerface-react';
import {Rectangle} from 'tigerface-shape';

const cover = new DomSprite({visible: false});

class DemoDomSprite extends DomSprite {
    constructor(opts) {
        super(opts);
        this.enableDrag();
        // this.origin = {x:50, y:25};
        this.pos = {x: 200, y: 150};
        // this.on(Event.MouseEvent.MOUSE_UP, (e)=>{
        //     this.pos = {x:this.pos.x-this.origin.x+e.pos.x, y:this.pos.y-this.origin.y+e.pos.y};
        //     this.origin = e.pos;
        //     this.postChange();
        // })
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
        // this.postChange();

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

const CoverStyle = {
    background: 'rgba(0,0,0,0.2)'
}

const InputStyle = {
    position: 'absolute',
    width: '100%',
    height: '26px',
    marginTop: '-13px',
    top: '50%',
    border: 0,
    '-webkit-user-select': null,
    '-moz-user-select': null,
    '-ms-user-select': null,
    'user-select': null
}

const StageStyle = {
    backgroundColor: 'rgba(255,255,0,0.3)'
}

const DomStyle = {
    backgroundColor: 'rgba(255,0,0,0.3)'
}