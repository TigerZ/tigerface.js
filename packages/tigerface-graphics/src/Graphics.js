/**
 * Tiger zhangyihu@gmail.com MIT Licensed.
 */
// eslint-disable-next-line import/no-unresolved
import plugins from 'RootPath/graphics.plugin';
import Context from './Context';
import methods from './methods';
import ColorPalette from './ColorPalette';

const EVENT_BEFORE_PAINT = 'EVENT_BEFORE_PAINT';

class Graphics extends Context {
    constructor(canvas, devicePixelRatio = 1) {
        super({
            clazzName: Graphics.name,
            canvas,
            devicePixelRatio,
        });

        this.assignWithAOP(methods);
        if (plugins) this.assignWithAOP(plugins);

        this._inPainting_ = false;

        this.colorPalettes = {};
    }

    addBefore(func) {
        this.addEventListener(EVENT_BEFORE_PAINT, func);
    }

    removeBefore(func) {
        this.removeEventListener(EVENT_BEFORE_PAINT, func);
    }

    assignWithAOP(obj) {
        Object.keys(obj).forEach((key) => {
            this[key] = this.aop(obj[key]);
        });
    }

    before() {
        this._inPainting_ = true;
        this.save();
        this.dispatchEvent(EVENT_BEFORE_PAINT);
    }

    after() {
        this._inPainting_ = false;
        this.restore();
    }

    aop(func) {
        return (...args) => {
            let myWork = false;

            if (!this._inPainting_) {
                this.before();
                myWork = true;
            }

            func.call(this, ...args);

            if (myWork) {
                this.after();
            }
        };
    }

    flipH(height) {
        this.translate(0, height);
        this.scale(1, -1);
    }

    flip(width) {
        this.translate(width, 0);
        this.scale(-1, 1);
    }

    createColorPalette(name, num, colors) {
        this.colorPalettes[name] = new ColorPalette(num, colors).data;
        return this.colorPalettes[name];
    }

    getColorPalette(name) {
        return this.colorPalettes[name];
    }
}

export default Graphics;

