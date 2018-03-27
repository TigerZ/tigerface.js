/* eslint-disable no-unused-vars */
import React from 'react';
import BaseComponent from './BaseComponent';
import Stage, { Tag } from './StageComponent';

/**
 * User: zyh
 * Date: 2018/3/12.
 * Time: 19:09.
 */
class SimpleSpriteComponent extends BaseComponent {
    constructor() {
        super();
        this.clazzName = SimpleSpriteComponent.name;
    }

    getSpriteInfo() {
        return {};
    }

    render() {
        const { props } = this;
        const { instance, canvasProps } = this.getSpriteInfo();
        return (
            <Stage {...props}>
                <Tag.Surface {...canvasProps}>
                    <Tag.Sprite instance={instance} {...props} />
                </Tag.Surface>
            </Stage>
        );
    }
}

export default function withSimpleSpriteComponent(instance, canvasProps) {
    return class extends SimpleSpriteComponent {
        getSpriteInfo() {
            return { instance, canvasProps };
        }
    };
}
