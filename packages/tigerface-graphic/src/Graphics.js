/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */
// eslint-disable-next-line import/no-unresolved
import plugins from 'RootPath/graphics.plugin';
import Context from './Context';
import methods from './methods';

class Graphics extends Context {
    constructor(...args) {
        super(...args);
        Object.assign(this, methods);
        if (plugins) Object.assign(this, plugins);
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

