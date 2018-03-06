var React = require('react');

/**
 * User: zyh
 * Date: 2018/2/27.
 * Time: 22:32.
 */
export default class CanvasSpriteComponent extends React.Component {
    constructor() {
        super(...arguments);
    }

    render() {
        return React.createElement('CanvasSprite', {}, this.props.children);
    }
};
