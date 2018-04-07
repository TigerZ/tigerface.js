/* eslint-disable no-unused-vars */
import React from 'react';
import { Rectangle, Square } from 'tigerface-shape';
import { CanvasSprite } from 'tigerface-display';
import { withSimpleSpriteComponent } from 'tigerface-react';
import { Utilities as T } from 'tigerface-common';

/**
 * User: zyh
 * Date: 2018/3/11.
 * Time: 11:03.
 */

/**
 * 缺省配置
 * @type {{paddingLeft: number, paddingTop: number, unit: number, scale: number, xSpace: number, ySpace: number, font: string, speed: number, style: {margin: string}}}
 * @private
 */
const _default = {
    paddingLeft: 60,
    paddingTop: 10,
    unit: 15,
    scale: 2,
    xSpace: 5,
    ySpace: 5,
    font: '12px monaco',
    speed: 3,
};

class BarChartSprite extends CanvasSprite {
    constructor(options) {
        super(options);
        this._data_ = [];
        this.h0 = 0;
        this._config_ = _default;
        this.clazzName = 'BarChartSprite';
        this.name = 'BarChart';
    }

    putData(data, options) {
        this.data = data;
        this.config = options;
    }

    set config(v) {
        T.merge(this._config_, v);
    }

    get config() {
        return this._config_;
    }

    set data(v) {
        this._data_ = v;
    }

    get data() {
        return this._data_;
    }

    update(options) {
        this.h0 = 0;
        super.update(options);
    }

    paint(g) {
        // g.flipH(this.height);

        const rects = [];
        const fonts = [];
        let finish = true;

        this.data.forEach(({ name, num }, idx) => {
            const length = this.config.scale * num;
            if (length > this.h0) finish = false;

            rects.push([
                new Rectangle(
                    this.config.xSpace + this.config.paddingLeft,
                    ((idx * (this.config.unit + this.config.ySpace)) + this.config.ySpace) + this.config.paddingTop,
                    Math.min(this.h0, length),
                    this.config.unit,
                ),
                name,
                num,
            ]);
        });

        const textBaseline = 'middle';

        rects.forEach(([bar, name, num], idx) => {
            g.lineWidth = 1;

            const fillStyle = this.config.colors[idx < this.config.colors.length ? idx : this.config.colors.length - 1];

            g.drawText(name, {
                x: this.config.paddingLeft,
                y: bar.top + (this.config.unit / 2),
                font: this.config.font,
                textAlign: 'end',
                fillStyle,
                textBaseline,
            });

            g.drawRectangle(
                bar,
                { fillStyle },
            );

            g.drawText(num, {
                x: bar.left + (bar.width + (this.config.xSpace * 2)),
                y: bar.top + (this.config.unit / 2),
                font: this.config.font,
                textAlign: 'start',
                textBaseline,
                fillStyle,
            });
        });

        // 绘制图例
        g.textBaseline = 'top';
        g.textAlign = 'start';
        rects.forEach(([bar, name, num], idx) => {
            const str = `${name} [${num}]`;
            g.lineWidth = 1;
            const fillStyle = this.config.colors[idx < this.config.colors.length ? idx : this.config.colors.length - 1];
            const strokeStyle = fillStyle;
            // g.drawPoint(p1);
            const { width: w } = g.measureText(str);
            const left = this.config.paddingTop + ((idx % 3) * 90);
            const top = 180 + (Math.floor(idx / 3) * 20);

            g.drawRectangle(new Square(left, top, 10), { fillStyle });

            g.drawText(str, {
                x: left + 10 + this.config.xSpace,
                y: top,
                font: this.config.font,
                textBaseline: 'top',
                fillStyle,
            });
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
    style: barChart.config.style,
});

// 以下是演示数据
