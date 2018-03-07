import React from 'react';
import {CanvasLayer, CanvasSprite} from "tigerface-display";
import {Logger} from 'tigerface-common';
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';

export const CanvasSpriteTag = 'CanvasSprite';

/**
 * User: zyh
 * Date: 2018/3/6.
 * Time: 19:39.
 */
export default class CanvasComponent extends React.Component {
    static logger = Logger.getLogger(CanvasComponent.name);

    constructor(...args) {
        super(...args);
        this.tagName = 'canvas';
    }

    componentDidMount() {
        const props = this.props;
        this._displayObject_ = new CanvasLayer({style: props.style}, this._tagRef);
        if (props.appendToParent) {
            props.appendToParent(this._displayObject_);
        }
        this._mountNode = DisplayObjectRenderer.createContainer(this._displayObject_);
        DisplayObjectRenderer.updateContainer(this.props.children, this._mountNode, this);

        CanvasComponent.logger.debug("componentDidMount()", this._displayObject_);
    }

    componentDidUpdate(prevProps, prevState) {
        const props = this.props;
        this._displayObject_.setState({style: props.style});

        DisplayObjectRenderer.updateContainer(this.props.children, this._mountNode, this);
    }

    componentWillUnmount() {
        DisplayObjectRenderer.updateContainer(null, this._mountNode, this);
    }

    render() {
        const props = this.props;

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


const DisplayObjectRenderer = Reconciler({
    appendInitialChild(parentInstance, child) {
        console.log("appendInitialChild", parentInstance, child);
    },

    createInstance(type, props, internalInstanceHandle) {
        if(type === CanvasSpriteTag)
            return new props.clazz;
        CanvasComponent.logger.error(`在 CanvasLayer 内部只能使用标签：${CanvasSpriteTag}\n用法： <${CanvasSpriteTag} clazz="<自定义的显示对象类>"></${CanvasSpriteTag}>`);
    },

    createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
        return text;
    },

    finalizeInitialChildren(wordElement, type, props) {
        return false;
    },

    getPublicInstance(inst) {
        return inst;
    },

    prepareForCommit() {
        // noop
    },

    prepareUpdate(wordElement, type, oldProps, newProps) {
        return true;
    },

    resetAfterCommit() {
        // noop
    },

    resetTextContent(wordElement) {
        // noop
    },

    getRootHostContext(instance) {
    },

    getChildHostContext(instance) {
        return emptyObject;
    },

    shouldSetTextContent(type, props) {
        return false;
    },

    now: () => {
    },

    useSyncScheduling: true,

    mutation: {
        appendChild(parentInstance, child) {
            console.log("mutation.appendChild", parentInstance, child);
        },

        appendChildToContainer(parentInstance, child) {
            parentInstance.addChild(child);
        },

        removeChild(parentInstance, child) {
            console.log("mutation.removeChild", parentInstance, child);
        },

        removeChildFromContainer(parentInstance, child) {
            console.log("mutation.removeChildFromContainer", parentInstance, child);
        },

        insertBefore(parentInstance, child, beforeChild) {
            // noob
        },

        commitUpdate(instance, updatePayload, type, oldProps, newProps) {
            // noop
        },

        commitMount(instance, updatePayload, type, oldProps, newProps) {
            // noop
        },

        commitTextUpdate(textInstance, oldText, newText) {
            console.log("mutation.commitTextUpdate", textInstance, oldText, newText);
        },
    }
})