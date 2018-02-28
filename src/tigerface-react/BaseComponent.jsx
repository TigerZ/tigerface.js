var React = require('react');
var ReactART = require('react-art');
var Shape = ReactART.Shape;

/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 22:32.
 */
export default class BaseComponent extends React.Component {
    constructor() {
        super(...arguments);
    }

    render() {
        return React.createElement(Shape, {}, this.props.children);
    }
};
