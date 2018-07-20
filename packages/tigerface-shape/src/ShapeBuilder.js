import Circle from './Circle';
import Point from './Point';
import Line from './Line';
import Triangle from './Triangle';
import Rectangle from './Rectangle';

const ShapeType = {
    Point: 'point',
    Line: 'line',
    Circle: 'circle',
    Triangle: 'triangle',
    Rectangle: 'rectangle',
    Stroke: 'stroke',
};

function create(type, opt) {
    switch (type.toLowerCase()) {
        case ShapeType.Point:
            return Point.create(opt);
        case ShapeType.Line:
            return Line.create(opt);
        case ShapeType.Circle:
            return Circle.create(opt);
        case ShapeType.Triangle:
            return Triangle.create(opt);
        case ShapeType.Rectangle:
            return Rectangle.create(opt);
        default:
            return null;
    }
}

export default {
    ShapeType,
    create,
}