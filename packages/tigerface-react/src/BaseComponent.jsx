import React from 'react';
import {Logger} from 'tigerface-common';

/**
 * User: zyh
 * Date: 2018/3/13.
 * Time: 16:33.
 */
export default class BaseComponent extends React.Component {
    constructor() {
        super();
        this.logger = Logger.getLogger(this);
    }
}