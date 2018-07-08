import { Stage, CanvasLayer, CanvasSprite, DomLayer, DomSprite } from 'tigerface-display';
import { Line } from 'tigerface-shape';
import { ColorPalette } from 'tigerface-graphics';
import { Utilities as T } from 'tigerface-common';

const num = 12;
const brushWidth = 10;

const { colors } = new ColorPalette(num);

const stage = new Stage({
    width: 350,
    height: 200,
}, document.getElementById('scrawl') || document.documentElement);

const brushes = document.createElement('CANVAS');

function setColor(color) {
    const ctx = brushes.getContext('2d');
    const imgData = ctx.getImageData(0, 0, brushes.width, brushes.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i + 3] > 0) {
            imgData.data[i] = color[0];
            imgData.data[i + 1] = color[1];
            imgData.data[i + 2] = color[2];
        }
    }
    ctx.clearRect(0, 0, brushes.height, brushes.height);

    ctx.putImageData(imgData, 0, 0);
}

let points = [];
let strokes = [];
// let p0, p1, p2, p3;
let last = 0;
let drawing = false;

const sprite = new CanvasSprite({
    width: 350,
    height: 200,
});

sprite.onRedraw = (e) => {
    const g = e.graphics;
    for (; last < strokes.length; last += 1) {
        const r = T.random(36) - 1;
        const x = r % 6;
        const y = Math.floor(r / 6);
        g.drawImageObj(brushes,
            {
                pos: { x: strokes[last].x - brushWidth / 2, y: strokes[last].y - brushWidth / 2 },
                size: { width: brushWidth, height: brushWidth },
                clip: { x: x * 25, y: y * 25, width: 25, height: 25 },
            }
        );
    }
};

function startStroke() {
    points = [];
    setColor(colors[T.random(12) - 1]);
}

function addPoint(p) {
    points.push(p);
    const p0 = points[Math.max(0, points.length - 4)];
    const p1 = points[Math.max(0, points.length - 3)];
    const p2 = points[Math.max(0, points.length - 2)];
    const p3 = points[points.length - 1];

    const step = Math.min(0.01, (1 / T.distance(p1, p2)) * 0.1);

    for (let u = 0.0; u < 1.0; u += step) {
        const v = T.interpolatedPosition(p0, p1, p2, p3, u);
        if (strokes.length === 0 || T.distance(strokes[strokes.length - 1], v) > 1) {
            strokes.push(v);
        }
    }

    sprite.postChange();
}

sprite.onMouseDown = (e) => {
    startStroke();
    drawing = true;
    addPoint(e.pos);
};

sprite.onMouseMove = (e) => {
    if (drawing) {
        addPoint(e.pos);
    }
};

sprite.onMouseUp = (e) => {
    drawing = false;
};

const surface = new CanvasLayer({ autoClear: false });
stage.addLayer(surface.addChild(sprite));

const clear = new DomSprite({
    x: 320,
    y: 170,
    width: 20,
    height: 20,
    style: {
        backgroundColor: 'white',
        border: '1px solid',
    },
});

clear.onClick = () => {
    surface.clear();
};

stage.addLayer(new DomLayer({
    width: 350,
    height: 200,
}).addChild(clear));

function hello() {
    const data = [
        [{ x: 59, y: 66 }, { x: 55, y: 110 }, { x: 53, y: 125 }, { x: 51, y: 139 }, { x: 51, y: 148 }, {
            x: 51,
            y: 155
        }],
        [{ x: 62, y: 108 }, { x: 67, y: 108 }, { x: 73, y: 106 }, { x: 80, y: 104 }, { x: 88, y: 102 }, {
            x: 95,
            y: 99
        }],
        [{ x: 107, y: 44 }, { x: 107, y: 49 }, { x: 107, y: 57 }, { x: 107, y: 68 }, { x: 107, y: 80 }, {
            x: 107,
            y: 92
        }, { x: 106, y: 104 }, { x: 106, y: 116 }, { x: 106, y: 127 }, { x: 106, y: 137 }, { x: 105, y: 144 }, {
            x: 105,
            y: 148
        }],
        [{ x: 127, y: 133 }, { x: 134, y: 133 }, { x: 141, y: 131 }, { x: 148, y: 125 }, { x: 154, y: 120 }, {
            x: 157,
            y: 113
        }, { x: 158, y: 105 }, { x: 158, y: 99 }, { x: 158, y: 95 }, { x: 153, y: 93 }, { x: 146, y: 93 }, {
            x: 138,
            y: 98
        }, { x: 132, y: 106 }, { x: 128, y: 115 }, { x: 126, y: 121 }, { x: 126, y: 127 }, { x: 127, y: 132 }, {
            x: 133,
            y: 137
        }, { x: 140, y: 138 }, { x: 148, y: 139 }, { x: 157, y: 139 }, { x: 165, y: 139 }, { x: 172, y: 138 }],
        [{ x: 191, y: 50 }, { x: 191, y: 66 }, { x: 191, y: 81 }, { x: 190, y: 97 }, { x: 190, y: 109 }, {
            x: 190,
            y: 118
        }, { x: 192, y: 124 }, { x: 196, y: 127 }, { x: 203, y: 127 }],
        [{ x: 225, y: 47 }, { x: 225, y: 57 }, { x: 225, y: 72 }, { x: 225, y: 87 }, { x: 225, y: 101 }, {
            x: 226,
            y: 112
        }, { x: 228, y: 123 }, { x: 232, y: 131 }, { x: 238, y: 136 }, { x: 247, y: 138 }],
        [{ x: 264, y: 88 }, { x: 262, y: 96 }, { x: 260, y: 106 }, { x: 260, y: 116 }, { x: 260, y: 124 }, {
            x: 263,
            y: 129
        }, { x: 268, y: 133 }, { x: 274, y: 133 }, { x: 280, y: 132 }, { x: 285, y: 125 }, { x: 289, y: 115 }, {
            x: 289,
            y: 103
        }, { x: 289, y: 91 }, { x: 287, y: 85 }, { x: 282, y: 83 }, { x: 272, y: 83 }, { x: 266, y: 90 }, {
            x: 262,
            y: 99
        }],
    ];

    data.forEach((stroke) => {
        startStroke();
        setColor(colors[3]);
        stroke.forEach((p) => {
            addPoint(p);
        });
    });
}

const texture = new Image();
texture.src = './img/watercolor25.png';
texture.onload = function () {
    brushes.width = texture.width * 6;
    brushes.height = texture.height * 6;

    const ctx = brushes.getContext('2d');
    // ctx.globalAlpha = 0.5;

    for (let i = 0; i < 36; i += 1) {
        ctx.save();
        const x = i % 6;
        const y = Math.floor(i / 6);
        ctx.translate(x * 25 + 13, y * 25 + 13);
        ctx.rotate(T.degreeToRadian(i * 10));
        ctx.drawImage(texture, -13, -13);
        ctx.restore();
    }


    hello();
};