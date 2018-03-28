function drawRoundedPolygon(shape, radius, drawStyle, precision) {
    this.drawPolygon(shape.convertRounded(radius, precision), drawStyle);
}

export default drawRoundedPolygon;
