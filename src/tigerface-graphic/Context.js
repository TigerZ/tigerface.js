import Canvas from 'canvas';
export default class Context {
    constructor(ctx) {
        if(ctx) this.context = ctx;

        this.save = (...args)=>this.context.save(...args);
        this.restore = (...args)=>this.context.restore.bind(...args);
        //this.getContext = (...args)=>this.context.getContext(...args);
        //this.createEvent = (...args)=>this.context.createEvent(...args);
        //this.toDataURL = (...args)=>this.context.toDataURL(...args);

        this.createImageData = (...args)=>this.context.createImageData(...args);
        this.getImageData = (...args)=>this.context.getImageData(...args);
        this.putImageData = (...args)=>this.context.putImageData(...args);

        this.drawImage = (...args)=>this.context.drawImage(...args);

        this.fillText = (...args)=>this.context.fillText(...args);
        this.strokeText = (...args)=>this.context.strokeText(...args);
        this.measureText = (...args)=>this.context.measureText(...args);

        this.scale = (...args)=>this.context.scale(...args);
        this.rotate = (...args)=>this.context.rotate(...args);
        this.translate = (...args)=>this.context.translate(...args);
        this.transform = (...args)=>this.context.transform(...args);
        this.setTransform = (...args)=>this.context.setTransform(...args);

        this.fill = (...args)=>this.context.fill(...args);
        this.stroke = (...args)=>this.context.stroke(...args);
        this.beginPath = (...args)=>this.context.beginPath(...args);
        this.moveTo = (...args)=>this.context.moveTo(...args);
        this.closePath = (...args)=>this.context.closePath(...args);
        this.lineTo = (...args)=>this.context.lineTo(...args);
        this.clip = (...args)=>this.context.clip(...args);
        this.quadraticCurveTo = (...args)=>this.context.quadraticCurveTo(...args);
        this.bezierCurveTo = (...args)=>this.context.bezierCurveTo(...args);
        this.arc = (...args)=>this.context.arc(...args);
        this.arcTo = (...args)=>this.context.arcTo(...args);
        this.isPointInPath = (...args)=>this.context.isPointInPath(...args);

        this.rect = (...args)=>this.context.rect(...args);
        this.fillRect = (...args)=>this.context.fillRect(...args);
        this.strokeRect = (...args)=>this.context.strokeRect(...args);
        this.clearRect = (...args)=>this.context.clearRect(...args);

        this.createLinearGradient = (...args)=>this.context.createLinearGradient(...args);
        this.createPattern = (...args)=>this.context.createPattern(...args);
        this.createRadialGradient = (...args)=>this.context.createRadialGradient(...args);
        //this.addColorStop = (...args)=>this.context.addColorStop(...args);
    }

    get context() {
        if(!this._context_) {
            this._context_ = new Canvas(640, 480).getContext('2d');
        }
        return this._context_;
    }

    set context(ctx) {
        this._context_ = ctx;
    }

    /*********************************************************************
     *
     * 颜色、样式和阴影
     *
     **********************************************************************/

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
        return this.context.shadowOffsetX;
    }

    set shadowOffsetX(value) {
        this.context.shadowOffsetX = value;
    }

    get shadowOffsetY() {
        return this.context.shadowOffsetY;
    }

    set shadowOffsetY(value) {
        this.context.shadowOffsetY = value;
    }

    /*********************************************************************
     *
     * 线条样式
     *
     *********************************************************************/

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

    /*********************************************************************
     *
     * 合成
     *
     *********************************************************************/

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

    /*********************************************************************
     *
     * 像素操作
     *
     *********************************************************************/

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

    /*********************************************************************
     *
     * 文本
     *
     *********************************************************************/

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