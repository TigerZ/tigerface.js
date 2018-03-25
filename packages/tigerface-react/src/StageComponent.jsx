/* eslint-disable no-use-before-define,no-nested-ternary,new-cap */
import React from 'react';
import { Stage, CanvasLayer, DomSprite, CanvasSprite, DomLayer } from 'tigerface-display';
import { Logger } from 'tigerface-common';
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import BaseComponent from './BaseComponent';


export const Tag = {
    Sprite: 'CanvasSprite',
    Surface: 'CanvasLayer',
    Layer: 'DomLayer',
    Dom: 'DomSprite',
};


/**
 * User: zyh
 * Date: 2018/3/6.
 * Time: 19:39.
 */
class StageComponent extends BaseComponent {
    static logger = Logger.getLogger(StageComponent.name);

    constructor(...args) {
        super(...args);
        this.clazzName = StageComponent.name;
        this.tagName = 'canvas';
    }

    componentDidMount() {
        const props = Object.assign({}, this.props);
        delete props.children;
        this._displayObject_ = new Stage(props, this._tagRef);

        this._mountNode = DisplayObjectRenderer.createContainer(this._displayObject_);
        DisplayObjectRenderer.updateContainer(this.props.children, this._mountNode, this);

        this.logger.debug('componentDidMount()', this._displayObject_);
    }

    // eslint-disable-next-line no-unused-vars
    componentDidUpdate(prevProps, prevState) {
        const { props } = this;
        this._displayObject_.assign({ style: props.style });

        DisplayObjectRenderer.updateContainer(this.props.children, this._mountNode, this);
    }

    componentWillUnmount() {
        DisplayObjectRenderer.updateContainer(null, this._mountNode, this);
    }

    render() {
        const { props } = this;

        return (
            <div
                ref={(ref) => {
                    this._tagRef = ref;
                    return this._tagRef;
                }}
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
    // eslint-disable-next-line no-unused-vars
    appendInitialChild(parentInstance, child) {
        StageComponent.logger.debug('appendInitialChild()', parentInstance, child);
        parentInstance.addChild(child);
    },

    // eslint-disable-next-line no-unused-vars
    createInstance(type, props, internalInstanceHandle) {
        StageComponent.logger.debug('createInstance()', type, props, internalInstanceHandle);

        let instance;
        if (type === Tag.Surface) {
            instance = props.instance ? props.instance : (props.clazz ? (typeof props.clazz === 'string' ? new CanvasLayer({}, props.clazz) : new props.clazz()) : new CanvasLayer());
        } else if (type === Tag.Dom) {
            instance = props.instance ? props.instance : (props.clazz ? (typeof props.clazz === 'string' ? new DomSprite({}, props.clazz) : new props.clazz()) : new DomSprite());
        } else if (type === Tag.Layer) {
            instance = props.instance ? props.instance : (props.clazz ? (typeof props.clazz === 'string' ? new DomLayer({}, props.clazz) : new props.clazz()) : new DomLayer());
        } else if (type === Tag.Sprite) {
            instance = props.instance ? props.instance : (props.clazz ? new props.clazz() : new CanvasSprite());
        }


        if (instance) {
            const _props = Object.assign({}, props);
            delete _props.children;
            delete _props.clazzName;
            delete _props.key;
            delete _props.ref;
            instance.assign(_props);
            return instance;
        }
        this.logger.error('无效的标签');
        return undefined;
    },

    // eslint-disable-next-line no-unused-vars
    createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
        StageComponent.logger.debug('createTextInstance()', text, rootContainerInstance, internalInstanceHandle);
        return text;
    },

    // eslint-disable-next-line no-unused-vars
    finalizeInitialChildren(wordElement, type, props) {
        StageComponent.logger.debug('finalizeInitialChildren()', wordElement, type, props);
        return false;
    },

    getPublicInstance(inst) {
        StageComponent.logger.debug('getPublicInstance()', inst);
        return inst;
    },

    prepareForCommit() {
        StageComponent.logger.debug('prepareForCommit()');
        // noop
    },

    // eslint-disable-next-line no-unused-vars
    prepareUpdate(wordElement, type, oldProps, newProps) {
        StageComponent.logger.debug('prepareUpdate()', wordElement, type, oldProps, newProps);
        return true;
    },

    resetAfterCommit() {
        StageComponent.logger.debug('resetAfterCommit()');
        // noop
    },

    // eslint-disable-next-line no-unused-vars
    resetTextContent(wordElement) {
        StageComponent.logger.debug('resetTextContent()', wordElement);
        // noop
    },

    // eslint-disable-next-line no-unused-vars
    getRootHostContext(instance) {
        StageComponent.logger.debug('getRootHostContext()', instance);
    },

    // eslint-disable-next-line no-unused-vars
    getChildHostContext(instance) {
        StageComponent.logger.debug('getChildHostContext()', instance);
        return emptyObject;
    },

    // eslint-disable-next-line no-unused-vars
    shouldSetTextContent(type, props) {
        StageComponent.logger.debug('shouldSetTextContent()', type, props);
        return false;
    },

    now: () => {
        StageComponent.logger.debug('now()');
    },

    useSyncScheduling: true,

    mutation: {
        // eslint-disable-next-line no-unused-vars
        appendChild(parentInstance, child) {
            StageComponent.logger.debug('mutation.appendChild()', parentInstance, child);
        },

        appendChildToContainer(parentInstance, child) {
            StageComponent.logger.debug('mutation.appendChildToContainer()', parentInstance, child);
            parentInstance.addChild(child);
        },

        // eslint-disable-next-line no-unused-vars
        removeChild(parentInstance, child) {
            StageComponent.logger.debug('mutation.removeChild()', parentInstance, child);
            parentInstance.removeChild(child);
        },

        // eslint-disable-next-line no-unused-vars
        removeChildFromContainer(parentInstance, child) {
            StageComponent.logger.debug('mutation.removeChildFromContainer()', parentInstance, child);
            parentInstance.removeChild(child);
        },

        // eslint-disable-next-line no-unused-vars
        insertBefore(parentInstance, child, beforeChild) {
            StageComponent.logger.debug('mutation.insertBefore()', parentInstance, child, beforeChild);
            // noob
        },

        // eslint-disable-next-line no-unused-vars
        commitUpdate(instance, updatePayload, type, oldProps, newProps) {
            StageComponent.logger.debug('mutation.commitUpdate()', instance, updatePayload, type, oldProps, newProps);
            if (instance && instance.update) {
                const _props = Object.assign({}, newProps);
                delete _props.children;
                delete _props.clazz;
                delete _props.instance;
                delete _props.key;
                delete _props.ref;
                instance.update(_props);
            }
            //
        },

        // eslint-disable-next-line no-unused-vars
        commitMount(instance, updatePayload, type, oldProps, newProps) {
            StageComponent.logger.debug('mutation.commitMount()', instance, updatePayload, type, oldProps, newProps);
            // noop
        },

        // eslint-disable-next-line no-unused-vars
        commitTextUpdate(textInstance, oldText, newText) {
            StageComponent.logger.debug('mutation.commitTextUpdate()', textInstance, oldText, newText);
        },
    },
});

export default StageComponent;
