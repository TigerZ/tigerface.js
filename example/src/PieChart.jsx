/* eslint-disable no-unused-vars */
import React from 'react';
import {Sector, Line, Square} from "tigerface-shape";
import {CanvasSprite} from "tigerface-display";
import {withSimpleSpriteComponent} from 'tigerface-react';
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
    paddingTop: 20,
    paddingLeft: 50,
    font: '12px monaco',
    speed: 3,
    style: {
        backgroundColor: 'white',
        border: '1px solid blue',
        width: '100%'
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
        this.className = 'PieChartSprite';
    }

    /**
     *
     * @param data [object]
     * @param options {object}
     */
    putData(data, options) {
        T.merge(this.config, options);
        let sum = data.reduce((a, b) => {
            return {num: a.num + b.num};
        }).num;
        let count = 0;
        data.forEach(({num, name}, idx) => {
            let percent = 0
            if (idx === (data.length - 1)) {
                percent = 100 - count;
                // console.log("*******", percent, count);
            }
            else {
                percent = Math.round(num / sum * 100);
                count += percent;
                // console.log("*******", num / sum, percent);
            }
            this.data.push({num, name, percent});
        });

        this.unitAngle = 360 / sum;
    }

    paint() {
        let g = this.graphics;

        let finish = true;
        let shapes = [];
        let n = 0;
        let names = [];
        let count = 20;
        let p0 = {x: 200, y: 130};
        let r = 4;

        // 生成图形
        for (; n < count; n++) {
            let last = 0;
            this.data.forEach(({num, name, percent}) => {
                let b = num * this.unitAngle;
                if (b > this.h0) finish = false;
                let b0 = Math.min(this.h0, b);

                shapes.push(
                    new Sector(p0.x, p0.y - n, r * 16, r * 9, last, last + b0)
                );

                if (n === count - 1) {
                    let c = last + Math.abs(b) / 2;
                    let p1 = {
                        x: Math.cos(T.degreeToRadian(c)) * (r + 1) * 16 + p0.x,
                        y: Math.sin(T.degreeToRadian(c)) * (r + 3) * 9 + p0.y - n + count / 2
                    };
                    let p2 = {
                        x: Math.cos(T.degreeToRadian(c)) * r * 16 + p0.x,
                        y: Math.sin(T.degreeToRadian(c)) * r * 9 + p0.y - n
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
            let t = idx % this.data.length;

            g.fillStyle = this.config.colors[t < this.config.colors.length ? t : this.config.colors.length - 1];
            g.strokeStyle = 'rgba(0,0,0,0.2)';

            g.drawPolygon(pie, g.DrawStyle.STROKE_FILL);
        });


        // g.save();
        if (finish) {
            // 绘制标签
            names.forEach(([p1, p2, name, num, percent], idx) => {
                let str = `${name}[${percent}%]`;
                g.lineWidth = 1;
                g.fillStyle = this.config.colors[idx < this.config.colors.length ? idx : this.config.colors.length - 1];
                g.strokeStyle = g.fillStyle;
                // g.drawPoint(p1);
                let w = g.measureText(str).width;
                if (p1.x < p0.x) {
                    g.textAlign = 'end';
                    g.drawLine(new Line(p1, {x: p1.x - w, y: p1.y}))
                }
                else {
                    g.textAlign = 'start';
                    g.drawLine(new Line(p1, {x: p1.x + w, y: p1.y}))
                }
                g.drawLine(new Line(p1, p2));
                g.textBaseline = 'bottom';
                g.drawText(str, p1, this.config.font, g.DrawStyle.FILL);

            });


        }

        // 绘制图例
        names.forEach(([p1, p2, name, num], idx) => {
            let str = `${name} [${num}]`;
            g.lineWidth = 1;
            g.fillStyle = this.config.colors[idx < this.config.colors.length ? idx : this.config.colors.length - 1];
            g.strokeStyle = g.fillStyle;
            // g.drawPoint(p1);
            let {width: w} = g.measureText(str);
            let left = 30 + idx % 4 * 90;
            let top = this.height - 10 + Math.floor(idx / 4) * 20;

            g.drawRectangle(new Square(left, top, 10), g.DrawStyle.STROKE_FILL);
            g.textBaseline = 'top';
            g.drawText(str, {x: left + 10 + this.config.xSpace, y: top}, this.config.font, g.DrawStyle.FILL);

        });


        this.h0 += this.config.speed;
        if (!finish) this.postChange();
    }
}

const pieChart = new PieChartSprite();

export const putData = (data, config) => {
    pieChart.putData(data, config);
};

export default withSimpleSpriteComponent(pieChart, pieChart.config.style);