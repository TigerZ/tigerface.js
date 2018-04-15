import { Stage, CanvasLayer } from 'tigerface-display';
import { Utilities as T } from 'tigerface-common';
import EndPoint from './EndPoint';
import Link from './Link';

const stage = new Stage({
    width: 350,
    height: 200,
}, document.getElementById('net') || document.documentElement);

const surface = new CanvasLayer();

stage.addLayer(surface);

const endPoints = [];

for (let i = 0; i < 11; i += 1) {
    const endPoint = i === 0 ? new EndPoint(175, 100, true)
        : new EndPoint(T.random(250) + 50, T.random(150) + 50);
    endPoints.push(endPoint);
    endPoint.endPoints = endPoints;
    surface.addChild(endPoint);
}

const links = [];
for (let i = 1; i < endPoints.length; i += 1) {
    const endPoint = endPoints[i];
    links.push(new Link(endPoint, endPoints[0]));
    if (i < endPoints.length - 1) {
        links.push(new Link(endPoint, endPoints[i + 1]));
    } else {
        links.push(new Link(endPoint, endPoints[1]));
    }
}

surface.onRedraw = (e) => {
    const g = e.graphics;
    links.forEach((link) => {
        link.drawLine(g);
    });
};

endPoints[0].onClick = () => {
    for (let i = 1; i < 11; i += 1) {
        const endPoint = endPoints[i];
        endPoint.x = T.random(250) + 50;
        endPoint.y = T.random(150) + 50;
    }
}
