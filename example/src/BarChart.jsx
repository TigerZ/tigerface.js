/* eslint-disable no-unused-vars */
import React from 'react';
import {Rectangle} from "../../src/tigerface-shape";
import {CanvasSprite} from "../../src/tigerface-display";
import {Stage, Tag} from 'tigerface-react';
import {Utilities as T} from 'tigerface-common';

/**
 * User: zyh
 * Date: 2018/3/11.
 * Time: 11:03.
 */
const _default = {
    paddingLeft: 50,
    paddingTop: 20,
    unit: 20,
    scale: 8,
    xSpace: 5,
    ySpace: 5,
    font: '12px monaco',
    speed: 3,
    style: {
        backgroundColor: 'white',
        border: '1px solid blue'
    }
};

const StageStyle = {
    backgroundColor: 'white'
};

class BarChartSprite extends CanvasSprite {
    constructor(options) {
        super(options);
        this.data = [];
        this.h0 = 0;
        this.config = _default;
    }

    putData(data, options) {
        this.data = data;
        T.merge(this.config, options);
    }

    paint() {
        let g = this.graphics;
        // g.flipH(this.height);

        let rects = [];
        let fonts = [];
        let finish = true;

        this.data.forEach(({name, num}, idx) => {
            let length = this.config.scale * num;
            if (length > this.h0) finish = false;
            // rects.push(
            //     new Rectangle(
            //         idx * (this.config.unit + this.config.xSpace) + this.config.xSpace,
            //         this.config.ySpace,
            //         this.config.width,
            //         Math.min(this.h0, length)
            //     )
            // );
            rects.push(
                [
                    new Rectangle(
                        this.config.xSpace + this.config.paddingLeft,
                        idx * (this.config.unit + this.config.ySpace) + this.config.ySpace + this.config.paddingTop,
                        Math.min(this.h0, length),
                        this.config.unit
                    ),
                    name,
                    num
                ]
            );
        });

        g.textBaseline = 'middle';

        rects.forEach(([bar, name, num], idx) => {
            g.lineWidth = 1;
            // g.fillStyle = 'rgba(0,0,255,0.5)';
            // g.strokeStyle = 'rgba(0,0,255,0.8)';
            g.fillStyle = this.config.colors[idx < this.config.colors.length ? idx : this.config.colors.length - 1];
            g.strokeStyle = g.fillStyle;

            g.textAlign = 'right';
            g.drawText(name, {
                x: this.config.paddingLeft,
                y: bar.top + this.config.unit / 2
            }, this.config.font, g.DrawStyle.FILL);

            g.drawRectangle(bar,
                g.DrawStyle.STROKE_FILL);
            g.lineWidth = 2;
            // g.save();
            // g.flipH(this.height);
            g.textAlign = 'left';
            g.drawText(num, {
                x: bar.left + bar.width + this.config.xSpace * 2,
                y: bar.top + this.config.unit / 2
            }, this.config.font, g.DrawStyle.FILL);
            // g.restore();
        });

        this.h0 += this.config.speed;
        if (!finish) this.postChange();
    }
}

const barChart = new BarChartSprite();

export const putData = (data, config) => {
    barChart.putData(data, config);
};


export default class BarChart extends React.Component {
    constructor() {
        super(...arguments);
    }

    render() {
        const props = this.props;
        return (
            <div {...props}>
                <Stage style={StageStyle}>
                    <Tag.Dom>
                        <Tag.Surface title={'Surface'} style={barChart.config.style}>
                            <Tag.Sprite instance={barChart}/>
                        </Tag.Surface>
                    </Tag.Dom>
                </Stage>
            </div>
        )
    }
}