import DomSprite from './DomSprite';

/**
 * Dom 层
 *
 * @extends DomSprite
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class DomLayer extends DomSprite {
    constructor(options = undefined, dom = undefined) {
        super({}, dom);
        this.layer = this;
        this.assign(options);
    }
}

export default DomLayer;
