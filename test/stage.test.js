import assert from 'assert';
import {Event} from 'tigerface-event';
import {Stage, CanvasLayer, DomSprite, CanvasSprite} from 'tigerface-display';
import {JSDOM} from "jsdom";

const win = new JSDOM(`<!DOCTYPE html><div></div>`).window;
const dom = win.document.querySelector('div');
global.$ = require('jquery')(win);
global.window = win;
global.document = win.document;

describe('测试舞台对象 Stage', () => {
    describe('初始化', () => {
        it('正常', () => {
            let stage = new Stage();
            let l1 = new CanvasLayer();
            let l2 = new DomSprite();
            let d1 = new CanvasSprite();
            stage.addChild(l1);
            stage.addChild(l2);
            l1.addChild(d1);
        });
    });
});