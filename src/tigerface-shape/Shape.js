import {Logger} from 'tigerface-common';
/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 13:03.
 */
export default class Shape {
    static logger = Logger.getLogger(Shape.logger);

    constructor() {
        this.className = Shape.name;
    }

    /**
     * 提取外接矩形
     *
     * @returns {{left: Number, top: Number, width: Number, height: Number}}
     * @private
     */
    _getBoundingRect_() {
        Shape.logger.error("此方法必须被覆盖");
    }

    /**
     * 提取外接矩形（缓存）
     * @returns {{left: Number, top: Number, width: Number, height: Number}}
     */
    getBoundingRect() {
        if (!this.boundingRect)
            this.boundingRect = this._getBoundingRect_();
        return this.boundingRect;
    }

    /**
     * 点碰撞检测
     *
     * @param point
     * @returns {boolean}
     */
    hitTestPoint(point) {
        Shape.logger.error("此方法必须被覆盖");
    }

    /**
     * 线碰撞检测
     * @param point
     * @returns {boolean}
     */
    hitTestLine(line) {
        Shape.logger.error("此方法必须被覆盖");
    }

    /**
     * 多边形碰撞测试
     *
     * @param polygon
     * @returns {boolean}
     */
    hitTestPolygon(polygon) {
        Shape.logger.error("此方法必须被覆盖");
    }

    /**
     * 旋转
     * @param radian 弧度
     * @param origin 原点 可选，缺省为（0，0）
     * @returns {Shape}
     */
    rotate(radian, origin) {
        Shape.logger.error("此方法必须被覆盖");
    }

    /**
     * 移动
     *
     * @param offsetX X轴平移量
     * @param offsetY Y轴平移量
     * @returns {Shape}
     */
    move(offsetX, offsetY) {
        Shape.logger.error("此方法必须被覆盖");
    }

    /**
     * 缩放
     *
     * @param scaleX
     * @param scaleY
     * @returns {Shape}
     */
    scale(scaleX, scaleY) {
        Shape.logger.error("此方法必须被覆盖");
    }

    /**
     * 复制
     *
     * @returns {Shape}
     */
    clone() {
        Shape.logger.error("此方法必须被覆盖");
    }
}