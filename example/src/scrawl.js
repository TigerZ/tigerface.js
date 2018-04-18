import { Stage, CanvasLayer, CanvasSprite, DomLayer, DomSprite } from 'tigerface-display';
import { Curve } from 'tigerface-shape';
import { ColorPalette } from 'tigerface-graphics';

let strokes = [];
let points = [];

const data = [
    [{ x: 59, y: 66 }, { x: 55, y: 110 }, { x: 53, y: 125 }, { x: 51, y: 139 }, { x: 51, y: 148 }, { x: 51, y: 155 }],
    [{ x: 62, y: 108 }, { x: 67, y: 108 }, { x: 73, y: 106 }, { x: 80, y: 104 }, { x: 88, y: 102 }, { x: 95, y: 99 }],
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
    }, { x: 289, y: 91 }, { x: 287, y: 85 }, { x: 282, y: 83 }, { x: 272, y: 83 }, { x: 266, y: 90 }, { x: 262, y: 99 }]
];

data.forEach((ps) => {
    strokes.push(new Curve(ps));
});

const num = 12;

const { colors } = new ColorPalette(num);

const stage = new Stage({
    width: 350,
    height: 200,
}, document.getElementById('scrawl') || document.documentElement);

const bg = new CanvasSprite({
    width: 350,
    height: 200,
});

bg.onRedraw = (e) => {
    const g = e.graphics;
    strokes.forEach((stroke, i) => {
        const idx = i % num;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        g.drawCurve(stroke, {
            strokeStyle: `rgba(${colors[idx][0]},${colors[idx][1]},${colors[idx][2]},1)`,
            lineWidth: 5,
        });
    });
};

const fg = new CanvasSprite({
    width: 350,
    height: 200,
});

let drawing = false;

fg.onMouseDown = () => {
    drawing = true;
};

fg.onMouseUp = () => {
    drawing = false;
    const last = points;
    points = [];
    fg.postChange();
    if (last.length > 2) {
        strokes.push(new Curve(last));
        bg.postChange();
    } else if (last.length === 1) {
        strokes.push(new Curve([last[0], last[0]]));
        bg.postChange();
    }
};

const savePoint = (e) => {
    if (drawing) {
        points.push(e.pos);
        fg.postChange();
    }
};

fg.onMouseDown = savePoint;

fg.onMouseMove = savePoint;

fg.onRedraw = (e) => {
    const g = e.graphics;
    if (points.length > 2) {
        const idx = strokes.length % num;
        g.lineCap = 'round';
        g.lineJoin = 'round';
        const curve = new Curve(points);
        g.drawCurve(curve, {
            strokeStyle: `rgba(${colors[idx][0]},${colors[idx][1]},${colors[idx][2]},1)`,
            lineWidth: 5,
        });
    }
};

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
    strokes = [];
    points = [];
    bg.postChange();
    fg.postChange();
};

stage.addLayer(new CanvasLayer().addChild(bg));
stage.addLayer(new CanvasLayer().addChild(fg));
stage.addLayer(new DomLayer({
    width: 350,
    height: 200,
}).addChild(clear));
