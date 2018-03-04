/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:03.
 */
import Rectangle from "./Rectangle";

export default class Square extends Rectangle {
    constructor(x, y, width) {
        super(x, y, width, width);
        this.className = Square.name;
    }
}