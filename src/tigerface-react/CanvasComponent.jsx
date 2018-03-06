import React from 'react';
import DomSpriteComponent from "./DomSpriteComponent";
import {DomSprite} from "../tigerface-display";

/**
 * User: zyh
 * Date: 2018/3/6.
 * Time: 19:39.
 */
export default class CanvasComponent extends DomSpriteComponent {

    _createDisplayObject_(dom, props) {
        return new DomSprite();
    }

    _updateDisplayObject_(defore, after) {
        return new DomSprite();
    }

    _onDestroy_() {

    }

    render() {
        const props = this.props;

        // 这里安静的绘制一个 canvas 就够了，其它的交给 componentDidUpdate 去做

        return (
            <canvas
                ref={ref => (this._tagRef = ref)}
                accessKey={props.accessKey}
                className={props.className}
                draggable={props.draggable}
                role={props.role}
                style={props.style}
                tabIndex={props.tabIndex}
                title={props.title}
            />
        );
    }
}