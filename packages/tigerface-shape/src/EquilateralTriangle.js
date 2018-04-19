/**
 * User: zyh
 * Date: 2018/3/2.
 * Time: 22:46.
 */
import { Logger } from 'tigerface-common';
import EquilateralPolygon from './EquilateralPolygon';


/**
 * 等边三角形
 *
 * @type {*|void}
 */
class EquilateralTriangle extends EquilateralPolygon {
    static logger = Logger.getLogger('EquilateralTriangle');

    constructor(x, y, radius) {
        super(x, y, radius, 3);
        this.clazzName = 'EquilateralTriangle';
    }
}

export default EquilateralTriangle;
