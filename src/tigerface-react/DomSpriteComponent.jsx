import React from 'react';
import ReactDom from 'react-dom';
import {Logger} from 'tigerface-common';

/**
 * User: zyh
 * Date: 2018/3/6.
 * Time: 19:39.
 */
export default class DomSpriteComponent extends React.Component {
    static logger = Logger.getLogger(DomSpriteComponent.name);

    constructor(...args) {
        super(...args);
        this._displayObjectChildren_ = [];
    }

    _appendChild_ (child) {
        this._displayObjectChildren_.push(child);
    }

    _createDisplayObject_(dom, props) {
        DomSpriteComponent.logger.error("方法：_createDisplayObject_() 必须覆盖实现，应该在方法中初始化 DomSprite 实例");
    }

    _updateDisplayObject_(prevProps, prevState) {
        DomSpriteComponent.logger.error("方法：_updateDisplayObject_() 必须覆盖实现，应该在方法中发送更新事件");
    }

    _onDestroy_() {
        DomSpriteComponent.logger.error("方法：_onDestroy_() 必须覆盖实现，应该在方法中移除子节点，并销毁自己");
    }

    componentDidMount() {
        const props = this.props;
        this._displayObject_ = this._createDisplayObject_(this._tagRef, props);
        this._displayObjectChildren_.forEach((child)=>{
            this._displayObject_.addChild(child);
        })
        if (props.appendToParent) {
            props.appendToParent(this._displayObject_);
        }
        DomSpriteComponent.logger.debug("componentDidMount()", this._displayObjectChildren_, props);
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
        const Tag = props.tagName || 'div';
        var childrenWithProps = React.Children.map(props.children, child =>
            React.cloneElement(child, {appendToParent: (child)=>this._appendChild_(child)}));
        return (
            <div
                ref={ref => (this._tagRef = ref)}
                accessKey={props.accessKey}
                className={props.className}
                draggable={props.draggable}
                role={props.role}
                style={props.style}
                tabIndex={props.tabIndex}
                title={props.title}
            >{childrenWithProps}</div>
        );
    }
}