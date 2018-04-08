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
class Pentagon extends EquilateralPolygon {
    static logger = Logger.getLogger('Pentagon');

    constructor(x, y, radius) {
        super(x, y, radius, 5);
        this.clazzName = 'Pentagon';
    }
}

export default Pentagon;
