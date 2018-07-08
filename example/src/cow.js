import { Stage, CanvasLayer, CanvasSprite } from 'tigerface-display';

const stage = new Stage({
    width: 350,
    height: 200,
    fps: 16,
}, document.getElementById('cow') || document.documentElement);

const cow = new CanvasSprite();
const cowimg = new Image();
cowimg.src = './img/left.png';
cowimg.onload = () => {
    cow.postChange();
};

const width = 158;
const height = 110;

let num = 0;
let x = 100;
let y = 50;

cow.onRedraw = (e) => {
    const g = e.graphics;
    const left = num % 3;
    const top = Math.floor(num / 3);

    g.drawImageObj(cowimg, {
        pos: { x, y },
        size: { width, height },
        clip: { x: left * width, y: top * height, width, height },
    });
};

cow.onEnterFrame = () => {
    num += 1;
    if (num === 24) num = 0;
    cow.postChange();
};

stage.addLayer(new CanvasLayer().addChild(cow));
