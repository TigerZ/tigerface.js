import { Utilities as T } from 'tigerface-common';
import { DomEventAdapter } from 'tigerface-event';
import DomSprite from './DomSprite';


/**
 * @extends DomSprite
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class DomCover extends DomSprite {
    constructor(options, dom) {
        super({
            clazzName: DomCover.name,
        }, dom);
        this.assign(T.merge({
            style: {
                visibility: 'hidden',
            },
        }, options));
        this.state.visible = false;
        // 定义 Dom 引擎
        this.domAdapter = new DomEventAdapter(this.dom, {
            preventDefault: true,
        }, this);
    }

    get isCover() {
        return true;
    }

    get visible() {
        return super.visible;
    }

    set visible(v) {
        this.logger.error('请使用 this.stage.showCover 方法');
    }
}

export default DomCover;
