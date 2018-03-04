/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:50.
 */

import Polygon from './Polygon';

export default class ClockwisePolygon extends Polygon {
    static convert(ploygon, pc) {
        return new ClockwisePolygon(ploygon.getVertexes(), pc);
    }

    constructor(points, pc) {
        super();
        var pa = convertVertexArray(points);
        this.pc = pc || new Point((pa[0].x + pa[1].x + pa[2].x) / 3, (pa[0].y + pa[1].y + pa[2].y) / 3);
        var va = [];
        for (var i = 0; i < pa.length; i++) {
            va.push(new Vector(pa[i].x - this.pc.x, pa[i].y - this.pc.y));
        }
        va.sort(function (a, b) {
            return T.radianToDegree(a.getRadian()) - T.radianToDegree(b.getRadian());
        });
        var npa = [];
        for (var i in va) {
            var p = new Vertex(va[i].x + this.pc.x, va[i].y + this.pc.y);
            npa.push(p);
        }

        var str = "[";
        for (var i in npa) {
            if (i > 0) str += ",";
            str += "{x:" + npa[i].x + ",y:" + npa[i].y + "}";
        }
        str += "]";
        //console.log(str);

        this.initPolygon(npa);
        this.className = ConvexPolygon.name;
    }
}