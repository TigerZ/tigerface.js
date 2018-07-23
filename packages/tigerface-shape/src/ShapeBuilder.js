import Circle from './Circle';
import Point from './Point';
import Line from './Line';
import Triangle from './Triangle';
import Rectangle from './Rectangle';
import { Logger } from 'tigerface-common';

const ShapeType = {
    Point: 'point',
    Line: 'line',
    Circle: 'circle',
    Triangle: 'triangle',
    InCircle: 'incircle',
    Rectangle: 'rectangle',
    Stroke: 'stroke',
};

const logger = Logger.getLogger('ShapeBuilder');

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
        case ShapeType.InCircle:
        case ShapeType.Rectangle:
            return Rectangle.create(opt);
        default:
            logger.error(`不支持的图形类型："${type}"`);
            return null;
    }
}

export default {
    ShapeType,
    create,
}