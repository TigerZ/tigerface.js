import { Event } from 'tigerface-event';
import { Logger } from 'tigerface-common';
import DisplayObject from './DisplayObject';

/**
 * 显示对象容器。
 * DisplayObjectContainer 在 DisplayObject 的基础上增加了 children 容器
 * * 支持子对象的添加、删除和位置变换
 * * 重构了部分事件方法，增加向子对象转发
 *
 * 子对象添加后的显示顺序是后添加的在**上层**
 *
 * @extends module:tigerface-display.DisplayObject
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class DisplayObjectContainer extends DisplayObject {
    static logger = Logger.getLogger(DisplayObjectContainer.name);

    /**
     * @param options {object} 可选初始属性
     */
    constructor(options) {
        const props = {
            clazzName: 'DisplayObjectContainer',
            _children_: [],
        };

        super(props);

        this.assign(options);
    }

    set children(v) {
        this.logger.error('不允许设置或覆盖 children 属性');
    }

    /**
     * 子对象
     * @member [*]
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
     * 添加子对象
     * @param child {module:tigerface-display.DisplayObject} 子显示对象
     * @returns {this} 返回本容器, 支持链式调用，例如：a.addChild(b).addChild(c);
     */
    addChild(child) {
        // 子对象添加前调用方法，可用于检查合法性
        if (this._onBeforeAddChild_(child) === false) {
            this.logger.info('addChild(): 下级显示对象添加失败');
            return this;
        }
        // 将子对象添加至容器最后
        this.children.push(child);

        // 设置本容器为子对象的 parent
        child.parent = this;

        // 子对象添加完成事件方法
        this._onAddChild_(child);

        // 子对象整体发生变化事件方法
        this._onChildrenChanged_();

        return this;
    }

    /**
     * 移除子对象
     * @param child {module:tigerface-display.DisplayObject} 要移除的子对象
     * @returns {this} 返回本容器, 支持链式调用，例如：a.addChild(b).addChild(c);
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
     * 执行移除子对象
     * @param child {module:tigerface-display.DisplayObject} 子对象
     * @package
     */
    _removeChild_(child) {
        const index = this.getChildIndex(child);
        this._removeChildAt_(index);
    }

    /**
     * 移除指定位置的子对象
     * @param index {number} 子对象顺序
     * @returns {this}
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

    /**
     * 执行移除指定位置的子对象
     * @param index {number} 子对象顺序
     * @package
     */
    _removeChildAt_(index) {
        this.children.splice(index, 1);
    }

    /**
     * 移除指定开始截止位置的多个子对象
     * @param [startIndex = 0] {number} 起始顺序
     * @param [endIndex = this.children.length - 1] {number} 截止顺序
     * @returns {module:tigerface-display.DisplayObjectContainer}
     */
    removeChildren(startIndex = 0, endIndex = this.children.length - 1) {
        this.children.splice(startIndex, (endIndex - startIndex) + 1);

        this._onChildrenChanged_();
        this.postChange('removeChildren');
        return this;
    }

    /**
     * 是否包含指定子对象
     * @param child {module:tigerface-display.DisplayObject} 子对象
     * @returns {boolean}
     */
    contains(child) {
        return this.children.includes(child);
    }

    /**
     * 获得子对象在容器中的顺序
     * @param child {module:tigerface-display.DisplayObject} 子对象
     * @returns {number} 子对象在容器中的顺序
     */
    getChildIndex(child) {
        return this.children.indexOf(child);
    }

    /** *************************************************************************
     *
     * 子对象顺序方法
     *
     ************************************************************************* */

    /**
     * 交换两个指定位置的子对象
     * @param index1 {number} 子对象顺序
     * @param index2 {number} 子对象顺序
     * @returns {this}
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
     * @param child1 {module:tigerface-display.DisplayObject} 子对象
     * @param child2 {module:tigerface-display.DisplayObject} 子对象
     * @returns {this}
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
     * @param child {module:tigerface-display.DisplayObject} 子对象
     * @param index {number} 新的顺序
     * @returns {this}
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
     * @param child {module:tigerface-display.DisplayObject} 子对象
     * @param neighbor 指定放在 neighbor 上面
     * @returns {this}
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
     * @param child {module:tigerface-display.DisplayObject} 子对象
     * @param neighbor 指定放在 neighbor 下面
     * @returns {this}
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
     * 子对象添加前调用的方法
     * 子类可通过重写此方法, 对将要添加的子对象进行检查, 如果返回 false, 可导致良性添加失败
     *
     * @param child {module:tigerface-display.DisplayObject} 要添加的子对象
     * @returns {boolean} 如果精确返回 false, 会导致添加失败
     * @package
     */
    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    _onBeforeAddChild_(child) {
        return true;
    }

    /**
     * 绘制后调用的方法，子类需要根据情况覆盖此方法的实现
     * @package
     */
    _onAfterPaint_(g) {
        this.children.forEach((child) => {
            child._paint_(g);
        });
    }

    /**
     * 移除子对象前检查
     * @param child {module:tigerface-display.DisplayObject} 要移除的子对象
     * @returns {boolean}
     * @package
     */
    // eslint-disable-next-line no-unused-vars
    _onBeforeRemoveChild_(child) {
        return true;
    }

    /**
     * 移除子对象后调用
     * @param child {module:tigerface-display.DisplayObject}
     * @package
     */
    _onRemoveChild_(child) {
        if (this.stage) {
            this.stage._unregister_(this);
        }
        this.emit(Event.NodeEvent.CHILD_REMOVED, child);
    }

    /**
     * 子对象发生变化
     * @package
     */
    _onChildrenChanged_() {
        this.logger.debug('子对象发生变化', this.children);
        this.emit(Event.NodeEvent.CHILDREN_CHANGED);
        if (this.parent && !this.parent.isStage) this._onChildrenChanged_();
    }

    /**
     * 系统进入帧事件侦听器，将事件转发至自身的侦听器
     * @package
     */
    _onEnterFrame_() {
        super._onEnterFrame_();
        this.children.forEach((child) => {
            child._onEnterFrame_();
        });
    }

    // get graphics() {
    //     if (this._graphics_ === undefined) {
    //         if (this.layer) {
    //             this.graphics = this.layer.graphics;
    //         }
    //     }
    //     return this._graphics_;
    // }
    //
    // /**
    //  * 画笔
    //  * @member {module:tigerface-graphic.Graphics}
    //  */
    // set graphics(v) {
    //     this._graphics_ = v;
    // }

    /**
     * 当子对象添加完成后被调用
     * @param child {module:tigerface-display.DisplayObject}
     * @package
     */
    _onAddChild_(child) {
        this.emit(Event.NodeEvent.CHILD_ADDED, child);
    }

    /**
     * 添加至舞台时调用。覆盖超类方法，增加遍历孩子
     * @package
     */
    _appendToStage_(stage) {
        if (!stage) return;
        
        super._appendToStage_(stage);

        this.children.forEach((child) => {
            child._appendToStage_(stage);
        });
    }

    /**
     * 添加至层时调用。覆盖超类方法，增加遍历孩子
     * @package
     */
    _appendToLayer_(layer) {
        if (!layer) return;

        super._appendToLayer_(layer);

        this.children.forEach((child) => {
            child._appendToLayer_(layer);
        });
    }

    /**
     * 状态改变时调用。覆盖超类方法，增加遍历孩子
     * @package
     */
    _onStateChanged_() {
        super._onStateChanged_();
        this.children.forEach((child) => {
            child.involvedChange();
        });
    }

    involvedChange() {
        super.involvedChange();
        this.children.forEach((child) => {
            child.involvedChange();
        });
    }

    /**
     * 位置改变时调用。覆盖超类方法，增加遍历孩子
     * @package
     */
    _onPosChanged_() {
        super._onPosChanged_();

        this.children.forEach((child) => {
            child._onPosChanged_();
        });
    }

    /**
     * 缩放时调用，覆盖超类方法，增加遍历孩子
     * @package
     */
    _onScaleChanged_() {
        super._onScaleChanged_();

        this.children.forEach((child) => {
            child._onScaleChanged_();
        });
    }

    /**
     * 透明度改变时调用，覆盖超类方法，增加遍历孩子
     * @package
     */
    _onAlphaChanged_() {
        super._onAlphaChanged_();

        this.children.forEach((child) => {
            child._onAlphaChanged_();
        });
    }

    /**
     * 旋转时调用，覆盖超类方法，增加遍历孩子
     * @package
     */
    _onRotationChanged_() {
        super._onRotationChanged_();

        this.children.forEach((child) => {
            child._onRotationChanged_();
        });
    }

    /**
     * 可见性改变时调用，覆盖超类方法，增加遍历孩子
     * @package
     */
    _onVisibleChanged_() {
        super._onVisibleChanged_();

        this.children.forEach((child) => {
            child._onVisibleChanged_();
        });
    }

    /**
     * 原点改变时调用，覆盖超类方法，增加遍历孩子
     * @package
     */
    _onOriginChanged_() {
        super._onOriginChanged_();

        this.children.forEach((child) => {
            child._onOriginChanged_();
        });
    }

    /**
     * 尺寸改变时调用，覆盖超类方法，增加遍历孩子
     * @package
     */
    _onSizeChanged_() {
        super._onSizeChanged_();

        this.children.forEach((child) => {
            child._onParentSizeChanged();
        });
    }
}

export default DisplayObjectContainer;
