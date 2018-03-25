import DomSprite from './DomSprite';

/**
 * @extends DomSprite
 * @author 张翼虎 <zhangyihu@gmail.com>
 * @memberof module:tigerface-display
 */
class DomCover extends DomSprite {
    constructor(options) {
        super({
            clazzName: DomCover.name,
        });
        this.assign(options);
    }

    get isCover() {
        return true;
    }
}

export default DomCover;
