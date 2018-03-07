import React from 'react';
import {Logger} from 'tigerface-common';
import {EventDispatcher} from 'tigerface-event';
import {DomSpriteComponent, CanvasComponent, CanvasSpriteComponent, StageComponent} from 'tigerface-react';
import {CanvasSprite, DomSprite} from "tigerface-display";
import $ from 'jquery';

window.$ = $;
import {Circle, Rectangle} from 'tigerface-shape';

class Panel extends DomSpriteComponent {
    constructor(options) {
        super(options);
        this.name = 'Panel'
    }

    _createDisplayObject_(dom, props) {
        // console.log("**********", dom, props);
        let sprite = new DomSprite({}, dom);
        // sprite.on(Event.NodeEvent.CHILDREN_CHANGED, ()=>{
        //     console.log("子节点发生变化", sprite.children);
        // });
        return sprite;
    }

    _updateDisplayObject_(defore, after) {
    }

    _onDestroy_() {

    }
}

class BallSprite extends CanvasSprite {
    constructor(options) {
        super(options);
        this.size = {width: 100, height: 100};
        this.pos = {x: 100, y: 100};
        this.step = 1;
    }

    //
    move() {
        if (this.y < 50 || this.y > 150) this.step = -this.step;
        this.y += this.step;
    }

    paint(ctx) {

        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgba(255,0,0,0.5)';

        ctx.drawRectangle(new Rectangle(0, 0, 100, 50),
            ctx.DrawStyle.FILL);

        this.move();
        // this.postChange();
        // console.log("%cpaint", "color:red", this.y);
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
            <StageComponent>
                <Panel>
                    <CanvasComponent title={'Surface'} style={Style}>
                        <CanvasSpriteComponent clazz={BallSprite}/>
                    </CanvasComponent>
                </Panel>
            </StageComponent>
        )
    }
};

const Style = {
    backgroundColor: 'rgba(0,0,0,0.2)'
}

