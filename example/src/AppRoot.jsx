import React from 'react';
import ReactDOM from 'react-dom';
import {Logger} from 'tigerface-common';
import {Event, EventDispatcher} from 'tigerface-event';
import LayerComponent from './LayerComponent';
import CanvasLayer from './CanvasLayer';
import {DomSpriteComponent, CanvasComponent} from 'tigerface-react';
import {DomSprite} from "tigerface-display";
import $ from 'jquery';
window.$ = $;

class Panel extends DomSpriteComponent {

    _createDisplayObject_(dom, props) {
        console.log("**********", dom, props);
        let sprite = new DomSprite(dom);
        sprite.on(Event.NodeEvent.CHILDREN_CHANGED, ()=>{
            console.log("子节点发生变化", sprite.children);
        });
        return sprite;
    }

    _updateDisplayObject_(defore, after) {
    }

    _onDestroy_() {

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
        //AppRoot.logger.error("初始化 CanvasLayer 实例");
        // AppRoot.logger.warn("下一个时间片","a",{b:2});
        // AppRoot.logger.info("下一个时间片","a",{b:2});
        // AppRoot.logger.debug("下一个时间片","a",{b:2});
        this.ed = new EventDispatcher();
        EventDispatcher.logger.debugTimingBegin("开始");
        this.ed.addEventListener('a', () => {
        });
        this.ed.addEventListener('b', () => {
        });
        EventDispatcher.logger.debugTiming("继续");
        setTimeout(() => {
            this.ed.addEventListener('c', () => {
            });
            EventDispatcher.logger.debugTimingEnd("结束");
        }, 1200);

        this.dom = document.createElement('div');
    }

    render() {
        return (
            <div>
                <Panel>
                    <CanvasComponent style={Style}/>
                </Panel>
            </div>
        )
    }
};

const Style = {
    backgroundColor:'red'
}

