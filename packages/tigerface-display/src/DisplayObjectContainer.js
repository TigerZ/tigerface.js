import { Event } from 'tigerface-event';
import { Logger } from 'tigerface-common';
import DisplayObject from './DisplayObject';

/**
 * 显示对象容器
 *
 * @extends DisplayObject
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class DisplayObjectContainer extends DisplayObject {
    static logger = Logger.getLogger(DisplayObjectContainer.name);

    /**
     * @param options {object} 可选初始属性
     */
    constructor(options = undefined) {
        const props = {
            clazzName: DisplayObjectContainer.name,
            _children_: [],
        };

        super(props);

        this.assign(options);
    }


    // set children(v) {
    //     this.logger.error('不允许设置或覆盖 children 属性');
    // }

    /**
     *
     * @returns [DisplayObject]
     */
    get children() {
        return this._children_;
    }

    /** *************************************************************************
     *
     * 容器方法
     *
     ************************************************************************* */

    /**
     * 添加子显示对象
     * @param child {DisplayObject} 子显示对象
     * @returns {DisplayObjectContainer} 返回本容器, 支持链式调用，例如：a.addChild(b).addChild(c);
     */
    addChild(child) {
        // 子节点添加前调用方法，可用于检查合法性
        if (this._onBeforeAddChild_(child) === false) {
            this.logger.info('addChild(): 下级显示对象添加失败');
            return this;
        }
        // 将子节点添加至容器最后
        this.children.push(child);

        // 设置本容器为子节点的 parent
        child.parent = this;

        // 子节点添加完成事件方法
        this._onAddChild_(child);

        // 子节点整体发生变化事件方法
        this._onChildrenChanged_();

        return this;
    }

    /**
     * 移除指定子显示对象
     * @param child {DisplayObject} 要移除的子显示对象
     * @returns {DisplayObjectContainer} 返回本容器, 支持链式调用，例如：a.addChild(b).addChild(c);
     */
    removeChild(child) {
        // 移除前调用方法，可用于检查合法性
        if (this._onBeforeRemoveChild_(child) === false) {
            this.logger.debug('removeChild 子显示对象移除失败', child);
            return this;
        }

        // 执行移除
        this._removeChild_(child);

        // 调用事件方法
        this._onRemoveChild_(child);
        this._onChildrenChanged_();

        // 状态已改变
        this.postChange('removeChild');

        return this;
    }

    /**
     * 执行移除。内部调用方法，不调用事件方法
     * @param child {DisplayObject}
     * @private
     */
    _removeChild_(child) {
        const index = this.getChildIndex(child);
        this._removeChildAt_(index);
    }

    /**
     * 移除指定位置的子对象
     * @param index {number}
     * @returns {DisplayObjectContainer}
     */
    removeChildAt(index) {
        // 移除前调用方法，可用于检查合法性

        if (index < 0 || index >= this.children.length || this._onBeforeRemoveChild_(this.children[index]) === false) {
            this.logger.debug('removeChildAt() 子显示对象移除失败', index);
            return this;
        }

        const child = this.children[index];

        // 执行移除
        this._removeChildAt_(index);

        // 调用事件方法
        this._onRemoveChild_(child);
        this._onChildrenChanged_();

        // 状态已改变
        this.postChange('removeChildAt');

        return this;
    }

    _removeChildAt_(index) {
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    /**
     * 移除指定开始截止位置的多个子对象
     * @param startIndex
     * @param endIndex
     * @returns {DisplayObjectContainer}
     */
    removeChildren(startIndex = 0, endIndex = this.children.length - 1) {
        this.children.splice(startIndex, (endIndex - startIndex) + 1);

        this._onChildrenChanged_();
        this.postChange('removeChildren');
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

    /** *************************************************************************
     *
     * 子节点顺序方法
     *
     ************************************************************************* */

    /**
     * 交换两个指定位置的子对象
     * @param index1
     * @param index2
     * @returns {DisplayObjectContainer}
     */
    swapChildrenAt(index1, index2) {
        const tmp = this.children[index1];
        this.children[index1] = this.children[index2];
        this.children[index2] = tmp;
        this._onChildrenChanged_();
        this.postChange('swapChildrenAt');
        return this;
    }

    /**
     * 交换两个子对象的位置
     * @param child1
     * @param child2
     * @returns {DisplayObjectContainer}
     */
    swapChildren(child1, child2) {
        const index1 = this.getChildIndex(child1);
        const index2 = this.getChildIndex(child2);
        this.swapChildrenAt(index1, index2);
        this._onChildrenChanged_();
        this.postChange('swapChildren');
        return this;
    }

    /**
     * 指定子对象的位置
     * @param child
     * @param index
     * @returns {DisplayObjectContainer}
     */
    setChildIndex(child, index) {
        this._removeChild_(child);

        if (index >= this.children.length) {
            this.children.push(child);
        } else if (index <= 0) {
            this.children.unshift(child);
        } else {
            this.children.splice(index, 0, child);
        }

        this._onChildrenChanged_();
        this.postChange('setChildIndex');
        return this;
    }

    /**
     * 设置子对象的位置为最顶层
     * @param child
     * @param neighbor 指定放在 neighbor 上面
     * @returns {DisplayObjectContainer}
     */
    setTop(child, neighbor) {
        if (child === neighbor) return this;
        if (neighbor) {
            const n1 = this.getChildIndex(neighbor);
            const n0 = this.getChildIndex(child);
            this.setChildIndex(child, n0 < n1 ? n1 : n1 + 1);
        } else {
            this.setChildIndex(child, this.children.length - 1);
        }
        //
        this._onChildrenChanged_();
        this.postChange('setTop');
        return this;
    }

    /**
     * 设置子对象的位置为最底层
     * @param child
     * @param neighbor 指定放在 neighbor 下面
     * @returns {DisplayObjectContainer}
     */
    setBottom(child, neighbor) {
        if (child === neighbor) return this;
        if (neighbor) {
            const n0 = this.getChildIndex(child);
            const n1 = this.getChildIndex(neighbor);
            this.setChildIndex(child, n0 > n1 ? n1 : n1 - 1);
        } else {
            this.setChildIndex(child, 0);
        }
        this._onChildrenChanged_();
        this.postChange('setBottom');

        return this;
    }

    /** *************************************************************************
     *
     * 事件方法
     *
     ************************************************************************* */

    /**
     * 子节点添加前调用的方法
     * 子类可通过重写此方法, 对将要添加的子节点进行检查, 如果返回 false, 可导致良性添加失败
     *
     * @param child {DisplayObject} 要添加的子节点
     * @returns {boolean} 如果精确返回 false, 会导致添加失败
     * @private
     */
    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    _onBeforeAddChild_(child) {
        return true;
    }

    /**
     * 绘制后调用的方法，子类需要根据情况覆盖此方法的实现
     *
     * @private
     */
    _onAfterPaint_() {
        for (let i = 0; i < this.children.length; i += 1) {
            const child = this.children[i];
            child._paint_();
        }
    }

    /**
     * 移除子节点前检查
     * @param child {DisplayObject} 要移除的子节点
     * @returns {boolean}
     * @private
     */
    // eslint-disable-next-line no-unused-vars
    _onBeforeRemoveChild_(child) {
        return true;
    }

    _onRemoveChild_(child) {
        this.emit(Event.NodeEvent.CHILD_REMOVED, child);
    }

    _onChildrenChanged_() {
        this.logger.debug('子节点发生变化', this.children);
        this.emit(Event.NodeEvent.CHILDREN_CHANGED);
    }

    /**
     * 系统进入帧事件侦听器，将事件转发至自身的侦听器
     *
     */
    _onEnterFrame_() {
        super._onEnterFrame_();
        this.children.forEach((child) => {
            child._onEnterFrame_();
        });
    }

    get graphics() {
        if (this._graphics_ === undefined) {
            if (this.parent && this.parent.graphics) {
                this.graphics = this.parent.graphics;
            }
        }
        return this._graphics_;
    }

    set graphics(v) {
        this._graphics_ = v;
    }

    /**
     * 当子节点添加完成后被调用
     * @param child {DisplayObject}
     */
    _onAddChild_(child) {
        this.emit(Event.NodeEvent.CHILD_ADDED, child);
    }

    /**
     * 覆盖超类方法，增加遍历孩子
     */
    _onAppendToStage_() {
        super._onAppendToStage_();

        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            this.children[i]._onAppendToStage_();
        }
    }

    /**
     * 覆盖超类方法，增加遍历孩子
     */
    _onAppendToLayer_() {
        super._onAppendToLayer_();

        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            this.children[i]._onAppendToLayer_();
        }
    }

    /**
     * 覆盖超类方法，增加遍历孩子
     */
    _onStateChanged_() {
        super._onStateChanged_();

        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            this.children[i].involvedChange();
        }
    }

    /**
     * 覆盖超类方法，增加遍历孩子
     */
    _onPosChanged_() {
        super._onPosChanged_();
        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            const child = this.children[i];
            child._onPosChanged_();
        }
    }

    /**
     * 覆盖超类方法，增加遍历孩子
     */
    _onScaleChanged_() {
        super._onScaleChanged_();
        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            const child = this.children[i];
            child._onScaleChanged_();
        }
    }

    /**
     * 覆盖超类方法，增加遍历孩子
     */
    _onAlphaChanged_() {
        super._onAlphaChanged_();
        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            this.children[i]._onAlphaChanged_();
        }
    }

    /**
     * 覆盖超类方法，增加遍历孩子
     */
    _onRotationChanged_() {
        super._onRotationChanged_();
        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            this.children[i]._onRotationChanged_();
        }
    }

    /**
     * 覆盖超类方法，增加遍历孩子
     */
    _onVisibleChanged_() {
        super._onVisibleChanged_();
        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            this.children[i]._onVisibleChanged_();
        }
    }

    /**
     * 覆盖超类方法，增加遍历孩子
     */
    _onOriginChanged_() {
        super._onOriginChanged_();

        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            const child = this.children[i];
            child._onOriginChanged_();
        }
    }

    /**
     * 覆盖超类方法，增加遍历孩子
     */
    _onSizeChanged_() {
        super._onSizeChanged_();
        for (let i = this.children.length - 1; i >= 0; i -= 1) {
            this.children[i]._onSizeChanged_();
        }
    }
}

export default DisplayObjectContainer;
