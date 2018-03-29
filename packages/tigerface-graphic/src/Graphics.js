/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */

import Context from './Context';
import plugins from './plugins';

class Graphics extends Context {
    constructor(...args) {
        super(...args);
        Object.assign(this, plugins);
    }

    get canvas() {
        return this.context.canvas;
    }

    get devicePixelRatio() {
        return this.layer.devicePixelRatio;
    }

    flipH(height) {
        this.translate(0, height);
        this.scale(1, -1);
    }

    flip(width) {
        this.translate(width, 0);
        this.scale(-1, 1);
    }
}

export default Graphics;

