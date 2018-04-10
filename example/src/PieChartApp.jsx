import React from 'react';
import ReactDom from 'react-dom';
import { Logger } from 'tigerface-common';
import PieChart from './PieChart';

/**
 * User: zyh
 * Date: 2018/2/25.
 * Time: 22:37.
 */
// const data = [5, 20, 25, 18, 12, 7, 15];

const demoData = [
    { name: '何敏', num: 38 },
    { name: '王菲丽', num: 76 },
    { name: '张思雨', num: 25 },
    { name: '王明清', num: 48 },
    { name: '袁立', num: 22 },
    { name: '邢惠珊', num: 71 },
    { name: '李安和', num: 45 },
];

class AppRoot extends React.Component {
    static logger = Logger.getLogger('example.AppRoot');

    constructor(...args) {
        super(...args);
        this.state = {
            data: [...demoData],
            options: {
                speed: 3,
                font: '12px Kaiti',
            },
        };
    }

    refresh = () => {
        let { data } = this.state;
        if (data.length > 1) {
            data.pop();
        } else {
            data = demoData;
        }
        this.setState({ data: [...data] });
    };

    render() {
        return (
            <div>
                <PieChart
                    className="stage"
                    config={this.state.options}
                    data={this.state.data}
                />
            </div>
        );
    }
}

ReactDom.render(
    <AppRoot />,
    document.getElementById('pieChart') || document.documentElement,
);

