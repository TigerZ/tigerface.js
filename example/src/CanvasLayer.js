import {Surface} from 'react-art';
import Circle from './Circle';
import Rect from './Rect';
import React from 'react';
import Debuggable from "../../src/common/Debuggable";

export default class CanvasLayer extends React.Component {
    constructor() {
        super(...arguments);

    }

    render() {
        return (
            <Surface width={400} height={300}>
                <Circle>
                    <Rect/>
                </Circle>
            </Surface>
        )
    }
};