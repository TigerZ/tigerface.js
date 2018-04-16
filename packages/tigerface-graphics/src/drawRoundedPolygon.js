function drawRoundedPolygon(shape, props) {
    const {
        radius = 10,
        precision = 10,
        lineWidth = 1,
        fillStyle,
        strokeStyle,
        fill = true,
        stroke = true,
        save = false,
        beginPath = true,
        closePath = true,
        restore = false,
    } = props;

    this.drawPolygon(shape.convertRounded(radius, precision), {
        fillStyle,
        strokeStyle,
        lineWidth,
        fill,
        stroke,
        save,
        beginPath,
        closePath,
        restore,
    });
}

export default drawRoundedPolygon;
