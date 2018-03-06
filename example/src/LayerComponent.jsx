import React from 'react';
var ReactART = require('react-art');
var Shape = ReactART.Shape;
/**
 * User: zyh
 * Date: 2018/3/6.
 * Time: 18:00.
 */
export default class LayerComponent extends React.Component {
    constructor() {
        super(...arguments);
    }

    render() {
        return React.createElement(Shape, {}, this.props.children);
    }
};