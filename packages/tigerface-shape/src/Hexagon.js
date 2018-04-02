/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:03.
 */
import { Logger } from 'tigerface-common';
import EquilateralPolygon from './EquilateralPolygon';

/**
 * 根据两边长夹角创建三角形
 *
 * @type {*|void}
 */
class Hexagon extends EquilateralPolygon {
    static logger = Logger.getLogger(Hexagon.name);

    constructor(x, y, radius) {
        super(x, y, radius, 6);
        this.clazzName = Hexagon.name;
    }
}

export default Hexagon;