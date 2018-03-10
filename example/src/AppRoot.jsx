/* eslint-disable no-unused-vars */
import React from 'react';
import {Logger} from 'tigerface-common';
// import {DomSpriteComponent, CanvasComponent, CanvasSpriteComponent, StageComponent} from 'tigerface-react';
import {Stage, Tag} from 'tigerface-react';
import {CanvasSprite} from "tigerface-display";
import $ from 'jquery';

window.$ = $;
import {Rectangle, Curve} from 'tigerface-shape';
import {Event} from "tigerface-event";

// eslint-disable-next-line no-unused-vars
// class Panel extends DomSpriteComponent {
//     constructor(options) {
//         super(options);
//         this.name = 'Panel'
//     }
//
//     _createDisplayObject_(dom) {
//         // console.log("**********", dom, props);
//         let sprite = new DomSprite({}, dom);
//         // sprite.on(Event.NodeEvent.CHILDREN_CHANGED, ()=>{
//         //     console.log("子节点发生变化", sprite.children);
//         // });
//         return sprite;
//     }
//
//     _updateDisplayObject_() {
//     }
//
//     _onDestroy_() {
//     }
// }

class BallSprite extends CanvasSprite {
    constructor(options) {
        super(options);
        this.size = {width: 100, height: 100};
        this.pos = {x: 100, y: 100};
        this.step = 1;
        this.on(Event.ENTER_FRAME, this.onEnterFrame);
        this.addBound(new Rectangle(0, 0, 100, 50));
        this.enableDrag();
    }

    //
    move() {
        if (this.y < 0 || this.y > 200) this.step = -this.step;
        this.y += this.step;
    }

    onEnterFrame = () => {
        this.move();
    };

    paint() {
        let ctx = this.graphics;
        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgba(255,0,0,0.5)';

        ctx.drawRectangle(this.boundingRect,
            ctx.DrawStyle.FILL);

        ctx.strokeStyle = 'rgb(0,0,255)';
        ctx.drawCurve(new Curve([{x:0,y:0},{x:10,y:5},{x:15,y:10},{x:16,y:15}]))

        // this.move();
    }
}

/**
 * User: zyh
 * Date: 2018/2/25.
 * Time: 22:37.
 */
export default class AppRoot extends React.Component {
    static logger = Logger.getLogger("example.AppRoot");

    constructor(...args) {
        super(...args);
    }

    render() {
        return (
            <Stage>
                <Tag.Dom>
                    <Tag.Surface title={'Surface'} style={Style}>
                        <Tag.Sprite clazz={BallSprite}/>
                    </Tag.Surface>
                    <Tag.Surface title={'Surface'} style={Style}>
                        <Tag.Sprite clazz={BallSprite}/>
                    </Tag.Surface>
                </Tag.Dom>
                <Tag.Dom>
                    <Tag.Surface title={'Surface'} style={Style}>
                        <Tag.Sprite clazz={BallSprite}/>
                    </Tag.Surface>
                    <Tag.Surface title={'Surface'} style={Style}>
                        <Tag.Sprite clazz={BallSprite}/>
                    </Tag.Surface>
                </Tag.Dom>
            </Stage>
        )
    }
}

const Style = {
    backgroundColor: 'rgba(0,0,0,0.2)'
};

