const React = require('react');
const ReactART = require('react-art');

const Shape = ReactART.Shape;

class Circle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        console.log("rendered");
        return React.createElement(Shape, {}, this.props.children);
    }
}

module.exports = Circle;