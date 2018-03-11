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
// const data = [5, 20, 25, 18, 12, 7, 15];
const colors = ['red', 'brown', 'blue', 'green', 'orange', 'olive', 'purple', 'deepskyblue', 'teal', 'maroon'];
const data = [
    {name: '何敏', num: 5},
    {name: '王菲丽', num: 20},
    {name: '张思雨', num: 25},
    {name: '王明清', num: 18},
    {name: '袁立', num: 12},
    {name: '邢惠珊', num: 7},
    {name: '李安和', num: 15}
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
            <div>
                <BarChart style={Style}/>
                <PieChart style={Style}/>
            </div>
        )
    }
}

const Style = {
    float: 'left',
    width: '325px'
};

