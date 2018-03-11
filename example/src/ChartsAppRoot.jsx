/* eslint-disable no-unused-vars */
import React from 'react';
import {Logger} from 'tigerface-common';
import BarChart, {putData as putDataToBarChart} from './BarChart';
import PieChart, {putData as putDataToPieChart} from './PieChart';

/**
 * User: zyh
 * Date: 2018/2/25.
 * Time: 22:37.
 */

putDataToBarChart(
    [5, 20, 25, 18, 12, 7, 16, 24, 15, 8],
    {
        speed: 3,
        font: '12px Courier',
        style: {
            backgroundColor: 'rgba(255,255,0,0.2)'
        },
        colors: ['red', 'brown', 'blue', 'green', 'orange', 'olive', 'purple', 'deepskyblue', 'teal', 'maroon']
    }
);

putDataToPieChart(
    [5, 20, 25, 18, 12, 7, 16, 24, 15, 8],
    {
        speed: 3,
        font: '12px Courier',
        style: {
            backgroundColor: 'rgba(255,255,0,0.2)'
        },
        colors: ['red', 'brown', 'blue', 'green', 'orange', 'olive', 'purple', 'deepskyblue', 'teal', 'maroon']
    }
);

export default class AppRoot extends React.Component {
    static logger = Logger.getLogger("example.AppRoot");

    constructor(...args) {
        super(...args);
    }

    render() {
        const props = this.props;
        return (
            <div>
                <BarChart name={'BarChart'} style={Style}/>
                <PieChart name={'PieChart'} style={Style}/>
            </div>
        )
    }
}

const Style = {
    float: 'left',
    width: '325px'
};

