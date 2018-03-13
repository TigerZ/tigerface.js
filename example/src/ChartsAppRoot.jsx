/* eslint-disable no-unused-vars */
import React from 'react';
import {Logger} from 'tigerface-common';
import {default as BarChart, putData as putDataToBarChart} from './BarChart';
import {default as PieChart, putData as putDataToPieChart} from './PieChart';

/**
 * User: zyh
 * Date: 2018/2/25.
 * Time: 22:37.
 */
// const data = [5, 20, 25, 18, 12, 7, 15];
const colors = ['red', 'brown', 'blue', 'green', 'orange', 'olive', 'purple', 'deepskyblue', 'teal', 'maroon'];
const data = [
    {name: '何敏', num: 38},
    {name: '王菲丽', num: 76},
    {name: '张思雨', num: 25},
    {name: '王明清', num: 48},
    {name: '袁立', num: 22},
    {name: '邢惠珊', num: 71},
    {name: '李安和', num: 45}
];
putDataToBarChart(
    data,
    {
        speed: 3,
        font: '12px Kaiti',
        style: {
            backgroundColor: 'rgba(255,255,0,0.2)'
        },
        colors
    }
);

putDataToPieChart(
    data,
    {
        speed: 3,
        font: '12px Kaiti',
        style: {
            backgroundColor: 'rgba(255,255,0,0.2)'
        },
        colors
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
            <div id={'AppRoot'}>
                <BarChart style={Style}/>
                <PieChart style={Style}/>
            </div>
        )
    }
}

const Style = {
    float: 'left',
    width: '400px',
    margin: '5px'
};

