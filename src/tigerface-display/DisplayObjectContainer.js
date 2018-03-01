/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 14:13.
 */

import {EventDispatcher, Event} from 'tigerface-event';
import DisplayObject from './DisplayObject';

export default class DisplayObjectContainer extends DisplayObject {
    constructor(...args) {
        super(...args);

        // 上下级关系属性
        this._parent_ = null;
        this._children_ = [];
    }

    set parent(value) {
        this._parent_ = value;
    }

    get parent() {
        return this._parent_;
    }

    set children(v) {
        //console.log("不能覆盖 children 属性");
    }

    get children() {
        return this._children_;
    }

    /***************************************************************************
     *
     * 容器方法
     *
     **************************************************************************/

    /**
     * 添加子节点
     * @param child 子节点
     * @returns {Node} 返回父节点, 支持链式调用
     */
    addChild(child) {
        // 子节点添加前调用方法
        if (this._onBeforeAddChild_(child) === false) {
            return this;
        }
        // 添加至容器
        this.children.push(child);
        child.parent = this;

        // 子节点添加完成事件方法
        this._onAddChild_(child);

        // 子节点整体发生变化事件方法
        this._onChildrenChanged_();

        return this;
    }

    /**
     * 移除指定子对象
     * @param child
     * @returns {Container}
     */
    removeChild(child) {
        if (this._onBeforeRemoveChild_(child) === false) {
            return this;
        }
        this._removeChild_(child);
        this._onRemoveChild_(child)
        this._onChildrenChanged_();
        this.postChange("removeChild");
        return this;
    }

    _removeChild_(child) {
        var index = this.getChildIndex(child);
        if (index > -1)
            this.children.splice(index, 1);
    }

    /**
     * 移除指定位置的子对象
     * @param index
     * @returns {Container}
     */
    removeChildAt(index) {
        this.children.splice(index, 1);
        this._onChildrenChanged_();
        this.postChange("removeChildAt");
        return this;
    }

    /**
     * 移除指定开始截止位置的多个子对象
     * @param startIndex
     * @param endIndex
     * @returns {Container}
     */
    removeChildren(startIndex, endIndex) {
        if (startIndex == undefined)
            startIndex = 0;
        if (endIndex == undefined)
            endIndex = this.children.length - 1;
        this.children.splice(startIndex, endIndex - startIndex + 1);

        this._onChildrenChanged_();
        this.postChange("removeChildren");
        return this;
    }

    /**
     * 是否包含指定子对象
     * @param child
     * @returns {boolean}
     */
    contains(child) {
        return this.children.includes(child);
    }

    /**
     * 获得指定位置的子对象
     * @param child
     * @returns {*}
     */
    getChildIndex(child) {
        return this.children.indexOf(child);
    }

    /***************************************************************************
     *
     * 子节点顺序方法
     *
     **************************************************************************/

    /**
     * 交换两个指定位置的子对象
     * @param index1
     * @param index2
     * @returns {Container}
     */
    swapChildrenAt(index1, index2) {
        var tmp = this.children[index1];
        this.children[index1] = this.children[index2];
        this.children[index2] = tmp;
        this._onChildrenChanged_();
        this.postChange("swapChildrenAt");
        return this;
    }

    /**
     * 交换两个子对象的位置
     * @param child1
     * @param child2
     * @returns {Container}
     */
    swapChildren(child1, child2) {
        var index1 = this.getChildIndex(child1);
        var index2 = this.getChildIndex(child2);
        this.swapChildrenAt(index1, index2);
        this._onChildrenChanged_();
        this.postChange("swapChildren");
        return this;
    }

    /**
     * 指定子对象的位置
     * @param child
     * @param index
     * @returns {Container}
     */
    setChildIndex(child, index) {
        this._removeChild_(child);

        if (index >= this.children.length)
            this.children.push(child);
        else if (index <= 0)
            this.children.unshift(child);
        else
            this.children.splice(index, 0, child);

        this._onChildrenChanged_();
        this.postChange("setChildIndex");
        return this;
    }

    /**
     * 设置子对象的位置为最顶层
     * @param child
     * @param neighbor 指定放在 neighbor 上面
     * @returns {Container}
     */
    setTop(child, neighbor) {
        if (neighbor) {
            this._removeChild_(child);
            var index1 = this.getChildIndex(neighbor);
            this.setChildIndex(child, index1 - 1);
        } else
            this.setChildIndex(child, this.children.length - 1);
        //
        this._onChildrenChanged_();
        this.postChange("setTop");
        return this;
    }

    /**
     * 设置子对象的位置为最底层
     * @param child
     * @param neighbor 指定放在 neighbor 下面
     * @returns {Container}
     */
    setBottom(child, neighbor) {
        if (neighbor) {
            this._removeChild_(child);
            var index1 = this.getChildIndex(neighbor);
            this.setChildIndex(child, index1);
        } else
            this.setChildIndex(child, 0);
        this._onChildrenChanged_();
        this.postChange("setBottom");

        return this;
    }

    /***************************************************************************
     *
     * 事件方法
     *
     **************************************************************************/

    /**
     * 子节点添加前调用的方法
     * 子类可通过重写此方法, 对将要添加的子节点进行检查, 如果返回 false, 可导致添加失败
     * @param child 子节点
     * @returns {boolean} 如果精确返回 false, 会导致添加失败
     */
    _onBeforeAddChild_(child) {
        return true;
    }

    /**
     * 绘制后调用的方法，子类需要根据情况覆盖此方法的实现
     *
     * @param ctx
     * @private
     */
    _onAfterPaint_(ctx) {
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child._paint_(ctx);
        }
    }

    /**
     * 当子节点添加完成后被调用
     * @param child
     */
    _onAddChild_(child) {
        this.emit(Event.NodeEvent.CHILD_ADDED, child);
    }

    _onBeforeRemoveChild_(child) {
        return true;
    }

    _onRemoveChild_(child) {
        this.emit(Event.NodeEvent.CHILD_REMOVED, child);
    }

    _onChildrenChanged_() {
        this.emit(Event.NodeEvent.CHILDREN_CHANGED);
    }

    /**
     * 系统进入帧事件侦听器，将事件转发至自身的侦听器
     *
     */
    _onEnterFrame_() {
        super._onEnterFrame_();

        for (let child of this.children) {
            child._onEnterFrame_();
        }

    }

    /***************************************************************************
     *
     *
     *
     **************************************************************************/

    /**
     * 通过向祖先的递归遍历，获得 stage 对象
     */
    get stage() {
        if (!this._stage_) {
            var ancestors = [];
            var parent = this.parent;
            while (parent) {
                // 直到找到个知道stage的上级
                if (parent.stage) {
                    this.stage = parent.stage;
                    // 顺便把stage赋给全部没定义stage的上级
                    for (var i = 0; i < ancestors.length; i++) {
                        ancestors[i].stage = this._stage_;
                    }
                    break;
                } else {
                    ancestors.push(parent);
                }
                parent = parent.parent;
            }
        }
        return this._stage_;
    }

    set stage(v) {
        this._stage_ = v;
    }

    _onAddChild_(child) {
        super._onAddChild_(child);
        child._onAppendToStage_();
    }

    /**
     * 判断是否已添加至 stage 链，如果能获得 stage 对象，那么发送 APPEND_TO_STAGE 事件
     * @private
     */
    _onAppendToStage_() {
        let stage = this.stage;
        if (stage && stage != this) {
            this.dispatchEvent(Event.APPEND_TO_STAGE);
            this.postChange("AppendToStage");
        }

        for (var i = this.children.length - 1; i >= 0; i--) {
            var child = this.children[i];
            child._onAppendToStage_();
        }
    }

}