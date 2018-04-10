class ColorPalette {
    constructor(num = 256, colors = {
        0: 'rgb(255,0,0)',
        0.3: 'rgb(255,255,0)',
        0.6: 'rgb(0,255,255)',
        0.9: 'rgb(0,0,255)',
        1.0: 'rgb(255,0,0)',
    }) {
        const ctx = this._createOffscreenContext_(1, num);
        const grad = ctx.createLinearGradient(0, 0, 1, num);
        Object.keys(colors).forEach((x) => {
            grad.addColorStop(x, colors[x]);
        });
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1, num);
        const { data } = ctx.getImageData(0, 0, 1, num);
        this._colors = [];
        for (let i = 0; i < data.length; i += 4) {
            const color = [data[i], data[i + 1], data[i + 2], data[i + 3]];
            this._colors.push(color);
        }
    }

    get colors() {
        return this._colors;
    }

    _createOffscreenContext_(width, height) {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        return ctx;
    }
}

export default ColorPalette;
