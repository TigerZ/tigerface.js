import DomSprite from './DomSprite';
import { Utilities as T } from "RootPath/packages/tigerface-common";

/**
 * Dom 层
 *
 * @extends DomSprite
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class DomLayer extends DomSprite {
    constructor(options, dom) {
        super({}, dom);
        this._layer_ = this;
        this.assign(options);
    }

    addChild(child) {
        super.addChild(child);
        child._appendToLayer_(this);
        return this;
    }
}

export default DomLayer;
