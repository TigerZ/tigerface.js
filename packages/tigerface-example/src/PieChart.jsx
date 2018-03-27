/* eslint-disable no-unused-vars,no-mixed-operators */
import React from 'react';
import { Sector, Line, Square } from 'tigerface-shape';
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
 * @type {{width: number, unitHeight: number, xSpace: number, ySpace: number, paddingTop: number, paddingLeft: number, font: string, speed: number, style: {margin: string}, colors: string[]}}
 * @private
 */
const _default = {
    width: 20,
    unitHeight: 8,
    xSpace: 5,
    ySpace: 5,
    paddingTop: 200,
    paddingLeft: 0,
    font: '12px monaco',
    speed: 3,
    style: {
        margin: '30px auto 0',
    },
    colors: ['red'],
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
    }

    get data() {
        return this._data_;
    }

    paint() {
        const g = this.graphics;

        let finish = true;
        const shapes = [];
        let n = 0;
        const names = [];
        const count = 20;
        const p0 = { x: 160, y: 100 };
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
        g.lineWidth = 1;
        shapes.forEach((pie, idx) => {
            const t = idx % this.data.length;

            g.fillStyle = this.config.colors[t < this.config.colors.length ? t : this.config.colors.length - 1];
            g.strokeStyle = 'rgba(0,0,0,0.2)';

            g.drawPolygon(pie, g.DrawStyle.STROKE_FILL);
        });

        if (finish) {
            // 绘制标签
            names.forEach(([p1, p2, name, num, percent], idx) => {
                const str = `${name}[${percent}%]`;
                g.lineWidth = 1;
                g.fillStyle = this.config.colors[idx < this.config.colors.length ? idx : this.config.colors.length - 1];
                g.strokeStyle = g.fillStyle;
                // g.drawPoint(p1);
                const w = g.measureText(str).width;
                if (p1.x < p0.x) {
                    g.textAlign = 'end';
                    g.drawLine(new Line(p1, { x: p1.x - w, y: p1.y }));
                } else {
                    g.textAlign = 'start';
                    g.drawLine(new Line(p1, { x: p1.x + w, y: p1.y }));
                }
                g.drawLine(new Line(p1, p2));
                g.textBaseline = 'bottom';
                g.drawText(str, p1, this.config.font, g.DrawStyle.FILL);
            });
        }
        // 绘制图例
        g.textBaseline = 'top';
        g.textAlign = 'start';
        names.forEach(([p1, p2, name, num], idx) => {
            const str = `${name} [${num}]`;
            g.lineWidth = 1;
            g.fillStyle = this.config.colors[idx < this.config.colors.length ? idx : this.config.colors.length - 1];
            g.strokeStyle = g.fillStyle;
            // g.drawPoint(p1);
            const { width: w } = g.measureText(str);
            const left = this.config.paddingLeft + idx % 4 * 90;
            const top = this.config.paddingTop + Math.floor(idx / 4) * 20;

            g.drawRectangle(new Square(left, top, 10), g.DrawStyle.STROKE_FILL);

            g.drawText(str, { x: left + 10 + this.config.xSpace, y: top }, this.config.font, g.DrawStyle.FILL);
        });

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

// 以下是演示数据

const colors = ['red', 'brown', 'blue', 'green', 'orange', 'olive', 'purple', 'deepskyblue', 'teal', 'maroon'];
const data = [
    { name: '何敏', num: 38 },
    { name: '王菲丽', num: 76 },
    { name: '张思雨', num: 25 },
    { name: '王明清', num: 48 },
    { name: '袁立', num: 22 },
    { name: '邢惠珊', num: 71 },
    { name: '李安和', num: 45 },
];

// putData(
//     data,
//     {
//         speed: 3,
//         font: '12px Kaiti',
//         colors
//     }
// );

