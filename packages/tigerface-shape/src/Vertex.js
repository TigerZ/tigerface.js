/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:38.
 */
import Point from './Point';
import Line from './Line';
import {Utilities as T} from 'tigerface-common';

export default class Vertex extends Point {
    static convertVertex = function (point) {
        if (typeof point === 'object') {
            if (point.clazzName === 'Vertex')
                return point;
            else if (point.x !== undefined && point.y !== undefined)
                return new Vertex(point.x, point.y);
            else if (T.isArray(point) && point.length === 2)
                return new Vertex(point[0], point[1]);
        }
        return undefined;
    };

    static convertVertexArray = function convertVertexArray (points) {
        let arr = [];
        if (T.isArray(points)) {
            for (let i = 0; i < points.length; i++) {
                let p = Vertex.convertVertex(points[i]);
                if (p) arr.push(p);
                else return undefined;
                if (i > 0) {
                    arr[i - 1].next = p;
                }
            }
            if (arr.length > 1)
                arr[arr.length - 1].next = arr[0];
            //else
            //    console.log(arr.length);
        }
        //console.log(arr);
        return arr;
    };


    constructor(x, y) {
        super(x, y);
        this.clazzName = Vertex.name;
    }

    getSide() {
        if (this.next) {
            return new Line(this, this.next);
        }
        return undefined;
    }
}