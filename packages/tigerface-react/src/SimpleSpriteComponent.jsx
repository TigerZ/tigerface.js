/* eslint-disable no-unused-vars */
import React from 'react';
import BaseComponent from './BaseComponent';
import StageComponent from './StageComponent';
import { Tag } from './displayObjectFactory';

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
            <StageComponent {...props}>
                <Tag.CanvasLayer {...canvasProps}>
                    <Tag.Sprite instance={instance} {...props} />
                </Tag.CanvasLayer>
            </StageComponent>
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
