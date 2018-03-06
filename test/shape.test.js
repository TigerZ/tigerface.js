const assert = require('assert');
import Canvas from 'canvas';
import {Shape, Circle, Polygon, Ellipse, Triangle, Square} from 'tigerface-shape';
import {Graphics} from 'tigerface-graphic';
import {Utilities as T} from 'tigerface-common';

const fs = require('fs');


function paintToFile(g, filename) {
    let out = fs.createWriteStream(`${__dirname}/png/${filename}.png`);
    let stream = g.context.canvas.pngStream();


    stream.on('data', function (chunk) {
        out.write(chunk);
    });

    stream.on('end', function () {
        console.log('saved png');
    });
}

describe('测试 Shape', () => {
    describe('圆形 Circle', () => {

        let c1 = new Circle(0, 0, 50);


        it('绘制正常', () => {
            let g = new Graphics();
            g.strokeStyle = '#D40000';
            g.fillStyle = '#D40000';
            g.lineWidth = 1;
            g.globalAlpha = 0.5;

            assert.deepEqual(c1.className, 'Circle');
            c1 = c1.rotate(0, {x: 300, y: 200});
            g.drawCircle(c1, Graphics.DrawStyle.STROKE_FILL);
            c1 = c1.move(200, 100);
            g.drawCircle(c1, Graphics.DrawStyle.STROKE_FILL);
            c1 = c1.scale(2, 2);
            g.drawCircle(c1, Graphics.DrawStyle.STROKE_FILL);
            c1 = c1.clone();

            g.drawRectangle(c1.getBoundingRect(), Graphics.DrawStyle.STROKE);

            paintToFile(g, 'circle');

        });
    });
    describe('多边形 Polygon', () => {

        let c1 = new Polygon([{x: 0, y: 0}, {x: 12, y: 2}, {x: 20, y: 4}, {x: 30, y: 12}, {x: 35, y: 25}, {
            x: 20,
            y: 35
        }, {x: 15, y: 30}, {x: 12, y: 20}]);


        it('绘制正常', () => {
            let g = new Graphics();
            g.strokeStyle = '#D40000';
            g.fillStyle = '#D40000';
            g.lineWidth = 1;
            g.globalAlpha = 0.5;

            assert.deepEqual(c1.className, 'Polygon');
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            c1 = c1.clone();
            c1 = c1.move(200, 100);
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            c1 = c1.rotate(T.degreeToRadian(180), {x: 200, y: 100});
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            c1 = c1.scale(2, 2);
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            g.drawRectangle(c1.getBoundingRect(), Graphics.DrawStyle.STROKE);

            paintToFile(g, 'polygon');

        });
    });

    describe('椭圆 Ellipse', () => {

        let c1 = new Ellipse(0, 0, 100, 50);


        it('绘制正常', () => {
            let g = new Graphics();
            g.strokeStyle = '#D40000';
            g.fillStyle = '#D40000';
            g.lineWidth = 1;
            g.globalAlpha = 0.5;

            assert.deepEqual(c1.className, 'Ellipse');
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            c1 = c1.clone();
            c1 = c1.move(200, 100);
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            c1 = c1.rotate(T.degreeToRadian(90), {x: 200, y: 100});
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            c1 = c1.scale(2, 2);
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            g.drawRectangle(c1.getBoundingRect(), Graphics.DrawStyle.STROKE);

            paintToFile(g, 'ellipse');

        });
    });

    describe('三角形 Triangle', () => {

        let c1 = new Triangle(0, 0, 100, 100, 60);


        it('绘制正常', () => {
            let g = new Graphics();
            g.strokeStyle = '#D40000';
            g.fillStyle = '#D40000';
            g.lineWidth = 1;
            g.globalAlpha = 0.5;

            assert.deepEqual(c1.className, 'Triangle');
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            c1 = c1.clone();
            c1 = c1.move(100, 100);
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);
            g.drawRectangle(c1.getBoundingRect(), Graphics.DrawStyle.STROKE);

            c1 = c1.rotate(T.degreeToRadian(90), {x: 100, y: 100});
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);
            g.drawRectangle(c1.getBoundingRect(), Graphics.DrawStyle.STROKE);

            c1 = c1.scale(2, 2);
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            g.drawRectangle(c1.getBoundingRect(), Graphics.DrawStyle.STROKE);

            paintToFile(g, 'triangle');

        });
    });

    describe('正方形 Square', () => {

        let c1 = new Square(0, 0, 100);


        it('绘制正常', () => {
            let g = new Graphics();
            g.strokeStyle = '#D40000';
            g.fillStyle = '#D40000';
            g.lineWidth = 1;
            g.globalAlpha = 0.5;

            assert.deepEqual(c1.className, 'Square');
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            c1 = c1.clone();
            c1 = c1.move(100, 100);
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);
            g.drawRectangle(c1.getBoundingRect(), Graphics.DrawStyle.STROKE);

            c1 = c1.rotate(T.degreeToRadian(30), {x: 100, y: 100});
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);
            g.drawRectangle(c1.getBoundingRect(), Graphics.DrawStyle.STROKE);

            c1 = c1.scale(2, 2);
            g.drawPolygon(c1, Graphics.DrawStyle.STROKE_FILL);

            g.drawRectangle(c1.getBoundingRect(), Graphics.DrawStyle.STROKE);

            paintToFile(g, 'square');

        });
    });

});