import React from 'react';
import ReactDom from 'react-dom';
import {Logger} from 'tigerface-common';
import SpriteComponent from "./SpriteComponent";

/**
 * User: zyh
 * Date: 2018/3/6.
 * Time: 19:39.
 */
export default class DomSpriteComponent extends SpriteComponent {
    static logger = Logger.getLogger(DomSpriteComponent.name);

    constructor(...args) {
        super(...args);
        this.tagName = 'div';
    }

    render() {
        const props = this.props;
        const Tag = this.tagName || 'div';
        var childrenWithProps = React.Children.map(props.children, child =>
            React.cloneElement(child, {appendToParent: (child) => this._appendChild_(child)}));
        return (
            <Tag
                ref={ref => (this._tagRef = ref)}
                accessKey={props.accessKey}
                className={props.className}
                draggable={props.draggable}
                role={props.role}
                style={props.style}
                tabIndex={props.tabIndex}
                title={props.title}
            >{childrenWithProps}</Tag>
        );
    }
}