import { CanvasSprite } from 'tigerface-display';
import { Utilities as T } from 'tigerface-common';
import { Vector } from 'tigerface-shape';

class EndPoint extends CanvasSprite {
    constructor(x, y, fix = false) {
        super({
            x,
            y,
            width: 20,
            height: 20,
            origin: { x: 10, y: 10 },
            fix,
        });
        this.links = [];
        this.endPoints = [];
        if (!this.fix) {
            this.enableDrag();
            this.onDragStart = () => {
                this.fix = true;
            };
            this.onDragEnd = () => {
                this.fix = false;
            };
        }
        this.onEnterFrame = () => {
            if (!this.fix) {
                const power = this.power();
                this.x += T.round(power.x / 100, 2);
                this.y += T.round(power.y / 100, 2);
            }
        };
    }

    addLink(link) {
        this.links.push(link);
    }

    isLinked(endPoint) {
        for (let i = 0; i < this.links.length; i += 1) {
            if (this.links[i].peer === endPoint) return false;
        }
        return false;
    }

    power() {
        let power = null;
        this.links.forEach((link) => {
            power = power ? power.sum(link.power(this)) : link.power(this);
        });
        this.endPoints.forEach((other) => {
            if (other !== this) {
                let v = Vector.byPoint(other.pos, this.pos);
                const m = v.getMagnitude();
                if (m < 100) {
                    v = Vector.byRadian(v.getRadian(), 100 - m);
                    v = other.fix ? v : v.scale(0.5, 0.5);
                    power = power ? power.sum(v) : v;
                }
            }
        });

        return power;
    }

    paint(g) {
        g.drawRectangle(this.boundingRect, {
            strokeStyle: 'grey',
            fillStyle: this.fix ? 'red' : 'white',
        });
    }
}

export default EndPoint;
