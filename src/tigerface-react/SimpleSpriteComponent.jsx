/* eslint-disable no-unused-vars */
import React from 'react';
import {default as Stage, Tag} from './Stage';
import BaseComponent from "./BaseComponent";
import StageComponent from "./Stage";

/**
 * User: zyh
 * Date: 2018/3/12.
 * Time: 19:09.
 */
class SimpleSpriteComponent extends BaseComponent {
    constructor() {
        super();
        this.className = SimpleSpriteComponent.name;
    }

    getSpriteInfo() {
        return {};
    }

    render() {
        const props = this.props;
        const {instance, style, name} = this.getSpriteInfo();
        return (
            <Stage {...props}>
                <Tag.Surface style={style}>
                    <Tag.Sprite instance={instance}/>
                </Tag.Surface>
            </Stage>
        )
    }
}

export default function withSimpleSpriteComponent(instance, style) {
    return class extends SimpleSpriteComponent {
        getSpriteInfo() {
            let name = instance.name ? instance.name : (instance.className ? instance.className : '');
            return {instance, style, name};
        }
    };
}
