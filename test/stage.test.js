import assert from 'assert';
import {Event} from 'tigerface-event';
import {Stage} from 'tigerface-display';
import {JSDOM} from "jsdom";

const win = new JSDOM(`<!DOCTYPE html><div></div>`).window;
const dom = win.document.querySelector('div');
global.$ = require('jquery')(win);
global.window = win;
global.document = win.document;

describe('测试舞台对象 Stage', () => {
    describe('初始化', () => {
        it('正常', () => {
            let stage = new Stage({}, dom);
        });
    });
});