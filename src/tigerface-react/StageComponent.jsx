/* eslint-disable no-unused-vars */
import React from 'react';
import DomSpriteComponent from "./DomSpriteComponent";
import {Stage} from 'tigerface-display'

/**
 * User: zyh
 * Date: 2018/3/7.
 * Time: 23:09.
 */
export default class StageComponent extends DomSpriteComponent {
    constructor(options) {
        super(options);
        this.name = 'Stage'
    }

    _createDisplayObject_(dom, props) {
        return new Stage({}, dom);
    }

    _updateDisplayObject_(defore, after) {
    }

    _onDestroy_() {

    }
}