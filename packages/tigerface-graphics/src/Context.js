import { EventDispatcher } from 'tigerface-event';

export default class Context extends EventDispatcher {
    constructor(options) {
        super({
            clazzName: Context.name,
            devicePixelRatio: 1,
        });
        this.assign(options);

        this.context = this.canvas.getContext('2d');

        this.save = this.context.save.bind(this.context);
        this.restore = this.context.restore.bind(this.context);
        // this.getContext = this.context.getContext.bind(this.context);
        // this.createEvent = this.context.createEvent.bind(this.context);
        // this.toDataURL = this.context.toDataURL.bind(this.context);

        this.createImageData = this.context.createImageData.bind(this.context);
        this.getImageData = this.context.getImageData.bind(this.context);
        this.putImageData = this.context.putImageData.bind(this.context);

        this.drawImage = this.context.drawImage.bind(this.context);

        this.fillText = this.context.fillText.bind(this.context);
        this.strokeText = this.context.strokeText.bind(this.context);
        this.measureText = this.context.measureText.bind(this.context);

        this.scale = this.context.scale.bind(this.context);
        this.rotate = this.context.rotate.bind(this.context);
        this.translate = this.context.translate.bind(this.context);
        this.transform = this.context.transform.bind(this.context);
        this.setTransform = this.context.setTransform.bind(this.context);

        this.fill = this.context.fill.bind(this.context);
        this.stroke = this.context.stroke.bind(this.context);
        this.beginPath = this.context.beginPath.bind(this.context);
        this.moveTo = this.context.moveTo.bind(this.context);
        this.closePath = this.context.closePath.bind(this.context);
        this.lineTo = this.context.lineTo.bind(this.context);
        this.clip = this.context.clip.bind(this.context);
        this.quadraticCurveTo = this.context.quadraticCurveTo.bind(this.context);
        this.bezierCurveTo = this.context.bezierCurveTo.bind(this.context);
        this.arc = this.context.arc.bind(this.context);
        this.arcTo = this.context.arcTo.bind(this.context);
        this.isPointInPath = this.context.isPointInPath.bind(this.context);

        this.rect = this.context.rect.bind(this.context);
        this.fillRect = this.context.fillRect.bind(this.context);
        this.strokeRect = this.context.strokeRect.bind(this.context);
        this.clearRect = this.context.clearRect.bind(this.context);

        this.createLinearGradient = this.context.createLinearGradient.bind(this.context);
        this.createPattern = this.context.createPattern.bind(this.context);
        this.createRadialGradient = this.context.createRadialGradient.bind(this.context);
        // this.addColorStop = this.context.addColorStop.bind(this.context);

        // this.context.mozImageSmoothingEnabled = false;
        // this.context.webkitImageSmoothingEnabled = false;
        // this.context.msImageSmoothingEnabled = false;
        // this.context.imageSmoothingEnabled = true;
    }

    /** *******************************************************************
     *
     * 颜色、样式和阴影
     *
     ********************************************************************* */

    get fillStyle() {
        return this.context.fillStyle;
    }

    set fillStyle(value) {
        this.context.fillStyle = value;
    }

    get strokeStyle() {
        return this.context.strokeStyle;
    }

    set strokeStyle(value) {
        this.context.strokeStyle = value;
    }

    get shadowColor() {
        return this.context.shadowColor;
    }

    set shadowColor(value) {
        this.context.shadowColor = value;
    }

    get shadowBlur() {
        return this.context.shadowBlur;
    }

    set shadowBlur(value) {
        this.context.shadowBlur = value;
    }

    get shadowOffsetX() {
        return this.context.shadowOffsetX / this.devicePixelRatio;
    }

    set shadowOffsetX(value) {
        this.context.shadowOffsetX = value * this.devicePixelRatio;
    }

    get shadowOffsetY() {
        return this.context.shadowOffsetY / this.devicePixelRatio;
    }

    set shadowOffsetY(value) {
        this.context.shadowOffsetY = value * this.devicePixelRatio;
    }

    /** *******************************************************************
     *
     * 线条样式
     *
     ******************************************************************** */

    get lineCap() {
        return this.context.lineCap;
    }

    set lineCap(value) {
        this.context.lineCap = value;
    }

    get lineJoin() {
        return this.context.lineJoin;
    }

    set lineJoin(value) {
        this.context.lineJoin = value;
    }

    get lineWidth() {
        return this.context.lineWidth;
    }

    set lineWidth(value) {
        this.context.lineWidth = value;
    }

    get miterLimit() {
        return this.context.miterLimit;
    }

    set miterLimit(value) {
        this.context.miterLimit = value;
    }

    /** *******************************************************************
     *
     * 合成
     *
     ******************************************************************** */

    get globalAlpha() {
        return this.context.globalAlpha;
    }

    set globalAlpha(value) {
        this.context.globalAlpha = value;
    }

    get globalCompositeOperation() {
        return this.context.globalCompositeOperation;
    }

    set globalCompositeOperation(value) {
        this.context.globalCompositeOperation = value;
    }

    /** *******************************************************************
     *
     * 像素操作
     *
     ******************************************************************** */

    get width() {
        return this.context.width;
    }

    set width(value) {
        this.context.width = value;
    }

    get height() {
        return this.context.height;
    }

    set height(value) {
        this.context.height = value;
    }

    get data() {
        return this.context.data;
    }

    set data(value) {
        this.context.data = value;
    }

    /** *******************************************************************
     *
     * 文本
     *
     ******************************************************************** */

    get font() {
        return this.context.font;
    }

    set font(value) {
        this.context.font = value;
    }

    get textAlign() {
        return this.context.textAlign;
    }

    set textAlign(value) {
        this.context.textAlign = value;
    }

    get textBaseline() {
        return this.context.textBaseline;
    }

    set textBaseline(value) {
        this.context.textBaseline = value;
    }
}
