import { EventDispatcher } from 'tigerface-event';
import { Vector, Line } from 'tigerface-shape';

class Link extends EventDispatcher {
    constructor(from, to) {
        super({
            from,
            to,
        });
        from.addLink(this);
        to.addLink(this);
    }

    power(endPoint) {
        let power = Vector.byPoint(this.from.pos, this.to.pos);
        if (endPoint === this.to) {
            power = power.reverse();
        }
        return this.peer(endPoint).fix ? power : power.scale(0.5, 0.5);
    }

    peer(endPoint) {
        return endPoint === this.from ? this.to : this.from;
    }

    drawLine(g) {
        g.drawLine(Line.byPoint(this.from.pos, this.to.pos), {
            strokeStyle: 'grey',
        });
    }
}

export default Link;
