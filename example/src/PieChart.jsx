/* eslint-disable no-unused-vars */
import React from 'react';
import {Sector, Line} from "../../src/tigerface-shape";
import {CanvasSprite} from "../../src/tigerface-display";
import {Stage, Tag} from 'tigerface-react';
import {Utilities as T} from 'tigerface-common';

/**
 * User: zyh
 * Date: 2018/3/11.
 * Time: 11:03.
 */
const _default = {
    width: 20,
    unitHeight: 8,
    xSpace: 5,
    ySpace: 5,
    font: '12px monaco',
    speed: 3,
    style: {
        backgroundColor: 'white',
        border: '1px solid blue'
    },
    colors: ['red']
};

const StageStyle = {
    backgroundColor: 'white'
};

class PieChartSprite extends CanvasSprite {
    constructor(options) {
        super(options);
        this.data = [];
        this.h0 = 0;
        this.config = _default;
    }

    putData(data, options) {
        this.data = data;
        T.merge(this.config, options);
        let sum = this.data.reduce((a, b) => {
            return a + b;
        });

        this.unitAngle = 360 / sum;
    }

    paint() {
        let g = this.graphics;

        g.save();
        // g.flipH(this.height);

        let finish = true;
        let shapes = [];
        let n = 0;
        let names = [];
        let count = 20;
        let p0 = {x: 160, y: 120};

        for (; n < count; n++) {
            let last = 0;
            this.data.forEach((a) => {
                let b = a * this.unitAngle;
                if (b > this.h0) finish = false;
                let b0 = Math.min(this.h0, b);
                shapes.push(
                    new Sector(p0.x, p0.y - n, 80, 45, last, last + b0)
                );

                if (n === count - 1) {
                    let c = last + Math.abs(b) / 2;
                    // console.log("***********", b);
                    let p1 = {
                        x: Math.cos(T.degreeToRadian(c)) * 16 * 8 + p0.x,
                        y: Math.sin(T.degreeToRadian(c)) * 9 * 8 + p0.y - n + 10
                    };
                    let p2 = {
                        x: Math.cos(T.degreeToRadian(c)) * 80 + p0.x,
                        y: Math.sin(T.degreeToRadian(c)) * 45 + p0.y - n
                    };
                    names.push([p1, p2]);
                }

                last += b;
            });
        }

        // g.drawPoint({x: 150, y: 120});
        g.lineWidth = 1;
        shapes.forEach((pie, idx) => {
            //g.save();
            let t = idx % this.data.length;
            // console.log(t);
            g.fillStyle = this.config.colors[t < this.config.colors.length ? t : this.config.colors.length - 1];
            g.strokeStyle = 'rgba(0,0,0,0.2)';
            //
            // g.translate(offsets[idx].x, offsets[idx].y);
            g.drawPolygon(pie, g.DrawStyle.STROKE_FILL);
            //g.restore();
        });

        // g.save();
        if (!finish) g.globalAlpha = 0;
        names.forEach(([p1, p2], idx) => {
            g.lineWidth = 1;
            g.fillStyle = this.config.colors[idx < this.config.colors.length ? idx : this.config.colors.length - 1];
            g.strokeStyle = g.fillStyle;
            // g.drawPoint(p1);
            if (p1.x < p0.x) {
                g.textAlign = 'end';
                g.drawLine(new Line(p1, {x: p1.x - 30, y: p1.y}))
            }
            else {
                g.textAlign = 'start';
                g.drawLine(new Line(p1, {x: p1.x + 30, y: p1.y}))
            }
            g.drawLine(new Line(p1, p2));
            g.textBaseline = 'bottom';
            g.drawText(this.data[idx], p1, this.config.font, g.DrawStyle.FILL);

        });
        g.restore();


        this.h0 += this.config.speed;
        if (!finish) this.postChange();
    }
}

const pieChart = new PieChartSprite();

export const putData = (data, config) => {
    pieChart.putData(data, config);
};


export default class PieChart extends React.Component {
    constructor() {
        super(...arguments);
    }

    render() {
        const props = this.props;
        return (
            <div {...props}>
                <Stage style={StageStyle}>
                    <Tag.Dom>
                        <Tag.Surface title={'Surface'} style={pieChart.config.style}>
                            <Tag.Sprite instance={pieChart}/>
                        </Tag.Surface>
                    </Tag.Dom>
                </Stage>
            </div>
        )
    }
}