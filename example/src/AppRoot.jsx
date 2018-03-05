import React from 'react';
import ReactDOM from 'react-dom';
import {Logger} from 'tigerface-common';
import {EventDispatcher} from 'tigerface-event';

/**
 * User: zyh
 * Date: 2018/2/25.
 * Time: 22:37.
 */
export default class AppRoot extends React.Component {
    static logger = Logger.getLogger("example.AppRoot");

    constructor() {
        super(...arguments);
        //AppRoot.logger.error("初始化 CanvasLayer 实例");
        // AppRoot.logger.warn("下一个时间片","a",{b:2});
        // AppRoot.logger.info("下一个时间片","a",{b:2});
        // AppRoot.logger.debug("下一个时间片","a",{b:2});
        this.ed = new EventDispatcher();
        EventDispatcher.logger.debugTimingBegin("开始");
        this.ed.addEventListener('a', () => {
        });
        this.ed.addEventListener('b', () => {
        });
        EventDispatcher.logger.debugTiming("继续");
        setTimeout(() => {
            this.ed.addEventListener('c', () => {
            });
            EventDispatcher.logger.debugTimingEnd("结束");
        }, 1200);

    }

    render() {
        return (
            <div>
                <div>{"你好，世界 !!!"}</div>
            </div>
        )
    }
};

