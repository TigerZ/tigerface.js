/* eslint-disable no-unused-vars */
import React from 'react';
import {Logger} from 'tigerface-common';
import BarChart, {putData} from './BarChart';

/**
 * User: zyh
 * Date: 2018/2/25.
 * Time: 22:37.
 */

putData(
    [5, 20, 25, 18, 12, 7, 16],
    {
        speed: 1,
        font:'12px Times New Roman',
        style: {
            backgroundColor: 'rgba(255,255,0,0.2)'
        }
    }
);

export default class AppRoot extends React.Component {
    static logger = Logger.getLogger("example.AppRoot");

    constructor(...args) {
        super(...args);
    }

    render() {
        return (
            <BarChart/>
        )
    }
}

