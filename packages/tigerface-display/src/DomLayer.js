/**
 * User: zyh
 * Date: 2018/3/21.
 * Time: 07:59.
 */

import DomSprite from './DomSprite';

export default class DomLayer extends DomSprite {
    constructor(options = undefined, dom = undefined) {
        super({}, dom);
        this.layer = this;
        this.assign(options)
    }
}