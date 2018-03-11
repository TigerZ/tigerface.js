/* eslint-disable no-unused-vars */
import React from 'react';
import {Sector, Rectangle} from "../../src/tigerface-shape";
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

        let offsets = [];
        let shapes = [];
        let fonts = [];
        let finish = true;
        let last = 0;
        this.data.forEach(a => {
            let b = a * this.unitAngle;
            if (b > this.h0) finish = false;
            let b0 = Math.min(this.h0, b);
            shapes.push(
                new Sector(150, 120, 100, 100, last, last + b0).scatter(10, 10)
            );
            last += b;
            // let c = last + Math.abs(b) / 2;
            // console.log("***********", b);
            // let x = Math.cos(T.degreeToRadian(c)) * 50;
            // let y = Math.sin(T.degreeToRadian(c)) * 50;
            // offsets.push({x, y});
        });
        // g.drawPoint({x: 150, y: 120});
        shapes.forEach((pie, idx) => {
            g.lineWidth = 1;
            g.strokeStyle = 'black'
            g.fillStyle = this.config.colors[idx < this.config.colors.length ? idx : this.config.colors.length - 1];
            g.strokeStyle = g.fillStyle;
            // g.save();
            // g.translate(offsets[idx].x, offsets[idx].y);
            g.drawPolygon(pie, g.DrawStyle.STROKE_FILL);

            // g.restore();
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