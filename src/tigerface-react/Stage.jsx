import React from 'react';
import {Stage, CanvasLayer, DomSprite} from "tigerface-display";
import {Logger} from 'tigerface-common';
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';

export const Tag = {
    Sprite: 'CanvasSprite',
    Surface: 'CanvasLayer',
    Dom: 'DomSprite'
};


/**
 * User: zyh
 * Date: 2018/3/6.
 * Time: 19:39.
 */
export default class StageComponent extends React.Component {
    static logger = Logger.getLogger(StageComponent.name);

    constructor(...args) {
        super(...args);
        this.tagName = 'canvas';
    }

    componentDidMount() {
        const props = this.props;
        this._displayObject_ = new Stage({style: props.style}, this._tagRef);
        if (props.appendToParent) {
            props.appendToParent(this._displayObject_);
        }
        this._mountNode = DisplayObjectRenderer.createContainer(this._displayObject_);
        DisplayObjectRenderer.updateContainer(this.props.children, this._mountNode, this);

        StageComponent.logger.debug("componentDidMount()", this._displayObject_);
    }

    // eslint-disable-next-line no-unused-vars
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
            <div
                ref={ref => (this._tagRef = ref)}
                accessKey={props.accessKey}
                className={props.className}
                draggable={props.draggable}
                role={props.role}
                style={props.style}
                tabIndex={props.tabIndex}
                title={props.title}
            ></div>
        );
    }
}


const DisplayObjectRenderer = Reconciler({
    // eslint-disable-next-line no-unused-vars
    appendInitialChild(parentInstance, child) {
        // console.log("appendInitialChild", parentInstance, child);
        parentInstance.addChild(child);
    },

    // eslint-disable-next-line no-unused-vars
    createInstance(type, props, internalInstanceHandle) {
        if (type === Tag.Sprite)
            return new props.clazz({name: "ccc"});
        else if (type === Tag.Surface)
            return new CanvasLayer({name: "bbb"});
        else if (type === Tag.Dom)
            return new DomSprite({name: "aaa"});
        StageComponent.logger.error("无效的标签");
    },

    // eslint-disable-next-line no-unused-vars
    createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
        return text;
    },

    // eslint-disable-next-line no-unused-vars
    finalizeInitialChildren(wordElement, type, props) {
        return false;
    },

    getPublicInstance(inst) {
        return inst;
    },

    prepareForCommit() {
        // noop
    },

    // eslint-disable-next-line no-unused-vars
    prepareUpdate(wordElement, type, oldProps, newProps) {
        return true;
    },

    resetAfterCommit() {
        // noop
    },

    // eslint-disable-next-line no-unused-vars
    resetTextContent(wordElement) {
        // noop
    },

    // eslint-disable-next-line no-unused-vars
    getRootHostContext(instance) {
    },

    // eslint-disable-next-line no-unused-vars
    getChildHostContext(instance) {
        return emptyObject;
    },

    // eslint-disable-next-line no-unused-vars
    shouldSetTextContent(type, props) {
        return false;
    },

    now: () => {
    },

    useSyncScheduling: true,

    mutation: {
        // eslint-disable-next-line no-unused-vars
        appendChild(parentInstance, child) {
            // console.log("mutation.appendChild", parentInstance, child);
        },

        appendChildToContainer(parentInstance, child) {
            parentInstance.addChild(child);
        },

        // eslint-disable-next-line no-unused-vars
        removeChild(parentInstance, child) {
            // console.log("mutation.removeChild", parentInstance, child);
        },

        // eslint-disable-next-line no-unused-vars
        removeChildFromContainer(parentInstance, child) {
            // console.log("mutation.removeChildFromContainer", parentInstance, child);
        },

        // eslint-disable-next-line no-unused-vars
        insertBefore(parentInstance, child, beforeChild) {
            // noob
        },

        // eslint-disable-next-line no-unused-vars
        commitUpdate(instance, updatePayload, type, oldProps, newProps) {
            // noop
        },

        // eslint-disable-next-line no-unused-vars
        commitMount(instance, updatePayload, type, oldProps, newProps) {
            // noop
        },

        // eslint-disable-next-line no-unused-vars
        commitTextUpdate(textInstance, oldText, newText) {
            // console.log("mutation.commitTextUpdate", textInstance, oldText, newText);
        },
    }
});