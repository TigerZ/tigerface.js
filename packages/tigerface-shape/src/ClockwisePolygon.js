/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:50.
 */

import Polygon from './Polygon';
import Vertex from './Vertex';
import Point from './Point';
import Vector from './Vector';
import {Utilities as T} from 'tigerface-common';

class ClockwisePolygon extends Polygon {
    static convert(ploygon, pc) {
        return new ClockwisePolygon(ploygon.getVertexes(), pc);
    }

    constructor(points, pc) {
        super();
        this.clazzName = ClockwisePolygon.name;

        let pa = Vertex.convertVertexArray(points);
        this.pc = pc || new Point((pa[0].x + pa[1].x + pa[2].x) / 3, (pa[0].y + pa[1].y + pa[2].y) / 3);
        let va = [];
        for (let i = 0; i < pa.length; i++) {
            va.push(new Vector(pa[i].x - this.pc.x, pa[i].y - this.pc.y));
        }
        va.sort(function (a, b) {
            return T.radianToDegree(a.getRadian()) - T.radianToDegree(b.getRadian());
        });
        let npa = [];
        for (let i in va) {
            let p = new Vertex(va[i].x + this.pc.x, va[i].y + this.pc.y);
            npa.push(p);
        }
        //
        // let str = "[";
        // for (let i in npa) {
        //     if (i > 0) str += ",";
        //     str += "{x:" + npa[i].x + ",y:" + npa[i].y + "}";
        // }
        // str += "]";
        // //console.log(str);

        this.initPolygon(npa);

    }
}

export default ClockwisePolygon;