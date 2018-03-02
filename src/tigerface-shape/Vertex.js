/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:38.
 */
import Point from './Point';
export default class Vertex extends Point {
    constructor(x, y) {
        super(x, y);
        this.className = "Vertex";
    }

    getSide() {
        if (this.next) {
            return new Line(this, this.next);
        }
        return undefined;
    }
}