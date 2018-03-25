import React from 'react';
import { Logger } from 'tigerface-common';

/**
 * User: zyh
 * Date: 2018/3/13.
 * Time: 16:33.
 */
class BaseComponent extends React.PureComponent {
    constructor() {
        super();
        this.logger = Logger.getLogger(this);
    }
}

export default BaseComponent;
