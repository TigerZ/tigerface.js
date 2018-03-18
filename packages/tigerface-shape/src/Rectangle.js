/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:02.
 */
import Point from './Point';
import Polygon from './Polygon';
import {Utilities as T} from 'tigerface-common';

/**
 * 矩形
 *
 * @type {*|void}
 */
export default class Rectangle extends Polygon {
    static isRectangle = function (points) {
        return points.length === 4 && points[0].getDistance(points[1]) === points[2].getDistance(points[3])
            && points[0].getDistance(points[2]) === points[1].getDistance(points[3])
            && points[0].getDistance(points[3]) === points[1].getDistance(points[2]);
    };
    
    constructor(left, top, width, height) {
        super();
        if (arguments.length === 1 && T.isArray(left)) {
            this.left = Math.min(left[0].x, left[1].x, left[2].x, left[3].x);
            this.top = Math.min(left[0].y, left[1].y, left[2].y, left[3].y);
            this.right = Math.max(left[0].x, left[1].x, left[2].x, left[3].x);
            this.bottom = Math.max(left[0].y, left[1].y, left[2].y, left[3].y);
            this.width = this.right - this.left;
            this.height = this.bottom - this.top;
        } else {
            this.left = left;
            this.top = top;
            this.width = width;
            this.height = height;
            this.right = this.left + this.width;
            this.bottom = this.top + this.height;
        }


        let points = [
            new Point(this.left, this.top),
            new Point(this.right, this.top),
            new Point(this.right, this.bottom),
            new Point(this.left, this.bottom)
        ];

        this.initPolygon(points);
        this.clazzName = Rectangle.name;
    }

    clone() {
        return new Rectangle(this.left, this.top, this.width, this.height);
    }

    equals(rect) {
        if (this.clazzName === "Rectangle") {
            return this.left === rect.left
                && this.top === rect.top
                && this.width === rect.width
                && this.height === rect.height;
        }
        return false;
    }

    /**
     * 提取外接矩形
     *
     * @returns {{left: Number, top: Number, width: Number, height: Number}}
     * @private
     */
    _getBoundingRect() {
        return {
            left: this.left,
            top: this.top,
            right: this.right,
            bottom: this.bottom,
            width: this.width,
            height: this.height
        };
    }

    /**
     * 仅做外接矩形碰撞即可
     *
     * @param point
     */
    hitTestPoint(point) {
        return this._hitTestPointByBoundingRect(point);
    }

    hitTestRectangle(rect2) {

        let rect1 = this;

        if (rect2.clazzName === "Rectangle") {
            //console.log("hitTestRectangle", rect1, rect2);
            if ((rect1.right > rect2.left)
                && (rect1.left < rect2.right)
                && (rect1.bottom > rect2.top)
                && (rect1.top < rect2.bottom))
                return true;
        } else {
            return this.hitTestPolygon(rect2);
        }

        return false;
    }

    move(offsetX, offsetY) {
        return new Rectangle(this.left + offsetX, this.top + offsetY, this.width, this.height);
    }

    scale(scaleX, scaleY) {
        return new Rectangle(this.left * scaleX, this.top * scaleY, this.width * scaleX, this.height * scaleY);
    }

}