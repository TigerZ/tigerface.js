function drawRoundedPolygon(shape, props) {
    const {
        radius = 10,
        precision = 10,
        fillStyle,
        lineWidth,
        strokeStyle,
    } = props;

    this.drawPolygon(shape.convertRounded(radius, precision), {
        fillStyle,
        strokeStyle,
        lineWidth,
    });
}

export default drawRoundedPolygon;
