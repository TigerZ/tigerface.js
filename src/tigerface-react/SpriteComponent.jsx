/* eslint-disable no-unused-vars */
import {Logger} from "../tigerface-common";

import React from 'react';

/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 22:32.
 */
export default class SpriteComponent extends React.Component {
    static logger = Logger.getLogger(SpriteComponent.name);

    constructor(...args) {
        super(...args);
        this._displayObjectChildren_ = [];
        this.tagName = 'DisplayObject';
    }

    getDisplayObject() {
        return this._displayObject_;
    }

    _appendChild_(child) {
        this._displayObjectChildren_.push(child);
    }

    _createDisplayObject_(dom, props) {
        SpriteComponent.logger.error("方法：_createDisplayObject_() 必须覆盖实现，应该在方法中初始化 DomSprite 实例");
    }

    _updateDisplayObject_(prevProps, prevState) {
        SpriteComponent.logger.error("方法：_updateDisplayObject_() 必须覆盖实现，应该在方法中发送更新事件");
    }

    _onDestroy_() {
        SpriteComponent.logger.error("方法：_onDestroy_() 必须覆盖实现，应该在方法中移除子节点，并销毁自己");
    }

    componentDidMount() {
        const props = this.props;
        this._displayObject_ = this._createDisplayObject_(this._tagRef, props);
        this._displayObjectChildren_.forEach(child => {
            this._displayObject_.addChild(child);
        });
        if (props.appendToParent) {
            props.appendToParent(this._displayObject_);
        }
        SpriteComponent.logger.debug("componentDidMount()", this._displayObject_);
    }

    componentDidUpdate(prevProps, prevState) {
        this._displayObject_ = this._updateDisplayObject_(prevProps, prevState);
    }

    componentWillUnmount() {
        this._onDestroy_();
        this._displayObject_ = undefined;
    }

    render() {
        const props = this.props;
        let childrenWithProps = React.Children.map(props.children, child =>
            React.cloneElement(child, {appendToParent: (child) => this._appendChild_(child)}), {});
        return React.createElement(this.tagName, Object.assign({}, props), childrenWithProps);
    }
}
