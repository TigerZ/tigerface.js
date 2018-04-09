/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:03.
 */
import { Logger } from 'tigerface-common';
import EquilateralPolygon from './EquilateralPolygon';

class Hexagon extends EquilateralPolygon {
    static logger = Logger.getLogger('Hexagon');

    constructor(x, y, radius) {
        super(x, y, radius, 6);
        this.clazzName = 'Hexagon';
    }
}

export default Hexagon;
