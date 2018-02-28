const React = require('react');
const ReactART = require('react-art');

const Shape = ReactART.Shape;

class Rect extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("Rect");
        return React.createElement(Shape, {}, this.props.children);
    }
}

module.exports = Rect;