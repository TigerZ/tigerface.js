/* eslint-disable no-unused-vars */
import React from 'react';
import {Rectangle, Square} from "tigerface-shape";
import {CanvasSprite} from "tigerface-display";
import {withSimpleSpriteComponent} from 'tigerface-react';
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
    scale: 3,
    xSpace: 5,
    ySpace: 5,
    font: '12px monaco',
    speed: 3,
    className: 'surface',
    style: {
        border: '1px solid blue'
    }
};

class BarChartSprite extends CanvasSprite {
    constructor(options) {
        super(options);
        this.data = [];
        this.h0 = 0;
        this.config = _default;
        this.clazz = 'BarChartSprite';
        this.name = 'BarChart';
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

        // 绘制图例
        rects.forEach(([bar, name, num], idx) => {
            let str = `${name} [${num}]`;
            g.lineWidth = 1;
            g.fillStyle = this.config.colors[idx < this.config.colors.length ? idx : this.config.colors.length - 1];
            g.strokeStyle = g.fillStyle;
            // g.drawPoint(p1);
            let {width: w} = g.measureText(str);
            let left = 30 + idx % 4 * 90;
            let top = 230 + Math.floor(idx / 4) * 20;

            g.drawRectangle(new Square(left, top, 10), g.DrawStyle.STROKE_FILL);
            g.textBaseline = 'top';
            g.drawText(str, {x: left + 10 + this.config.xSpace, y: top}, this.config.font, g.DrawStyle.FILL);

        });

        this.h0 += this.config.speed;
        if (!finish) this.postChange();
    }
}

const barChart = new BarChartSprite();

export const putData = (data, config) => {
    barChart.putData(data, config);
};

export default withSimpleSpriteComponent(barChart, {
    className: barChart.config.className,
    style: barChart.config.style
});