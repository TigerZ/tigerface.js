/* eslint-disable no-unused-vars,no-mixed-operators */
import React from 'react';
import { Sector, Line, Square } from 'tigerface-shape';
import { CanvasSprite } from 'tigerface-display';
import { withSimpleSpriteComponent } from 'tigerface-react';
import { Utilities as T } from 'tigerface-common';
import { ColorPalette } from 'tigerface-graphic';

/**
 * User: zyh
 * Date: 2018/3/11.
 * Time: 11:03.
 */

/**
 * 缺省配置
 * @type {{width: number, unitHeight: number, xSpace: number, ySpace: number, paddingTop: number, paddingLeft: number, font: string, speed: number, style: {margin: string}, colors: string[]}}
 * @private
 */
const _default = {
    width: 20,
    unitHeight: 8,
    xSpace: 5,
    ySpace: 5,
    paddingTop: 180,
    paddingLeft: 10,
    font: '12px monaco',
    speed: 3,
    cutline: true,
};

class PieChartSprite extends CanvasSprite {
    constructor(options) {
        super(options);
        this._data_ = [];
        this.h0 = 0;
        this._config_ = _default;
        this.clazzName = 'PieChartSprite';
    }

    update(options) {
        this.h0 = 0;
        super.update(options);
    }

    /**
     *
     * @param data [object]
     * @param options {object}
     */
    putData(data, options) {
        this.config = options;
        this.data = data;
    }

    set config(v) {
        T.merge(this._config_, v);
    }

    get config() {
        return this._config_;
    }

    set data(data) {
        this._data_ = [];
        const sum = data.reduce((a, b) => ({ num: a.num + b.num })).num;
        let count = 0;
        data.forEach(({ num, name }, idx) => {
            let percent = 0;
            if (idx === (data.length - 1)) {
                percent = 100 - count;
            } else {
                percent = Math.round(num / sum * 100);
                count += percent;
            }
            this._data_.push({ num, name, percent });
        });

        this.unitAngle = 360 / sum;
        this.colors = new ColorPalette(this._data_.length, {
            0: 'rgb(222,63,24)',
            0.3: 'rgb(254,212,90)',
            0.6: 'rgb(102,172,188)',
            0.9: 'rgb(161,240,158)',
            1.0: 'rgb(222,63,24)',
        }).colors;
    }

    get data() {
        return this._data_;
    }

    paint(g) {
        let finish = true;
        const shapes = [];
        let n = 0;
        const names = [];
        const count = 20;
        const p0 = { x: 175, y: 110 };
        const r = 4;

        // 生成图形
        for (; n < count; n += 1) {
            let last = 0;
            // eslint-disable-next-line no-loop-func
            this.data.forEach((item) => {
                const { num, name, percent } = item;
                const b = num * this.unitAngle;
                if (b > this.h0) finish = false;
                const b0 = Math.min(this.h0, b);

                shapes.push(new Sector(p0.x, p0.y - n, r * 16, r * 9, last, last + b0));

                if (n === count - 1) {
                    const c = last + Math.abs(b) / 2;
                    const p1 = {
                        x: Math.cos(T.degreeToRadian(c)) * (r + 1) * 16 + p0.x,
                        y: Math.sin(T.degreeToRadian(c)) * (r + 4) * 9 + p0.y - n + count / 2,
                    };
                    const p2 = {
                        x: Math.cos(T.degreeToRadian(c)) * r * 16 + p0.x,
                        y: Math.sin(T.degreeToRadian(c)) * r * 9 + p0.y - n,
                    };
                    names.push([p1, p2, name, num, percent]);
                }
                last += b;
            });
        }

        // 绘制饼图
        // g.drawPoint({x: 150, y: 120});
        const lineWidth = 1;
        shapes.forEach((pie, idx) => {
            const t = idx % this.data.length;

            const fillStyle = `rgb(${this.colors[t][0]},${this.colors[t][1]},${this.colors[t][2]})`;
            const strokeStyle = 'rgba(0,0,0,0.2)';

            g.drawPolygon(pie, {
                fillStyle,
                strokeStyle,
                lineWidth,
            });
        });

        if (finish) {
            // 绘制标签
            names.forEach(([p1, p2, name, num, percent], idx) => {
                const str = `${name}[${percent}%]`;

                const fillStyle = `rgb(${this.colors[idx][0]},${this.colors[idx][1]},${this.colors[idx][2]})`;
                const strokeStyle = fillStyle;

                const w = g.measureText(str).width + 10;

                let textAlign;
                if (p1.x < p0.x) {
                    textAlign = 'end';
                    g.drawLine(new Line(p1, { x: p1.x - w, y: p1.y }), { strokeStyle, fillStyle, lineWidth });
                } else {
                    textAlign = 'start';
                    g.drawLine(new Line(p1, { x: p1.x + w, y: p1.y }), { strokeStyle, fillStyle, lineWidth });
                }

                g.drawText(str, {
                    x: p1.x,
                    y: p1.y,
                    font: this.config.font,
                    textBaseline: 'bottom',
                    textAlign,
                    fillStyle,
                    // strokeStyle,
                });

                g.drawLine(new Line(p1, p2), { strokeStyle, fillStyle, lineWidth });
            });
        }

        if (this.config.cutline) {
            // 绘制图例
            names.forEach(([p1, p2, name, num], idx) => {
                const str = `${name} [${num}]`;

                const fillStyle = `rgb(${this.colors[idx][0]},${this.colors[idx][1]},${this.colors[idx][2]})`;
                const strokeStyle = 'rgba(0,0,0,0.2)';

                const { width: w } = g.measureText(str);
                const left = this.config.paddingLeft + idx % 3 * 90;
                const top = this.config.paddingTop + Math.floor(idx / 3) * 20;

                g.drawRectangle(new Square(left, top, 10), { fillStyle, strokeStyle });

                g.drawText(str, {
                    x: left + 10 + this.config.xSpace,
                    y: top,
                    font: this.config.font,
                    textBaseline: 'top',
                    textAlign: 'start',
                    fillStyle,
                    // strokeStyle,
                });
            });
        }

        this.h0 += this.config.speed;
        if (!finish) this.postChange();
    }
}

const pieChart = new PieChartSprite();

export const putData = (data, config) => {
    pieChart.putData(data, config);
};

export default withSimpleSpriteComponent(pieChart, {
    className: pieChart.config.className,
    style: pieChart.config.style,
});

